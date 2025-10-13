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
      // ★ router.push() ではなく window.location.href を使用 ★
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// 既存コードとの互換性のため window.axios も設定
window.axios = api;

export default api;
