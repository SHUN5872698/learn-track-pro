<template>
  <!-- パスワードリセット実行ページのメインコンポーネント -->
  <!-- アプリケーションロゴとタイトル -->
  <div>
    <h2 class="mt-6 text-3xl font-bold text-center text-transparent bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text">LearnTrack Pro</h2>
    <p class="mt-2 text-sm text-center text-gray-600">パスワードを再設定</p>
  </div>

  <!-- Vue側のバリデーションエラー -->
  <div v-if="validationErrors.length" class="p-4 mb-6 text-red-800 bg-red-100 border-l-4 border-red-500 rounded-md">
    <h3 class="font-bold">入力エラー</h3>
    <ul class="mt-2 ml-2 list-disc list-inside">
      <li v-for="error in validationErrors" :key="error">{{ error }}</li>
    </ul>
  </div>

  <!-- API側のエラー -->
  <div v-if="apiError" class="p-4 mb-6 text-red-800 bg-red-100 border-l-4 border-red-500 rounded-md">
    <h3 class="font-bold">エラー</h3>
    <ul class="mt-2 ml-2 list-disc list-inside">
      <li>{{ apiError }}</li>
    </ul>
  </div>

  <!-- 成功メッセージ -->
  <div v-if="successMessage" class="p-4 mb-6 border-l-4 rounded-md text-emerald-800 bg-emerald-100 border-emerald-500">
    {{ successMessage }}
  </div>

  <!-- パスワードリセット実行フォーム -->
  <form class="mt-8 space-y-6" @submit.prevent="handlePasswordResetConfirm">
    <!-- メールアドレス入力フィールド -->
    <div>
      <label for="email-address" class="block text-sm font-medium text-slate-700">メールアドレス<span class="pl-1 text-red-500">*</span></label>
      <div class="mt-1">
        <input
          id="email-address"
          name="email"
          type="email"
          autocomplete="email"
          class="block w-full px-3 py-2 placeholder-gray-400 border rounded-md shadow-sm appearance-none focus:outline-none sm:text-sm"
          :class="[showEmailBorder ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-violet-500 focus:ring-violet-500']"
          placeholder="your@email.com"
          v-model="formData.email"
          @input="emailModified = true"
        />
      </div>
    </div>

    <!-- 新しいパスワード入力フィールド -->
    <div>
      <label for="password" class="block text-sm font-medium text-slate-700">新しいパスワード<span class="pl-1 text-red-500">*</span></label>
      <div class="relative mt-1">
        <input
          :type="showPassword ? 'text' : 'password'"
          id="password"
          name="password"
          autocomplete="new-password"
          class="block w-full px-3 py-2 pr-10 placeholder-gray-400 border rounded-md shadow-sm appearance-none focus:outline-none sm:text-sm"
          :class="[showPasswordBorder ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-violet-500 focus:ring-violet-500']"
          placeholder="8文字以上"
          v-model="formData.password"
          @input="passwordModified = true"
        />
        <!-- パスワード表示/非表示切り替えボタン -->
        <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 flex items-center pr-3">
          <EyeIcon v-if="!showPassword" class="w-5 h-5 text-gray-400" />
          <EyeSlashIcon v-else class="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>

    <!-- パスワード確認入力フィールド -->
    <div>
      <label for="password-confirm" class="block text-sm font-medium text-slate-700">パスワード確認<span class="pl-1 text-red-500">*</span></label>
      <div class="relative mt-1">
        <input
          id="password-confirm"
          name="password-confirm"
          :type="showPasswordConfirm ? 'text' : 'password'"
          autocomplete="new-password"
          class="block w-full px-3 py-2 pr-10 placeholder-gray-400 border rounded-md shadow-sm appearance-none focus:outline-none sm:text-sm"
          :class="[showPasswordConfirmBorder ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-violet-500 focus:ring-violet-500']"
          placeholder="パスワードを再入力"
          v-model="formData.passwordConfirm"
          @input="passwordConfirmModified = true"
        />
        <!-- パスワード確認表示/非表示切り替えボタン -->
        <button type="button" @click="showPasswordConfirm = !showPasswordConfirm" class="absolute inset-y-0 right-0 flex items-center pr-3">
          <EyeIcon v-if="!showPasswordConfirm" class="w-5 h-5 text-gray-400" />
          <EyeSlashIcon v-else class="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>

    <div>
      <BaseButton type="submit" :disabled="isSubmitting || !!successMessage" full-width :left-icon="LockClosedIcon">パスワードをリセット</BaseButton>
    </div>
  </form>
  <div class="text-sm text-center text-gray-600">
    <router-link to="/login" class="font-medium text-violet-600 hover:text-violet-500">ログインに戻る</router-link>
  </div>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/vue/24/solid';

