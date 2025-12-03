import { defineStore } from 'pinia';
import * as api from '@/api/learningSession';

export const useLearningSessionStore = defineStore('learningSession', {
  // ストアの状態を定義
  state: () => ({
    sessions: [], // 学習記録一覧
    statistics: {}, // 統計データ
    pagination: {}, // ページネーション情報
    loading: false, // APIリクエスト中のローディング状態
    error: null, // API/コンソール用エラーメッセージ（単一文字列：ウィザード全体のエラーのみ扱う）
    errors: {}, // フロントエンド用バリデーションエラーメッセージ（複数文字列：個別フィールドのエラーのみ扱う）
  }),

  // 状態から派生した値（キャッシュされる）
  getters: {
    // IDに基づいて特定の学習記録を検索して取得
    sessionById: (state) => (id) => {
      return state.sessions.find((session) => session.id === id);
    },
    // コンテンツIDに基づいて学習記録をフィルタリングして取得
    sessionsByContentId: (state) => (contentId) => {
      return state.sessions.filter((session) => session.learning_content_id === contentId);
    },
    // セクションIDに基づいて学習記録をフィルタリングして取得
    sessionsBySectionId: (state) => (sectionId) => {
      return state.sessions.filter((session) => session.section_id === sectionId);
    },
    // 全ての学習記録の合計学習時間を計算して取得
    totalStudyMinutes: (state) => {
      return state.sessions.reduce((total, session) => total + session.study_minutes, 0);
    },
    // バリデーションエラーがあるかチェック
    hasSessionErrors: (state) => {
      return state.errors && Object.keys(state.errors).length > 0;
    },
  },

  // 状態を変更するアクション
  actions: {
    // 学習記録一覧をAPIから非同期でフェッチ
    async fetchLearningSessions(params = {}) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.fetchLearningSessions(params);
        console.log('API Response:', response.data);

        this.sessions = response.data.data || response.data;

        console.log('Sessions loaded:', this.sessions.length);
      } catch (error) {
        this.error = '学習記録の読み込みに失敗しました。';
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    // 単一の学習記録を取得
    async fetchLearningSession(id) {
      try {
        const response = await api.fetchLearningSession(id);
        console.log('Single session loaded:', response.data);

        // 既存のセッション一覧に追加または更新
        const index = this.sessions.findIndex((s) => s.id === id);
        if (index !== -1) {
          this.sessions[index] = response.data.data;
        } else {
          this.sessions.push(response.data.data);
        }

        return response.data.data;
      } catch (error) {
        console.error('学習記録の取得中にエラーが発生しました:', error);
        throw error;
      }
    },

    // 新しい学習記録を作成
    async createLearningSession(data) {
      this.loading = true;
      this.errors = {};
      try {
        const response = await api.createLearningSession(data);
        // API作成成功後、サーバーから返されたデータをそのまま使用（パフォーマンス向上）
        const newSession = response.data.data || response.data;
        this.sessions.push(newSession);
        return newSession;
      } catch (error) {
        // 422エラーの場合、errorsに格納
        if (error?.response?.status === 422) {
          this.errors = error.response.data.errors || {};
        }
        console.error('学習記録の作成中にエラーが発生しました:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 既存の学習記録を更新
    async updateLearningSession(id, data) {
      this.loading = true;
      this.errors = {};
      try {
        const response = await api.updateLearningSession(id, data);
        const updatedSession = response.data.data || response.data;
        // 再フェッチせずに即座にUI反映するため、ストア内の該当データを直接更新
        const index = this.sessions.findIndex((s) => s.id === id);
        if (index !== -1) {
          this.sessions[index] = updatedSession;
        }
        return updatedSession;
      } catch (error) {
        // 422エラーの場合、errorsに格納
        if (error?.response?.status === 422) {
          this.errors = error.response.data.errors || {};
        }
        console.error('学習記録の更新中にエラーが発生しました:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 学習記録を削除
    async deleteLearningSession(id) {
      this.loading = true;
      try {
        await api.deleteLearningSession(id);
        // 再フェッチせずに即座にUI反映するため、ストアから該当データをフィルタリング削除
        this.sessions = this.sessions.filter((s) => s.id !== id);
      } catch (error) {
        console.error('学習記録の削除中にエラーが発生しました:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 統計データをAPIからフェッチ
    async fetchStatistics() {
      this.loading = true;
      try {
        // 4つの統計API（サマリー、月別、技術別、日別）を並列取得してレポートページの初期表示を高速化
        const [summary, monthly, technology, daily] = await Promise.all([api.fetchStatisticsSummary(), api.fetchMonthlyStatistics(), api.fetchTechnologyStatistics(), api.fetchDailyStatistics()]);

        // 各統計データを個別のプロパティに格納（レポートページの各セクションで独立して使用するため）
        this.statistics = {
          summary: summary.data || {},
          monthly: monthly.data || [],
          technology: technology.data || [],
          daily: daily.data || [],
        };
      } catch (error) {
        this.error = '統計データの読み込みに失敗しました。';
        console.error('統計データのフェッチ中にエラーが発生しました:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
