<template>
  <!-- ログインページのメインコンテナ -->
  <div class="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
    <!-- ログインフォームのカードコンテナ -->
    <div class="z-10 w-full max-w-md p-10 space-y-8 bg-white shadow-lg rounded-xl">
      <!-- アプリケーションロゴとタイトル -->
      <div>
        <h2 class="mt-6 text-3xl font-bold text-center text-transparent bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text">LearnTrack Pro</h2>
        <p class="mt-2 text-sm text-center text-gray-600">アカウントにログイン</p>
      </div>
      <!-- ログインフォーム -->
      <!-- バリデーションエラーメッセージの表示エリア -->
      <div v-if="validationErrors.length" class="p-4 mb-6 text-red-800 bg-red-100 border-l-4 border-red-500 rounded-md">
        <h3 class="font-bold">入力エラー</h3>
        <ul class="mt-2 ml-2 list-disc list-inside">
          <li v-for="error in validationErrors" :key="error">{{ error }}</li>
        </ul>
      </div>

      <!-- 認証エラー用（ログイン失敗時） -->
      <div v-if="authError" class="p-4 mb-6 text-red-800 bg-red-100 border-l-4 border-red-500 rounded-md">
        {{ authError }}
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <!-- メールアドレス入力フィールド -->
        <div>
          <label for="email-address" class="block text-sm font-medium text-gray-700">メールアドレス</label>
          <div class="mt-1">
            <input
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              :class="['block w-full px-3 py-2 placeholder-gray-400 border rounded-md shadow-sm appearance-none focus:outline-none sm:text-sm', showEmailBorder ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-violet-500 focus:ring-violet-500']"
              placeholder="your@email.com"
              v-model="email"
              @input="emailModified = true"
            />
          </div>
        </div>
        <!-- パスワード入力フィールド -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">パスワード</label>
          <div class="relative mt-1">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              name="password"
              autocomplete="current-password"
              :class="['block w-full px-3 py-2 pr-10 placeholder-gray-400 border rounded-md shadow-sm appearance-none focus:outline-none sm:text-sm', showPasswordBorder ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-violet-500 focus:ring-violet-500']"
              placeholder="8文字以上"
              v-model="password"
              @input="passwordModified = true"
            />
            <!-- パスワード表示/非表示切り替えボタン -->
            <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 flex items-center pr-3">
              <EyeIcon v-if="!showPassword" class="w-5 h-5 text-gray-400" />
              <EyeSlashIcon v-else class="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <!-- パスワードリセットリンク -->
        <div class="flex items-center justify-between">
          <div class="text-sm">
            <router-link to="/password-reset" class="font-medium text-violet-600 hover:text-violet-500"> パスワードを忘れた方 </router-link>
          </div>
        </div>

        <!-- ログインボタン -->
        <div>
          <BaseButton type="submit" :disabled="isSubmitting" full-width :left-icon="LockClosedIcon"> ログイン </BaseButton>
        </div>
      </form>
      <!-- 新規登録へのリンク -->
      <div class="text-sm text-center text-gray-600">
        アカウントをお持ちでないですか？
        <router-link to="/register" class="font-medium text-violet-600 hover:text-violet-500"> 新規登録はこちら </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/vue/24/solid';

// ========================================
// 内部インポート
// ========================================
import { validateEmail, validatePassword } from '../../validators/profileValidator';
// コンポーネント
import BaseButton from '../../components/common/BaseButton.vue';

// Piniaストア
import { useAuthStore } from '@/stores/auth';

// ========================================
// コンポーザブル
// ========================================
const router = useRouter();
const authStore = useAuthStore(); // 変更: Piniaストアを使用

// ========================================
// フォーム状態管理
// ========================================
const email = ref('');
const password = ref('');
const showPassword = ref(false);

// ========================================
// バリデーション状態管理
// ========================================
const errors = reactive({
  email: '',
  password: '',
});

const emailModified = ref(false);
const passwordModified = ref(false);

// ========================================
// UI状態管理
// ========================================
const authError = ref('');
const isSubmitting = ref(false);

// ========================================
// 算出プロパティ
// ========================================
// エラー時の赤枠表示制御
const showEmailBorder = computed(() => {
  return errors.email && !emailModified.value;
});

const showPasswordBorder = computed(() => {
  return errors.password && !passwordModified.value;
});

// エラーメッセージの集約
const validationErrors = computed(() => {
  const messages = [];
  if (errors.email) messages.push(errors.email);
  if (errors.password) messages.push(errors.password);
  return messages;
});

// ========================================
// イベントハンドラ
// ========================================
const handleLogin = async () => {
  // 状態をリセット
  errors.email = '';
  errors.password = '';
  authError.value = '';
  emailModified.value = false;
  passwordModified.value = false;

  // フィールドバリデーション
  const emailResult = validateEmail(email.value);
  const passwordResult = validatePassword(password.value);

  if (!emailResult.isValid) {
    errors.email = emailResult.message;
  }
  if (!passwordResult.isValid) {
    errors.password = passwordResult.message;
  }

  // エラーがあれば処理中断
  if (errors.email || errors.password) {
    return;
  }

  // ログイン実行
  isSubmitting.value = true;

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });

    // 成功時はダッシュボードへ遷移
    router.push('/dashboard');
  } catch (error) {
    if (authStore.hasAuthErrors) {
      authError.value = Object.values(authStore.authErrors).flat().join(', ');
    } else {
      authError.value = 'ログインに失敗しました';
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>