// ========================================
// 内部インポート
// ========================================
// Piniaストア
import { useAuthStore } from '@/stores/auth';
// コンポーネント
import BaseButton from '@/components/common/BaseButton.vue';
// バリデーションルール
import { validateEmail, validatePassword, validatePasswordConfirmation } from '@/validators/authValidator';

// ========================================
// 初期設定
// ========================================
// ルーター・ルート
const router = useRouter();
const route = useRoute();
// コンポーザブル
const authStore = useAuthStore();

// ========================================
// 状態管理
// ========================================
// 入力状態
const formData = reactive({
  email: '',
  password: '',
  passwordConfirm: '',
});

// バリデーション
// 各入力フィールドのエラーメッセージを保持
const errors = reactive({
  email: '',
  password: '',
  passwordConfirm: '',
});

// トークン
const token = ref('');

// API側のエラー
const apiError = ref('');

// 各入力フィールドが変更されたかどうかのフラグ
const emailModified = ref(false);
const passwordModified = ref(false);
const passwordConfirmModified = ref(false);

// UI状態
const showPassword = ref(false);
const showPasswordConfirm = ref(false);
const successMessage = ref('');
const isSubmitting = ref(false);

// ========================================
// 算出プロパティ
// ========================================
// バリデーションエラー表示制御
const showEmailBorder = computed(() => {
  return errors.email !== '' && !emailModified.value;
});
const showPasswordBorder = computed(() => {
  return errors.password !== '' && !passwordModified.value;
});
const showPasswordConfirmBorder = computed(() => {
  return errors.passwordConfirm !== '' && !passwordConfirmModified.value;
});

// Vue側のバリデーションエラーのみ表示
const validationErrors = computed(() => {
  const messages = [];
  if (errors.email) messages.push(errors.email);
  if (errors.password) messages.push(errors.password);
  if (errors.passwordConfirm) messages.push(errors.passwordConfirm);
  return messages;
});

// ========================================
// ライフサイクル
// ========================================
// コンポーネントマウント時に実行
onMounted(() => {
  // URLパラメータからトークンとメールアドレスを取得し、フォームに設定
  token.value = route.params.token || '';
  formData.email = route.query.email || '';

  if (!token.value) {
    router.push('/login');
  }
});

// ========================================
// メソッド
// ========================================
// API送信処理
// パスワードリセット処理を実行
const handlePasswordResetConfirm = async () => {
  // 状態をリセット
  errors.email = '';
  errors.password = '';
  errors.passwordConfirm = '';
  apiError.value = '';
  successMessage.value = '';
  emailModified.value = false;
  passwordModified.value = false;
  passwordConfirmModified.value = false;

  // 空白を除去
  formData.email = formData.email.trim();

  // フィールドバリデーション
  const emailResult = validateEmail(formData.email);
  const passwordResult = validatePassword(formData.password);
  const passwordConfirmResult = validatePasswordConfirmation(formData.passwordConfirm, formData.password);

  // バリデーション結果に基づいてエラーメッセージを設定
  if (!emailResult.isValid) errors.email = emailResult.message;
  if (!passwordResult.isValid) errors.password = passwordResult.message;
  if (!passwordConfirmResult.isValid) errors.passwordConfirm = passwordConfirmResult.message;

  // いずれかのフィールドにエラーがあれば処理を中断
  if (errors.email || errors.password || errors.passwordConfirm) {
    return;
  }

  isSubmitting.value = true;
  // パスワードリセットを実行
  try {
    const result = await authStore.resetPassword({
      token: token.value,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.passwordConfirm,
    });

    if (result.success) {
      // 成功時はログインページへリダイレクト
      successMessage.value = 'パスワードをリセットしました。ログインページに移動します。';
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  } catch (error) {
    console.error('パスワードリセット実行エラー:', error);
    if (error?.response?.status === 422 && authStore.hasAuthErrors) {
      // Laravel側のバリデーションエラー（422）の場合、各フィールドにエラーを設定
      Object.keys(authStore.authErrors).forEach((key) => {
        errors[key] = authStore.authErrors[key][0] || authStore.authErrors[key];
      });
    } else {
      // それ以外のレスポンスエラーは固定メッセージ
      apiError.value = 'エラーが発生しました。';
    }
  } finally {
    // フォーム送信状態をリセット
    isSubmitting.value = false;
  }
};
</script>
