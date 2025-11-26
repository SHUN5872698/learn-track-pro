import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useMasterDataStore = defineStore('masterData', {
  state: () => ({
    categories: [], // カテゴリー一覧
    technologies: [], // 技術一覧
    loading: false, // APIリクエスト中のローディング状態
    error: null, // API/コンソール用エラーメッセージ（単一文字列：ウィザード全体のエラーのみ扱う）
  }),

  getters: {
    // カテゴリーIDに基づいて技術をフィルタリングして取得
    getTechnologiesByCategory: (state) => (categoryId) => {
      return state.technologies.filter((tech) => tech.category_id === categoryId);
    },
    // IDに基づいて技術を取得
    getTechnologyById: (state) => (id) => {
      return state.technologies.find((tech) => tech.id === id);
    },
    // IDに基づいてカテゴリーを取得
    getCategoryById: (state) => (id) => {
      return state.categories.find((cat) => cat.id === id);
    },
  },

  actions: {
    // カテゴリーデータをAPIからフェッチ
    async fetchCategories() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/api/categories');
        this.categories = response.data;
      } catch (error) {
        this.error = 'カテゴリーの読み込みに失敗しました。';
        console.error('❌ カテゴリーのフェッチ中にエラーが発生しました:', error);
      } finally {
        this.loading = false;
      }
    },

    // 技術データをAPIからフェッチ
    async fetchTechnologies() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/api/technologies');
        this.technologies = response.data;
      } catch (error) {
        this.error = '技術一覧の読み込みに失敗しました。';
        console.error('❌ 技術のフェッチ中にエラーが発生しました:', error);
      } finally {
        this.loading = false;
      }
    },

    // マスターデータを初期化（カテゴリーと技術を並列でフェッチ）
    async initializeMasterData() {
      await Promise.all([this.fetchCategories(), this.fetchTechnologies()]);
    },
  },
});
