<template>
  <!-- 新規登録ページのメインコンテナ -->
  <div class="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
    <!-- 新規登録フォームのカードコンテナ -->
    <div class="z-10 w-full max-w-md p-10 space-y-8 bg-white shadow-lg rounded-xl">
      <!-- アプリケーションロゴとタイトル -->
      <div>
        <h2 class="mt-6 text-3xl font-bold text-center text-transparent bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text">LearnTrack Pro</h2>
        <p class="mt-2 text-sm text-center text-gray-600">新しいアカウントを作成</p>
      </div>
      <!-- バリデーションエラーメッセージの表示エリア -->
      <div v-if="validationErrors.length" class="p-4 mb-6 text-red-800 bg-red-100 border-l-4 border-red-500 rounded-md">
        <h3 class="font-bold">入力エラー</h3>
        <ul class="mt-2 ml-2 list-disc list-inside">
          <li v-for="error in validationErrors" :key="error">{{ error }}</li>
        </ul>
      </div>

      <!-- 認証エラー用（登録失敗時） -->
      <div v-if="authError" class="p-4 mb-6 text-red-800 bg-red-100 border-l-4 border-red-500 rounded-md">
        {{ authError }}
      </div>

      <!-- 新規登録フォーム -->
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <!-- 名前入力フィールド -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">名前<span class="pl-1 text-red-500">*</span></label>
          <div class="mt-1">
            <input
              id="name"
              name="name"
              type="text"
              autocomplete="name"
              class="block w-full px-3 py-2 placeholder-gray-400 border rounded-md shadow-sm appearance-none focus:outline-none sm:text-sm"
              placeholder="例: 山田太郎"
              v-model="name"
              @input="nameModified = true"
              :class="[showNameBorder ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-violet-500 focus:ring-violet-500']"
            />
          </div>
        </div>
        <!-- メールアドレス入力フィールド -->
        <div>
          <label for="email-address" class="block text-sm font-medium text-gray-700">メールアドレス<span class="pl-1 text-red-500">*</span></label>
          <div class="mt-1">
            <input
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              class="block w-full px-3 py-2 placeholder-gray-400 border rounded-md shadow-sm appearance-none focus:outline-none sm:text-sm"
              placeholder="your@email.com"
              v-model="email"
              @input="emailModified = true"
              :class="[showEmailBorder ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-violet-500 focus:ring-violet-500']"
            />
          </div>
        </div>
        <!-- パスワード入力フィールド -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">パスワード<span class="pl-1 text-red-500">*</span></label>
          <div class="relative mt-1">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              name="password"
              autocomplete="new-password"
              class="block w-full px-3 py-2 pr-10 placeholder-gray-400 border rounded-md shadow-sm appearance-none focus:outline-none sm:text-sm"
              placeholder="8文字以上"
              v-model="password"
              @input="passwordModified = true"
              :class="[showPasswordBorder ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-violet-500 focus:ring-violet-500']"
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
          <label for="password-confirm" class="block text-sm font-medium text-gray-700">パスワード確認<span class="pl-1 text-red-500">*</span></label>
          <div class="relative mt-1">
            <input
              :type="showPasswordConfirm ? 'text' : 'password'"
              id="password-confirm"
              name="password-confirm"
              autocomplete="new-password"
              class="block w-full px-3 py-2 pr-10 placeholder-gray-400 border rounded-md shadow-sm appearance-none focus:outline-none sm:text-sm"
              placeholder="パスワードを再入力"
              v-model="passwordConfirm"
              @input="passwordConfirmModified = true"
              :class="[showPasswordConfirmBorder ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-violet-500 focus:ring-violet-500']"
            />
            <!-- パスワード確認表示/非表示切り替えボタン -->
            <button type="button" @click="showPasswordConfirm = !showPasswordConfirm" class="absolute inset-y-0 right-0 flex items-center pr-3">
              <EyeIcon v-if="!showPasswordConfirm" class="w-5 h-5 text-gray-400" />
              <EyeSlashIcon v-else class="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <!-- 登録ボタン -->
        <div>
          <BaseButton type="submit" :disabled="isSubmitting" full-width :left-icon="UserPlusIcon"> 登録する </BaseButton>
        </div>
      </form>
      <!-- ログインへのリンク -->
      <div class="text-sm text-center text-gray-600">
        すでにアカウントをお持ちですか？
        <router-link to="/login" class="font-medium text-violet-600 hover:text-violet-500"> ログインはこちら </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { ref, reactive, computed } from 'vue';
