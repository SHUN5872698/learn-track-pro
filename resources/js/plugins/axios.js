import axios from 'axios';

// Axiosインスタンスの作成
const api = axios.create({
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json',
  },
});

// レスポンスインターセプター
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // 401/419: セッションタイムアウト → ログイン画面へ
    if (status === 401 || status === 419) {
      localStorage.removeItem('isLoggedIn');
      window.location.href = '/login';
      return new Promise(() => {});
    }

    // 403: アクセス権限エラー → NotFound.vue (type=forbidden)
    if (status === 403) {
      window.location.href = '/not-found?type=forbidden';
      return new Promise(() => {});
    }

    // 404: データ不存在 → NotFound.vue (type=notfound)
    if (status === 404) {
      window.location.href = '/not-found?type=notfound';
      return new Promise(() => {});
    }

    return Promise.reject(error);
  }
);

// 既存コードとの互換性のため window.axios も設定
window.axios = api;

export default api;
