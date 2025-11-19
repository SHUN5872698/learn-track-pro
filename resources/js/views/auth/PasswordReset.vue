<template>
  <!-- パスワードリセットページのメインコンポーネント -->
  <!-- アプリケーションロゴとタイトル -->
  <div>
    <h2 class="auth-header">LearnTrack Pro</h2>
    <p class="mt-2 text-sm text-center text-gray-600">パスワードをリセット</p>
  </div>

  <!-- Vue側のバリデーションエラー -->
  <div v-if="validationErrors.length" class="error-container">
    <h3 class="font-bold">入力エラー</h3>
    <ul class="mt-2 ml-2 list-disc list-inside">
      <li v-for="error in validationErrors" :key="error">{{ error }}</li>
    </ul>
  </div>

  <!-- API側のエラー -->
  <div v-if="apiError" class="error-container">
    <h3 class="font-bold">エラー</h3>
    <ul class="mt-2 ml-2 list-disc list-inside">
      <li>{{ apiError }}</li>
    </ul>
  </div>

  <!-- 成功メッセージ -->
  <div v-if="successMessage" class="p-4 mb-6 border-l-4 rounded-md text-emerald-800 bg-emerald-100 border-emerald-500">
    {{ successMessage }}
  </div>

  <!-- パスワードリセットフォーム -->
  <form class="mt-8 space-y-6" @submit.prevent="handlePasswordReset">
    <!-- メールアドレス入力フィールド -->
    <div>
      <label for="email-address" class="form-label">メールアドレス</label>
      <div class="mt-1">
        <input id="email-address" name="email" type="email" autocomplete="email" class="form-input-base" :class="[showEmailBorder ? 'form-input-error' : 'form-input-normal']" placeholder="your@email.com" v-model="formData.email" @input="emailModified = true" />
      </div>
    </div>

    <div>
      <BaseButton type="submit" :disabled="isSubmitting" full-width :left-icon="EnvelopeIcon">リセットリンクを送信</BaseButton>
    </div>
  </form>
  <div class="text-sm text-center">
    <router-link to="/login" class="font-medium text-violet-600 hover:text-violet-500">ログインに戻る</router-link>
  </div>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { EnvelopeIcon } from '@heroicons/vue/24/solid';

// ========================================
// 内部インポート
// ========================================
// Piniaストア
import { useAuthStore } from '@/stores/auth';
// コンポーネント
import BaseButton from '@/components/common/BaseButton.vue';
// バリデーションルール
import { validateEmail } from '@/validators/authValidator';

// ========================================
// 初期設定
// ========================================
// ルーター・ルート
const router = useRouter();
// コンポーザブル
const authStore = useAuthStore();

// ========================================
// 状態管理
// ========================================
// 入力状態
const formData = reactive({
  email: '',
});

// バリデーション
// 各入力フィールドのエラーメッセージを保持
const errors = reactive({
  email: '',
});

// API側のエラー
const apiError = ref('');

// 各入力フィールドが変更されたかどうかのフラグ
const emailModified = ref(false);

// UI状態
const successMessage = ref('');
const isSubmitting = ref(false);

// ========================================
// 算出プロパティ
// ========================================
// バリデーションエラー表示制御
const showEmailBorder = computed(() => {
  return errors.email !== '' && !emailModified.value;
});

// Vue側のバリデーションエラーメッセージを集約
const validationErrors = computed(() => {
  const messages = [];
  if (errors.email) messages.push(errors.email);
  return messages;
});

// ========================================
// メソッド
// ========================================
// API送信処理
// パスワードリセットメール送信を実行
const handlePasswordReset = async () => {
  // バリデーション実行前に状態をリセット
  errors.email = '';
  apiError.value = '';
  successMessage.value = '';
  emailModified.value = false;

  // Vue側のバリデーション実行
  const emailResult = validateEmail(formData.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.message;
    return;
  }

  isSubmitting.value = true;
  // パスワードリセットメール送信
  try {
    const message = await authStore.forgotPassword(formData.email);
    successMessage.value = message;

    // ログイン画面へ遷移
    setTimeout(() => {
      router.push('/login');
    }, 3000);
  } catch (error) {
    console.error('パスワードリセットエラー:', error);
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
    isSubmitting.value = false;
  }
};
</script>