import { EyeIcon, EyeSlashIcon, UserPlusIcon } from '@heroicons/vue/24/solid';

// ========================================
// 内部インポート
// ========================================
import { validateName, validateEmail, validatePassword, validatePasswordConfirmation } from '../../validators/profileValidator';
import { useAuthStore } from '@/stores/auth';
import BaseButton from '../../components/common/BaseButton.vue';

// ========================================
// コンポーザブル
// ========================================
const authStore = useAuthStore();

// ========================================
// フォーム状態管理
// ========================================
const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const showPassword = ref(false);
const showPasswordConfirm = ref(false);

// ========================================
// バリデーション状態管理
// ========================================
const errors = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
});

const nameModified = ref(false);
const emailModified = ref(false);
const passwordModified = ref(false);
const passwordConfirmModified = ref(false);

// ========================================
// UI状態管理
// ========================================
const authError = ref('');
const isSubmitting = ref(false);

// ========================================
// 算出プロパティ
// ========================================
// エラー時の赤枠表示制御
const showNameBorder = computed(() => {
  return errors.name && !nameModified.value;
});

const showEmailBorder = computed(() => {
  return errors.email && !emailModified.value;
});

const showPasswordBorder = computed(() => {
  return errors.password && !passwordModified.value;
});

const showPasswordConfirmBorder = computed(() => {
  return errors.passwordConfirmation && !passwordConfirmModified.value;
});

// エラーメッセージの集約
const validationErrors = computed(() => {
  const messages = [];
  if (errors.name) messages.push(errors.name);
  if (errors.email) messages.push(errors.email);
  if (errors.password) messages.push(errors.password);
  if (errors.passwordConfirmation) messages.push(errors.passwordConfirmation);
  return messages;
});

// ========================================
// イベントハンドラ
// ========================================
const handleRegister = async () => {
  // 状態をリセット
  errors.name = '';
  errors.email = '';
  errors.password = '';
  errors.passwordConfirmation = '';
  authError.value = '';
  nameModified.value = false;
  emailModified.value = false;
  passwordModified.value = false;
  passwordConfirmModified.value = false;

  name.value = name.value.trim();
  email.value = email.value.trim();

  // フィールドバリデーション
  const nameResult = validateName(name.value);
  const emailResult = validateEmail(email.value);
  const passwordResult = validatePassword(password.value);
  const passwordConfirmResult = validatePasswordConfirmation(passwordConfirm.value, password.value);

  if (!nameResult.isValid) errors.name = nameResult.message;
  if (!emailResult.isValid) errors.email = emailResult.message;
  if (!passwordResult.isValid) errors.password = passwordResult.message;
  if (!passwordConfirmResult.isValid) errors.passwordConfirmation = passwordConfirmResult.message;

  // エラーがあれば処理中断
  if (errors.name || errors.email || errors.password || errors.passwordConfirmation) {
    return;
  }

  // 登録実行
  isSubmitting.value = true;
  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirm.value,
    });
    router.push('/dashboard'); // 成功時はダッシュボードへ遷移
  } catch (error) {
    if (authStore.hasAuthErrors) {
      authError.value = Object.values(authStore.authErrors).flat().join(', ');
    } else {
      authError.value = 'ユーザー登録に失敗しました';
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>
