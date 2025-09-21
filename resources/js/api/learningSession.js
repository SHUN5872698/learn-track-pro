import axios from 'axios';

const BASE_URL = '/api';

// Basic CRUD
// 全ての学習セッションを取得するAPIリクエスト
export const fetchLearningSessions = (params) => {
  return axios.get(`${BASE_URL}/learning-sessions`, { params });
};

// 特定の学習セッションを取得するAPIリクエスト
export const fetchLearningSession = (id) => {
  return axios.get(`${BASE_URL}/learning-sessions/${id}`);
};

// 新しい学習セッションを作成するAPIリクエスト
export const createLearningSession = (data) => {
  return axios.post(`${BASE_URL}/learning-sessions`, data);
};

// 特定の学習セッションを更新するAPIリクエスト
export const updateLearningSession = (id, data) => {
  return axios.put(`${BASE_URL}/learning-sessions/${id}`, data);
};

// 特定の学習セッションを削除するAPIリクエスト
export const deleteLearningSession = (id) => {
  return axios.delete(`${BASE_URL}/learning-sessions/${id}`);
};

// Nested routes
// 特定の学習コンテンツに紐づく学習セッションを取得するAPIリクエスト
export const fetchSessionsByContent = (contentId) => {
  return axios.get(`${BASE_URL}/learning-contents/${contentId}/sessions`);
};

// 特定のセクションに紐づく学習セッションを取得するAPIリクエスト
export const fetchSessionsBySection = (sectionId) => {
  return axios.get(`${BASE_URL}/sections/${sectionId}/sessions`);
};

// Statistics
// 学習統計サマリーを取得するAPIリクエスト
export const fetchStatisticsSummary = () => {
  return axios.get(`${BASE_URL}/learning-sessions/statistics/summary`);
};

// 月ごとの学習統計を取得するAPIリクエスト
export const fetchMonthlyStatistics = (months = 6) => {
  return axios.get(`${BASE_URL}/learning-sessions/statistics/monthly`, { params: { months } });
};

// 技術ごとの学習統計を取得するAPIリクエスト
export const fetchTechnologyStatistics = () => {
  return axios.get(`${BASE_URL}/learning-sessions/statistics/by-technology`);
};

// 日ごとの学習統計を取得するAPIリクエスト
export const fetchDailyStatistics = (days = 30) => {
  return axios.get(`${BASE_URL}/learning-sessions/statistics/daily`, { params: { days } });
};