import { defineStore } from 'pinia';
import * as api from '../api/learningContent';

// 学習コンテンツの状態管理を行うPiniaストア
export const useLearningContentStore = defineStore('learningContent', {
  // ストアの状態を定義
  state: () => ({
    contents: [], // 学習コンテンツのリスト
    pagination: {}, // ページネーション情報
    loading: false, // APIリクエスト中のローディング状態
    error: null, // エラーメッセージ
  }),

  // 状態から派生した値（キャッシュされる）
  getters: {
    // IDに基づいて特定の学習コンテンツを検索して取得
    contentById: (state) => (id) => {
      return state.contents.find((content) => content.id === id);
    },
  },

  // 状態を変更するアクション
  actions: {
    // 学習コンテンツのリストをAPIから非同期でフェッチ
    async fetchContents(page = 1) {
      this.loading = true;
      this.error = null;
      try {
        const params = {
          page,
          per_page: 20,
        };
        const response = await api.fetchLearningContents(params);
        this.contents = response.data.data;
        this.pagination = response.data.meta;
      } catch (error) {
        this.error = '学習内容の読み込みに失敗しました。';
        console.error('Error fetching learning contents:', error);
      } finally {
        this.loading = false;
      }
    },

    // 新しい学習コンテンツをAPIに作成
    async createContent(data) {
      this.loading = true;
      try {
        const response = await api.createLearningContent(data);
        // 作成後、最新のリストを再フェッチしてストアを更新
        await this.fetchContents();
        return response.data;
      } catch (error) {
        console.error('Error creating content:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 既存の学習コンテンツをAPIで更新
    async updateContent(id, data) {
      this.loading = true;
      try {
        const response = await api.updateLearningContent(id, data);
        // 更新後、ストア内の該当コンテンツを最新データで置き換え
        const index = this.contents.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.contents[index] = response.data.data;
        }
        return response.data;
      } catch (error) {
        console.error('Error updating content:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 学習コンテンツをAPIで削除
    async deleteContent(id) {
      this.loading = true;
      try {
        await api.deleteLearningContent(id);
        // 削除後、ストアから該当コンテンツを削除
        this.contents = this.contents.filter((c) => c.id !== id);
      } catch (error) {
        console.error('Error deleting content:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 学習コンテンツのステータス（完了/再開）を更新するための汎用ヘルパー
    async _updateStatus(apiCall, id, successMessage) {
      this.loading = true;
      try {
        const response = await apiCall(id);
        // 更新後、ストア内の該当コンテンツを最新データで置き換え
        const index = this.contents.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.contents[index] = response.data.data;
        }
        return { success: true, message: successMessage };
      } catch (error) {
        console.error(`Error updating status for content ${id}:`, error);
        return { success: false, error };
      } finally {
        this.loading = false;
      }
    },

    // 学習コンテンツを完了状態に設定
    completeContent(id) {
      return this._updateStatus(api.completeLearningContent, id, '学習を完了しました。');
    },

    // 学習コンテンツを再開状態に設定
    reopenContent(id) {
      return this._updateStatus(api.reopenLearningContent, id, '学習を再開しました。');
    },

    // フィルタ条件を設定し、コンテンツを再フェッチ
    setFilter(filters) {
      this.filters = { ...this.filters, ...filters };
      this.fetchContents();
    },

    // ソート条件を設定し、コンテンツを再フェッチ
    setSort(sort) {
      this.sort = { ...this.sort, ...sort };
      this.fetchContents();
    },

    // 学習コンテンツの統計情報（完了セクション数、総セクション数）を更新
    updateContentStats({ contentId, completed_sections, total_sections }) {
      const index = this.contents.findIndex((c) => c.id === contentId);
      if (index !== -1) {
        this.contents[index].completed_sections = completed_sections;
        this.contents[index].total_sections = total_sections;
      }
    },
  },
});