import { defineStore } from 'pinia';
import * as api from '@/api/learningContent';

// 学習内容の状態管理を行うPiniaストア
export const useLearningContentStore = defineStore('learningContent', {
  // ストアの状態を定義
  state: () => ({
    contents: [], // 学習内容一覧
    pagination: {}, // ページネーション情報（複数ページ間の移動で使用）
    loading: false, // APIリクエスト中のローディング状態（ローディング表示制御用）
    error: null, // API/コンソール用エラーメッセージ（単一文字列：ウィザード全体のエラーのみ扱う）
  }),

  // 状態から派生した値（キャッシュされる）
  getters: {
    // IDに基づいて特定の学習内容を検索（詳細ページ遷移時のキャッシュ活用のため）
    contentById: (state) => (id) => {
      return state.contents.find((content) => content.id === id);
    },
  },

  // 状態を変更するアクション
  actions: {
    // 学習内容一覧を取得
    async fetchContents(page = 1) {
      this.loading = true;
      this.error = null;
      try {
        const params = { page, per_page: 20 };
        // APIレスポンスには学習内容本体とページネーション情報が混在しているため、一旦responseで受け取る
        const response = await api.fetchLearningContents(params);

        // コンテンツ本体とページネーション情報を分けてストアに保存（一覧表示とページ移動UIで別々に使用するため）
        this.contents = response.data.data;
        this.pagination = response.data.meta;
      } catch (error) {
        this.error = '学習内容の読み込みに失敗しました。';
        console.error('学習内容のフェッチ中にエラーが発生しました:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 新しい学習内容を作成
    async createContent(data) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.createLearningContent(data);
        const newContent = response.data.data || response.data;

        // sectionsStoreとの整合性を保つため、作成時に両ストアへ追加
        if (newContent.sections && newContent.sections.length > 0) {
          // 動的インポートで循環参照回避
          const { useSectionStore } = await import('./sections');
          const sectionStore = useSectionStore();
          sectionStore.sections.push(...newContent.sections);
        }
        // 新規作成後一覧表示を最新の状態にするため再フェッチ
        await this.fetchContents();
        return newContent;
      } catch (error) {
        this.error = '学習内容の作成に失敗しました。';
        console.error('学習内容の作成中にエラーが発生しました:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 既存の学習内容を更新
    async updateContent(id, data) {
      this.loading = true;
      try {
        const response = await api.updateLearningContent(id, data);
        const index = this.contents.findIndex((c) => c.id === id);
        // findIndex()が見つからない場合-1を返すため、存在チェックしてからストア更新（エラー防止）
        if (index !== -1) {
          // ストア内の該当コンテンツを最新データで置き換え（API再取得せずにUIへ即座反映するため）
          this.contents[index] = response.data.data;
        }
        return response.data;
      } catch (error) {
        console.error('学習内容の更新に失敗しました:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 学習内容を削除
    async deleteContent(id) {
      this.loading = true;
      try {
        await api.deleteLearningContent(id);
        // ストアから該当コンテンツを削除（API再取得せずにUIへ即座反映するため）
        this.contents = this.contents.filter((c) => c.id !== id);
      } catch (error) {
        console.error('学習内容の削除に失敗しました:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 学習内容のステータス（完了/再開）を更新
    // ステータス更新処理の重複を避けるため、汎用ヘルパーとして定義
    async _updateStatus(apiCall, id, successMessage) {
      this.loading = true;
      try {
        const response = await apiCall(id);
        const index = this.contents.findIndex((c) => c.id === id);
        // findIndex()が見つからない場合-1を返すため、存在チェックしてからストア更新（エラー防止）
        if (index !== -1) {
          // ストア内の該当コンテンツを最新データで置き換え（API再取得せずにUIへ即座反映するため）
          this.contents[index] = response.data.data;
        }
        return { success: true, message: successMessage };
      } catch (error) {
        console.error(`学習コンテンツのステータス更新中にエラーが発生しました (ID: ${id}):`, error);
        return { success: false, error };
      } finally {
        this.loading = false;
      }
    },

    // 学習内容を完了状態に設定
    completeContent(id) {
      return this._updateStatus(api.completeLearningContent, id, '学習を完了しました。');
    },

    // 学習内容を再開状態に設定
    reopenContent(id) {
      return this._updateStatus(api.reopenLearningContent, id, '学習を再開しました。');
    },

    // TODO:ユーザー任意の絞り込み機能で使用予定
    // フィルタ条件を設定してコンテンツを再取得
    setFilter(filters) {
      this.filters = { ...this.filters, ...filters };
      this.fetchContents();
    },

    // TODO:ユーザー任意の絞り込み機能で使用予定
    // ソート条件を設定してコンテンツを再取得
    setSort(sort) {
      this.sort = { ...this.sort, ...sort };
      this.fetchContents();
    },

    // 学習内容の統計情報を更新（セクション変更時の即座反映のため、fetchContents()を待たずに手動更新）
    updateContentStats({ contentId, completed_sections, total_sections }) {
      const index = this.contents.findIndex((c) => c.id === contentId);
      // findIndex()が見つからない場合-1を返すため、存在チェックしてからストア更新（エラー防止）
      if (index !== -1) {
        this.contents[index].completed_sections = completed_sections;
        this.contents[index].total_sections = total_sections;
      }
    },
  },
});
