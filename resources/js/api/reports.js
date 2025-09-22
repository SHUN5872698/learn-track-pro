import axios from 'axios';

export const reportApi = {
  // 統計サマリー取得
  getStatisticsSummary() {
    return axios.get('/api/learning-sessions/statistics/summary');
  },

  // 月別統計取得
  getMonthlyStatistics(months = 6) {
    return axios.get('/api/learning-sessions/statistics/monthly', {
      params: { months },
    });
  },

  // 日別統計取得
  getDailyStatistics(days = 30) {
    return axios.get('/api/learning-sessions/statistics/daily', {
      params: { days },
    });
  },

  // 技術別統計取得
  getTechnologyStatistics() {
    return axios.get('/api/learning-sessions/statistics/by-technology');
  },
};
