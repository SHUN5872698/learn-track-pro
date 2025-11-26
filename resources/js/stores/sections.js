import { defineStore } from 'pinia';
import * as api from '@/api/sections';
import { useLearningContentStore } from '@/stores/learningContent';

// セクションの状態管理を行うPiniaストアを定義
export const useSectionStore = defineStore('sections', {
  // ストアの状態を定義
  state: () => ({
    sections: [], // セクション一覧
    loading: false, // APIリクエスト中のローディング状態
    error: null, // API/コンソール用エラーメッセージ（単一文字列：ウィザード全体のエラーのみ扱う）
  }),

  // 状態から派生した値（キャッシュされる）
  getters: {
    // 指定された学習コンテンツIDに紐づくセクションをフィルタリングして取得
    sectionsByContentId: (state) => (contentId) => {
      return state.sections.filter((section) => section.learning_content_id === contentId);
    },
    // IDに基づいて特定のセクションを検索して取得
    sectionById: (state) => (id) => {
      return state.sections.find((section) => section.id === id);
    },
  },

  // 状態を変更するアクション
  actions: {
    // 指定された学習コンテンツIDのセクションをAPIから非同期でフェッチ
    async fetchSections(learningContentId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.fetchSections(learningContentId);
        // 取得するコンテンツID以外のセクションを退避（＝キャッシュとして残す）
        const otherSections = this.sections.filter((s) => s.learning_content_id !== learningContentId);
        // 退避したセクション + APIから取得した最新のセクション で配列を再構築
        this.sections = [...otherSections, ...response.data.data];
      } catch (error) {
        this.error = 'セクションの読み込みに失敗しました。';
        console.error('セクションのフェッチ中にエラーが発生しました:', error);
      } finally {
        this.loading = false;
      }
    },

    // 新しいセクションをAPIに作成
    async createSection(data) {
      this.loading = true;
      try {
        const response = await api.createSection(data);
        this.sections.push(response.data.data);
        // 学習コンテンツの統計情報を更新
        const learningContentStore = useLearningContentStore();
        await learningContentStore.fetchContents(); // 更新された統計情報を取得するために再フェッチ
      } catch (error) {
        console.error('セクションの作成中にエラーが発生しました:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 既存のセクションをAPIで更新
    async updateSection(id, data) {
      this.loading = true;
      try {
        const response = await api.updateSection(id, data);
        const index = this.sections.findIndex((s) => s.id === id);
        if (index !== -1) {
          this.sections[index] = response.data.data;
        }
      } catch (error) {
        console.error('セクションの更新中にエラーが発生しました:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // セクションをAPIで削除
    async deleteSection(id) {
      this.loading = true;
      try {
        const sectionToDelete = this.sectionById(id);
        if (!sectionToDelete) return;
        await api.deleteSection(id);
        this.sections = this.sections.filter((s) => s.id !== id);
        // 学習コンテンツの統計情報を更新
        const learningContentStore = useLearningContentStore();
        await learningContentStore.fetchContents(); // 更新された統計情報を取得するために再フェッチ
      } catch (error) {
        console.error('セクションの削除中にエラーが発生しました:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // セクションのステータスをAPIで更新
    async updateSectionStatus(id, status) {
      this.loading = true;
      try {
        const response = await api.updateSectionStatus(id, status);
        const index = this.sections.findIndex((s) => s.id === id);
        if (index !== -1) {
          // セクションを更新
          this.sections[index] = { ...response.data.data };

          // 統計情報を手動で計算して更新
          const learningContentId = this.sections[index].learning_content_id;

          // このコンテンツの全セクションから完了数をカウント
          const completedCount = this.sections.filter((s) => s.learning_content_id === learningContentId && s.status === 'completed').length;

          // learningContentストアの統計を更新
          const contentStore = useLearningContentStore();
          const contentIndex = contentStore.contents.findIndex((c) => c.id === learningContentId);

          // 進捗率の再計算
          if (contentIndex !== -1) {
            const content = contentStore.contents[contentIndex];
            content.completed_sections = completedCount;
            content.progress = content.total_sections > 0 ? Math.round((completedCount / content.total_sections) * 100) : 0;
          }
        }
      } catch (error) {
        console.error('セクションステータスの更新中にエラーが発生しました:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 複数のセクションを一括で更新（追加、更新、削除）
    async bulkUpdateSections(learningContentId, data) {
      this.loading = true;
      try {
        // 一括更新後、そのコンテンツの全てのセクションを再フェッチするのが最善
        const response = await api.bulkUpdateSections(learningContentId, data);

        // 取得するコンテンツID以外のセクションを退避（キャッシュとして残す）
        const otherSections = this.sections.filter((s) => s.learning_content_id !== learningContentId);
        // 退避したセクション + APIから取得した最新のセクション で配列を再構築
        this.sections = [...otherSections, ...response.data.data];

        // セクション構成の変更を親コンテンツの統計情報（総数など）に反映させるため再取得
        const learningContentStore = useLearningContentStore();
        await learningContentStore.fetchContents();
      } catch (error) {
        console.error('セクションの一括更新中にエラーが発生しました:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // セクションの完了状態をトグルする
    toggleSectionComplete(section) {
      const newStatus = section.status === 'completed' ? 'in_progress' : 'completed';
      return this.updateSectionStatus(section.id, newStatus);
    },
  },
});
