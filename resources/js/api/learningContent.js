import api from '@/plugins/axios';

const BASE_URL = '/api/learning-contents';

// 学習内容の一覧を取得するAPIリクエスト
export const fetchLearningContents = (params) => {
  return api.get(BASE_URL, { params });
};

// 特定の学習内容の詳細を取得するAPIリクエスト
export const fetchLearningContent = (id) => {
  return api.get(`${BASE_URL}/${id}`);
};

// 新しい学習内容を作成するAPIリクエスト
export const createLearningContent = (data) => {
  return api.post(BASE_URL, data);
};

// 特定の学習内容を更新するAPIリクエスト
export const updateLearningContent = (id, data) => {
  return api.put(`${BASE_URL}/${id}`, data);
};

// 特定の学習内容を削除するAPIリクエスト
export const deleteLearningContent = (id) => {
  return api.delete(`${BASE_URL}/${id}`);
};

// 特定の学習内容を完了状態にするAPIリクエスト
export const completeLearningContent = (id) => {
  return api.put(`${BASE_URL}/${id}/complete`);
};

// 特定の学習内容を再開状態にするAPIリクエスト
export const reopenLearningContent = (id) => {
  return api.put(`${BASE_URL}/${id}/reopen`);
};
