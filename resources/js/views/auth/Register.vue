<template>
  <!-- 新規登録ページのメインコンポーネント -->
  <!-- アプリケーションロゴとタイトル -->
  <div>
    <h2 class="auth-header">LearnTrack Pro</h2>
    <p class="mt-2 text-sm text-center text-gray-600">新しいアカウントを作成</p>
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

  <!-- 新規登録フォーム -->
  <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
    <!-- 名前入力フィールド -->
    <div>
      <label for="name" class="form-label">名前<span class="pl-1 text-red-500">*</span></label>
      <div class="mt-1">
        <input id="name" name="name" type="text" autocomplete="name" placeholder="例: 山田 太郎" class="form-input-base" :class="[showNameBorder ? 'form-input-error' : 'form-input-normal']" v-model="formData.name" @input="nameModified = true" />
      </div>
    </div>

    <!-- メールアドレス入力フィールド -->
    <div>
      <label for="email-address" class="form-label">メールアドレス<span class="pl-1 text-red-500">*</span></label>
      <div class="mt-1">
        <input id="email-address" name="email" type="email" autocomplete="email" class="form-input-base" :class="[showEmailBorder ? 'form-input-error' : 'form-input-normal']" placeholder="your@email.com" v-model="formData.email" @input="emailModified = true" />
      </div>
    </div>
    <!-- パスワード入力フィールド -->
    <div>
      <label for="password" class="form-label">パスワード<span class="pl-1 text-red-500">*</span></label>
      <div class="relative mt-1">
        <input :type="showPassword ? 'text' : 'password'" id="password" name="password" autocomplete="new-password" class="form-input-base" :class="[showPasswordBorder ? 'form-input-error' : 'form-input-normal']" placeholder="8文字以上" v-model="formData.password" @input="passwordModified = true" />
        <!-- パスワード表示/非表示切り替えボタン -->
        <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 flex items-center pr-3">
          <EyeIcon v-if="!showPassword" class="w-5 h-5 text-gray-400" />
          <EyeSlashIcon v-else class="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
    <!-- パスワード確認入力フィールド -->
    <div>
      <label for="password-confirm" class="form-label">パスワード確認<span class="pl-1 text-red-500">*</span></label>
      <div class="relative mt-1">
        <input
          id="password-confirm"
          name="password-confirm"
          :type="showPasswordConfirm ? 'text' : 'password'"
          autocomplete="new-password"
          class="form-input-base"
          :class="[showPasswordConfirmBorder ? 'form-input-error' : 'form-input-normal']"
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
      <BaseButton type="submit" :disabled="isSubmitting" full-width :left-icon="UserPlusIcon">登録する</BaseButton>
    </div>
  </form>
  <div class="text-sm text-center">
    <p class="text-gray-600">すでにアカウントをお持ちですか？</p>
    <router-link to="/login" class="font-medium text-violet-600 hover:text-violet-500">ログインはこちら</router-link>
  </div>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { EyeIcon, EyeSlashIcon, UserPlusIcon } from '@heroicons/vue/24/solid';

// ========================================
// 内部インポート
// ========================================
// Piniaストア
import { useAuthStore } from '@/stores/auth';
// コンポーネント
import BaseButton from '@/components/common/BaseButton.vue';
// バリデーションルール
import { validateEmail, validateName, validatePassword, validatePasswordConfirmation } from '@/validators/authValidator';

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
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
});

// バリデーション
// 各入力フィールドのエラーメッセージを保持
const errors = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
});

// API側のエラー
const apiError = ref('');

// 各入力フィールドが変更されたかどうかのフラグ
const nameModified = ref(false);
const emailModified = ref(false);
const passwordModified = ref(false);
const passwordConfirmModified = ref(false);

// UI状態
const showPassword = ref(false);
const showPasswordConfirm = ref(false);
const isSubmitting = ref(false);

// ========================================
// 算出プロパティ
// ========================================
// バリデーションエラー表示制御
const showNameBorder = computed(() => {
  return errors.name !== '' && !nameModified.value;
});
const showEmailBorder = computed(() => {
  return errors.email !== '' && !emailModified.value;
});
const showPasswordBorder = computed(() => {
  return errors.password !== '' && !passwordModified.value;
});
const showPasswordConfirmBorder = computed(() => {
  return errors.passwordConfirm !== '' && !passwordConfirmModified.value;
});

// Vue側のバリデーションエラーメッセージを集約
const validationErrors = computed(() => {
  const messages = [];
  if (errors.name) messages.push(errors.name);
  if (errors.email) messages.push(errors.email);
  if (errors.password) messages.push(errors.password);
  if (errors.passwordConfirm) messages.push(errors.passwordConfirm);
  return messages;
});

// ========================================
// メソッド
// ========================================
// API送信処理
// ユーザー登録実行
const handleRegister = async () => {
  // 状態をリセット
  errors.name = '';
  errors.email = '';
  errors.password = '';
  errors.passwordConfirm = '';
  apiError.value = '';
  nameModified.value = false;
  emailModified.value = false;
  passwordModified.value = false;
  passwordConfirmModified.value = false;

  // 空白を除去
  formData.name = formData.name.trim();
  formData.email = formData.email.trim();

  // フィールドバリデーション
  const nameResult = validateName(formData.name);
  const emailResult = validateEmail(formData.email);
  const passwordResult = validatePassword(formData.password);
  const passwordConfirmResult = validatePasswordConfirmation(formData.passwordConfirm, formData.password);

  // バリデーション結果に基づいてエラーメッセージを設定
  if (!nameResult.isValid) errors.name = nameResult.message;
  if (!emailResult.isValid) errors.email = emailResult.message;
  if (!passwordResult.isValid) errors.password = passwordResult.message;
  if (!passwordConfirmResult.isValid) errors.passwordConfirm = passwordConfirmResult.message;

  // いずれかのフィールドにエラーがあれば処理を中断
  if (errors.name || errors.email || errors.password || errors.passwordConfirm) {
    return;
  }

  // ユーザー登録
  isSubmitting.value = true;
  try {
    await authStore.register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.passwordConfirm,
    });
    // 成功時はダッシュボードへ遷移
    router.push('/dashboard');
  } catch (error) {
    console.error('ユーザー登録エラー:', error);
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
