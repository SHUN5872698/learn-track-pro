// ========================================
// 外部インポート
// ========================================
import { defineStore } from 'pinia';
import router from '@/router';

// ========================================
// 内部インポート
// ========================================
// Piniaストア
import { useLearningContentStore } from '@/stores/learningContent';
import { useLearningSessionStore } from '@/stores/learningSession';
import { useSectionStore } from '@/stores/sections';
import { useReportStore } from '@/stores/reports';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null, // ログインユーザー情報
    isLoggedIn: false, // 認証状態
    loading: false, // APIリクエスト中のローディング状態
    errors: {}, // フロントエンド用バリデーションエラーメッセージ（複数文字列：個別フィールドのエラーのみ扱う）
    initialized: false, // 初期化完了フラグ
  }),

  getters: {
    authUser: (state) => state.user,
    authLoading: (state) => state.loading,
    authErrors: (state) => state.errors,
    hasAuthErrors: (state) => Object.keys(state.errors).length > 0,
    isLoading: (state) => state.loading,
    isInitialized: (state) => state.initialized,
  },

  actions: {
    setAuthLoading(status) {
      this.loading = status;
    },

    setAuthUser(user) {
      this.user = user;
      this.isLoggedIn = !!user;
    },

    setAuthErrors(errors) {
      this.errors = errors;
    },

    clearAuthErrors() {
      this.errors = {};
    },

    // 初期化完了を設定
    setInitialized(value) {
      this.initialized = value;
    },

    // 認証状態の初期化
    async initializeAuth() {
      if (this.initialized) return;

      if (localStorage.getItem('isLoggedIn') === 'true') {
        await this.fetchUser();
      } else {
        this.setInitialized(true);
      }
    },

    // ログイン処理: ユーザー認証と状態更新を行う
    async login(credentials) {
      this.setAuthLoading(true);
      this.clearAuthErrors();

      try {
        // SPA認証のためにCSRF Cookieを取得
        await axios.get('/sanctum/csrf-cookie');

        // Fortifyのログインエンドポイントへリクエスト
        const response = await axios.post('/fortify/login', credentials);

        // ログイン状態を永続化するためローカルストレージに保存
        localStorage.setItem('isLoggedIn', 'true');
        await this.fetchUser(); // ログイン成功後、ユーザー情報を取得
      } catch (error) {
        // 422エラー（バリデーション）と他のエラーを区別
        if (error?.response?.status === 422) {
          this.setAuthErrors(
            error.response.data.errors || {
              general: ['入力内容に誤りがあります'],
            }
          );
        } else {
          console.error('❌ Pinia: ログイン失敗', error);
          this.setAuthErrors({
            general: [error?.message || 'ログインに失敗しました'],
          });
        }
        throw error;
      } finally {
        this.setAuthLoading(false);
      }
    },

    // ユーザー情報の取得: 認証済みユーザーの詳細情報をフェッチする
    async fetchUser() {
      try {
        const response = await axios.get('/api/user');
        console.log('Pinia: fetchUser レスポンスデータ:', response.data);
        this.setAuthUser(response.data); // 取得したユーザー情報をストアに設定
        console.log('✅ Pinia: ユーザー情報取得成功', response.data);
      } catch (error) {
        this.setAuthUser(null); // エラー時はユーザー情報をクリア
        // 401エラーは未ログイン状態として扱い、それ以外は予期せぬエラーとしてログ
        if (error.response && error.response.status === 401) {
          console.log('ℹ️ Pinia: 未ログイン状態を確認しました。');
          localStorage.removeItem('isLoggedIn');
        } else {
          console.error('❌ Pinia: ユーザー情報取得で予期せぬエラーが発生しました', error);
        }
      } finally {
        this.setInitialized(true); // 初期化完了を設定
      }
    },

    // ログアウト処理: ユーザーセッションを終了させる
    async logout() {
      this.setAuthLoading(true);

      try {
        console.log('🔄 ログアウト開始');

        // ローカル状態をクリア
        // この時点で isLoggedIn が false になり、App.vue の watch が発火する
        this.setAuthUser(null);
        localStorage.removeItem('isLoggedIn');

        // すべての Pinia Store をリセット
        try {
          const learningContentStore = useLearningContentStore();
          const learningSessionStore = useLearningSessionStore();
          const sectionStore = useSectionStore();
          const reportStore = useReportStore();

          learningContentStore.$reset();
          learningSessionStore.$reset();
          sectionStore.$reset();
          reportStore.$reset();

          console.log('✅ すべての Pinia Store をリセットしました');
        } catch (error) {
          console.warn('⚠️ Pinia Store のリセットに失敗しましたが、処理を継続します', error);
        }

        // ログイン画面にリダイレクト
        await router.replace('/login');

        // サーバー側のログアウト
        axios.post('/fortify/logout').catch((error) => {
          console.warn('サーバー側のログアウトに失敗しましたが、クライアント側はクリア済みです:', error);
        });

        console.log('✅ ログアウト完了');
      } catch (error) {
        console.error('❌ ログアウト失敗', error);
        // エラー時も確実にローカル状態をクリア
        this.setAuthUser(null);
        localStorage.removeItem('isLoggedIn');
        // エラー時も確実にログイン画面にリダイレクト
        await router.replace('/login');
      } finally {
        this.setAuthLoading(false);
      }
    },

    // ユーザー登録処理: 新規ユーザーを登録し、成功すれば自動ログインする
    async register(payload) {
      this.setAuthLoading(true);
      this.clearAuthErrors();
      try {
        await axios.get('/sanctum/csrf-cookie'); // SPA認証のためにCSRF Cookieを取得
        await axios.post('/fortify/register', payload); // Fortifyの登録エンドポイントへリクエスト

        // 登録成功後、ユーザーの利便性のため自動的にログイン
        await this.login({
          email: payload.email,
          password: payload.password,
        });
      } catch (error) {
        // 登録失敗時のエラー情報を設定し、呼び出し元にエラーを再スロー
        const errorData = error?.response?.data?.errors ?? {
          general: [error?.response?.data?.message || error?.message || 'ユーザー登録に失敗しました'],
        };
        this.setAuthErrors(errorData);
        throw error;
      } finally {
        this.setAuthLoading(false);
      }
    },

    // パスワードリセットメール送信処理
    async forgotPassword(email) {
      this.setAuthLoading(true);
      this.clearAuthErrors();
      try {
        // CSRF Cookie取得（ログは開発時のみ）
        if (import.meta.env.DEV) {
          console.log('🔄 Pinia: CSRF Cookie取得開始');
        }
        await axios.get('/sanctum/csrf-cookie');
        if (import.meta.env.DEV) {
          console.log('✅ Pinia: CSRF Cookie取得完了');
        }

        // パスワードリセットメール送信
        if (import.meta.env.DEV) {
          console.log('🔄 Pinia: パスワードリセットメール送信開始');
        }
        const response = await axios.post('/fortify/forgot-password', { email });
        if (import.meta.env.DEV) {
          console.log('✅ Pinia: パスワードリセットメール送信成功', response);
        }
        return response.data.message; // 成功メッセージを返す
      } catch (error) {
        // エラー処理
        if (error?.response?.status === 422) {
          const errorData = error.response.data.errors || {
            general: ['入力内容に誤りがあります'],
          };
          this.setAuthErrors(errorData);
        } else {
          console.error('❌ Pinia: パスワードリセットメール送信失敗', error);
          const errorData = {
            general: [error?.message || 'パスワードリセットメールの送信に失敗しました'],
          };
          this.setAuthErrors(errorData);
        }
        throw error;
      } finally {
        this.setAuthLoading(false);
      }
    },

    // プロフィール更新
    async updateProfile(payload) {
      this.setAuthLoading(true);
      this.clearAuthErrors();
      try {
        const response = await axios.put('/api/user/profile', payload);
        this.setAuthUser(response.data.user); // 最新のユーザー情報でストアを更新
        return { success: true, message: response.data.message };
      } catch (error) {
        if (error?.response?.status === 422) {
          this.setAuthErrors(error.response.data.errors);
        } else {
          console.error('❌ Pinia: プロフィール更新失敗', error);
          this.setAuthErrors({ general: [error?.response?.data?.message || error?.message || 'プロフィール更新に失敗しました'] });
        }
        throw error;
      } finally {
        this.setAuthLoading(false);
      }
    },

    // パスワード変更
    async updatePassword(payload) {
      this.setAuthLoading(true);
      this.clearAuthErrors();

      try {
        // Fortifyの標準エンドポイントを使用
        const response = await axios.put('/fortify/user/password', {
          current_password: payload.current_password,
          password: payload.password,
          password_confirmation: payload.password_confirmation,
        });

        return { success: true, message: 'パスワードを更新しました' };
      } catch (error) {
        if (error?.response?.status === 422) {
          this.setAuthErrors(error.response.data.errors);
        }
        throw error;
      } finally {
        this.setAuthLoading(false);
      }
    },

    // パスワードリセット実行
    async resetPassword(payload) {
      this.setAuthLoading(true);
      this.clearAuthErrors();
      try {
        const response = await axios.post('/fortify/reset-password', payload);
        return { success: true, message: response.data.message };
      } catch (error) {
        if (error?.response?.status === 422) {
          this.setAuthErrors(error.response.data.errors);
        } else {
          console.error('❌ Pinia: パスワードリセット実行失敗', error);
          this.setAuthErrors({ general: [error?.response?.data?.message || error?.message || 'パスワードリセットに失敗しました'] });
        }
        throw error;
      } finally {
        this.setAuthLoading(false);
      }
    },
  },
});
