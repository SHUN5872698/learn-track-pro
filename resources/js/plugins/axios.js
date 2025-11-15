import axios from 'axios';
import { useErrorModalStore } from '@/stores/errorModal';

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
      // SPAの状態を完全リセットするため強制リロード
      window.location.href = '/login';
      // リダイレクト中のエラー処理実行を防止
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

    // 500系エラー: サーバーエラー → GlobalErrorModal表示
    if (status >= 500) {
      const errorModalStore = useErrorModalStore();
      errorModalStore.showError();
      // コンポーネント側のfinallyブロックでローディング状態をクリアするため伝播
      return Promise.reject(error);
    }

    // それ以外（422など）: エラーを伝播（各コンポーネントで処理）
    // 422はフォームごとに異なるエラー表示が必要なため共通処理しない
    return Promise.reject(error);
  }
);

// 既存コードとの互換性のため window.axios も設定
window.axios = api;

export default api;
