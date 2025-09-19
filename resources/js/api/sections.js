import axios from 'axios';

const BASE_URL = '/api';

// 指定した学習コンテンツのセクション一覧を取得
export const fetchSections = (learningContentId) => {
  return axios.get(`${BASE_URL}/learning-contents/${learningContentId}/sections`);
};

// 新しいセクションを作成
export const createSection = (data) => {
  return axios.post(`${BASE_URL}/sections`, data);
};

// 特定のセクションを更新
export const updateSection = (id, data) => {
  return axios.put(`${BASE_URL}/sections/${id}`, data);
};

// 特定のセクションを削除
export const deleteSection = (id) => {
  return axios.delete(`${BASE_URL}/sections/${id}`);
};

// 特定のセクションのステータスを更新
export const updateSectionStatus = (id, status) => {
  return axios.put(`${BASE_URL}/sections/${id}/status`, { status });
};

// セクションを一括更新
export const bulkUpdateSections = (learningContentId, data) => {
  return axios.put(`${BASE_URL}/learning-contents/${learningContentId}/sections/bulk`, data);
};
