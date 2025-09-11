import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUser } from './useUser';

// アプリケーション全体の認証状態を管理するため、モジュールスコープのrefとして定義
const isAuthenticated = ref(localStorage.getItem('authToken') !== null);

export function useAuth() {
  // コンポーザブルが使用されるたびにルーターインスタンスを取得するため、ここでuseRouterを呼び出す
  const router = useRouter();
  const { user } = useUser();

  const login = (credentials) => {
    // 実際の認証処理 (DB接続時などに使用)
    // const testUser = { email: 'test@example.com', password: 'password123' };
    // if (credentials.email === testUser.email && credentials.password === testUser.password) {
    //   // 認証成功時の処理
    // } else {
    //   return { success: false, message: 'メールアドレスまたはパスワードが正しくありません。' };
    // }

    // DB未接続時の仮の認証処理: バリデーションを通過すれば成功とみなす
    // ここではcredentialsの内容はチェックせず、常に成功を返す
    // ただし、useAuthを呼び出す側でバリデーションが完了していることを前提とする
    if (true) {
      // 常にtrueを返すことで、バリデーション通過後のログインを許可
      localStorage.setItem('authToken', 'fake-jwt-token');
      isAuthenticated.value = true;
      if (router) {
        router.push('/dashboard');
      }
      return { success: true };
    } else {
      return { success: false, message: 'メールアドレスまたはパスワードが正しくありません。' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    isAuthenticated.value = false;
    if (router) {
      router.push('/login');
    }
  };

  const register = (userInfo) => {
    console.log('User registered:', userInfo);
    localStorage.setItem('authToken', 'fake-jwt-token-for-new-user');
    isAuthenticated.value = true;
    if (router) {
      router.push('/dashboard');
    }
    return { success: true };
  };

  const checkAuth = () => {
    isAuthenticated.value = localStorage.getItem('authToken') !== null;
  };

  // ユーザーのイニシャルを生成する関数
  const getUserInitials = (name) => {
    if (!name) {
      return '';
    }

    const trimmedName = name.trim();
    // 日本語の文字（漢字、ひらがな、カタカナ）が含まれているかチェック
    const hasJapanese = /[　-〿぀-ゟ゠-ヿ一-鿿]/.test(trimmedName);

    if (hasJapanese) {
      // 日本語名の場合、最初の2文字を返す
      return trimmedName.substring(0, 2);
    } else {
      // 英語名の場合
      const parts = trimmedName.split(' ').filter((part) => part.length > 0);
      if (parts.length > 1) {
        // 複数の単語がある場合、各単語の最初の文字を結合
        return parts.map((part) => part.charAt(0).toUpperCase()).join('');
      } else if (trimmedName.length > 1) {
        // 単語が1つで2文字以上ある場合、最初の2文字を大文字で返す
        return trimmedName.substring(0, 2).toUpperCase();
      } else {
        // 1文字しかない場合、その文字を大文字で返す
        return trimmedName.toUpperCase();
      }
    }
  };

  // ユーザープロフィールを更新する関数
  const updateUserProfile = (updatedData) => {
    try {
      // 実際のAPIコールをシミュレート
      console.log('Updating user profile with:', updatedData);
      Object.assign(user, updatedData);
      return { success: true };
    } catch (error) {
      console.error('Failed to update user profile:', error);
      return { success: false, message: 'プロフィールの更新に失敗しました。' };
    }
  };

  // アプリケーション起動時に認証状態をチェック
  checkAuth();

  return {
    isAuthenticated: computed(() => isAuthenticated.value),
    user: computed(() => user),
    login,
    logout,
    register,
    checkAuth,
    getUserInitials,
    updateUserProfile,
  };
}
