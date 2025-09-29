import { defineStore } from 'pinia';
import * as api from '@/api/learningSession';

export const useLearningSessionStore = defineStore('learningSession', {
  // ストアの状態を定義
  state: () => ({
    sessions: [], // 学習セッションのリスト
    statistics: {}, // 統計データ
    pagination: {}, // ページネーション情報
    loading: false, // APIリクエスト中のローディング状態
    error: null, // エラーメッセージ
  }),

  // 状態から派生した値（キャッシュされる）
  getters: {
    // IDに基づいて特定の学習セッションを検索して取得
    sessionById: (state) => (id) => {
      return state.sessions.find((session) => session.id === id);
    },
    // コンテンツIDに基づいて学習セッションをフィルタリングして取得
    sessionsByContentId: (state) => (contentId) => {
      return state.sessions.filter((session) => session.learning_content_id === contentId);
    },
    // セクションIDに基づいて学習セッションをフィルタリングして取得
    sessionsBySectionId: (state) => (sectionId) => {
      return state.sessions.filter((session) => session.section_id === sectionId);
    },
    // 全ての学習セッションの合計学習時間を計算して取得
    totalStudyMinutes: (state) => {
      return state.sessions.reduce((total, session) => total + session.study_minutes, 0);
    },
  },

  // 状態を変更するアクション
  actions: {
    // 学習セッションのリストをAPIから非同期でフェッチ
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

        // 既存のセッションリストに追加または更新
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

    // 新しい学習セッションを作成
    async createLearningSession(data) {
      this.loading = true;
      try {
        const response = await api.createLearningSession(data);
        const newSession = response.data.data || response.data;
        this.sessions.push(newSession);
        return newSession;
      } catch (error) {
        console.error('学習記録の作成中にエラーが発生しました:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 既存の学習セッションを更新
    async updateLearningSession(id, data) {
      this.loading = true;
      try {
        const response = await api.updateLearningSession(id, data);
        const updatedSession = response.data.data || response.data;
        const index = this.sessions.findIndex((s) => s.id === id);
        if (index !== -1) {
          this.sessions[index] = updatedSession;
        }
        return updatedSession;
      } catch (error) {
        console.error('学習記録の更新中にエラーが発生しました:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 学習セッションを削除
    async deleteLearningSession(id) {
      this.loading = true;
      try {
        await api.deleteLearningSession(id);
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
        const [summary, monthly, technology, daily] = await Promise.all([api.fetchStatisticsSummary(), api.fetchMonthlyStatistics(), api.fetchTechnologyStatistics(), api.fetchDailyStatistics()]);

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
