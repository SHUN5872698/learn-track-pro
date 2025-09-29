import { defineStore } from 'pinia';
import { reportApi } from '@/api/reports';

// レポート関連のデータと状態を管理するPiniaストア
export const useReportStore = defineStore('reports', {
  // ストアの状態を定義
  state: () => ({
    // 統計サマリーデータ
    statisticsSummary: {
      total_study_minutes: 0,
      completed_courses_count: 0,
      average_study_time_per_day: 0,
      consecutive_study_days: 0,
    },
    monthlyData: [], // 月別学習時間データ
    dailyData: [], // 日別学習時間データ
    technologyData: [], // 技術別学習時間データ
    loading: false, // APIリクエスト中のローディング状態
    error: null, // エラーメッセージ
  }),

  // 状態を変更するアクション
  actions: {
    // 統計サマリーデータをAPIから非同期でフェッチ
    async fetchStatisticsSummary() {
      this.loading = true;
      try {
        const response = await reportApi.getStatisticsSummary();
        this.statisticsSummary = response.data;
      } catch (error) {
        this.error = '統計サマリーの取得に失敗しました';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    // 月別統計データをAPIから非同期でフェッチ
    async fetchMonthlyStatistics(months = 6) {
      this.loading = true;
      try {
        const response = await reportApi.getMonthlyStatistics(months);
        this.monthlyData = response.data;
      } catch (error) {
        this.error = '月別統計の取得に失敗しました';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    // 日別統計データをAPIから非同期でフェッチ
    async fetchDailyStatistics(days = 30) {
      this.loading = true;
      try {
        const response = await reportApi.getDailyStatistics(days);
        this.dailyData = response.data;
      } catch (error) {
        this.error = '日別統計の取得に失敗しました';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    // 技術別統計データをAPIから非同期でフェッチ
    async fetchTechnologyStatistics() {
      this.loading = true;
      try {
        const response = await reportApi.getTechnologyStatistics();
        this.technologyData = response.data;
      } catch (error) {
        this.error = '技術別統計の取得に失敗しました';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
