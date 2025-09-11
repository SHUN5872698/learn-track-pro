<template>
  <!-- パスワードリセットページのメインコンテナ -->
  <div class="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
    <!-- パスワードリセットフォームのカードコンテナ -->
    <div class="z-10 w-full max-w-md p-10 space-y-8 bg-white shadow-lg rounded-xl">
      <!-- アプリケーションロゴとタイトル -->
      <div>
        <h2 class="mt-6 text-3xl font-bold text-center text-transparent bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text">LearnTrack Pro</h2>
        <p class="mt-2 text-sm text-center text-gray-600">パスワードをリセット</p>
      </div>
      <!-- バリデーションエラーメッセージの表示エリア -->
      <div v-if="validationErrors.length" class="p-4 mb-6 text-red-800 bg-red-100 border-l-4 border-red-500 rounded-md">
        <h3 class="font-bold">入力エラー</h3>
        <ul class="mt-2 ml-2 list-disc list-inside">
          <li v-for="error in validationErrors" :key="error">{{ error }}</li>
        </ul>
      </div>
      <div v-if="successMessage" class="p-4 mb-6 border-l-4 rounded-md text-emerald-800 bg-emerald-100 border-emerald-500">
        {{ successMessage }}
      </div>

      <!-- 認証エラー用（リセット失敗時） -->
      <div v-if="authError" class="p-4 mb-6 text-red-800 bg-red-100 border-l-4 border-red-500 rounded-md">
        {{ authError }}
      </div>

      <!-- パスワードリセットフォーム -->
      <form class="mt-8 space-y-6" @submit.prevent="handlePasswordReset">
        <!-- メールアドレス入力フィールド -->
        <div>
          <label for="email-address" class="block text-sm font-medium text-gray-700">メールアドレス</label>
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

        <!-- リセットリンク送信ボタン -->
        <div>
          <BaseButton type="submit" :disabled="isSubmitting" full-width :left-icon="EnvelopeIcon"> リセットリンクを送信 </BaseButton>
        </div>
      </form>
      <!-- ログインに戻るリンク -->
      <div class="text-sm text-center text-gray-600">
        <router-link to="/login" class="font-medium text-violet-600 hover:text-violet-500"> ログインに戻る </router-link>
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
import { EnvelopeIcon } from '@heroicons/vue/24/solid';

// ========================================
// 内部インポート
// ========================================
import { validateEmail } from '../../validators/profileValidator';
import BaseButton from '../../components/common/BaseButton.vue';

// ========================================
// 初期設定
// ========================================
const router = useRouter();

// ========================================
// フォーム状態管理
// ========================================
const email = ref('');
const emailModified = ref(false);

// ========================================
// バリデーション状態管理
// ========================================
const errors = reactive({
  email: '',
});

// ========================================
// UI状態管理
// ========================================
const authError = ref('');
const successMessage = ref('');
const isSubmitting = ref(false);

// ========================================
// 算出プロパティ
// ========================================
// エラー時の赤枠表示制御
const showEmailBorder = computed(() => {
  return errors.email && !emailModified.value;
});

// エラーメッセージの集約
const validationErrors = computed(() => {
  const messages = [];
  if (errors.email) messages.push(errors.email);
  return messages;
});

// ========================================
// イベントハンドラ
// ========================================
const handlePasswordReset = async () => {
  // 状態をリセット
  errors.email = '';
  authError.value = '';
  successMessage.value = '';
  emailModified.value = false;

  // バリデーション実行
  const emailResult = validateEmail(email.value);
  if (!emailResult.isValid) {
    errors.email = emailResult.message;
    return;
  }

  // メール送信処理をシミュレート
  isSubmitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  successMessage.value = 'パスワードリセットのメールを送信しました。';

  // 3秒後にログイン画面へ遷移
  setTimeout(() => {
    router.push('/login');
    isSubmitting.value = false;
  }, 3000);
};
</script>
