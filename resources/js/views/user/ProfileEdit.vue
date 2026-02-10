<template>
  <!-- プロフィール編集コンポーネント -->
  <DetailLayout>
    <!-- セクションヘッダー -->
    <template #section-header>
      <h2 class="section-header">プロフィール編集</h2>
      <div class="section-subtext">
        <span>プロフィール情報を編集します。</span>
      </div>
    </template>
    <div>
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

      <!-- プロフィール編集フォーム -->
      <form @submit.prevent="handleSubmit">
        <div class="space-y-6">
          <!-- プロフィール画像表示と変更ボタン -->
          <div>
            <label for="avatar" class="form-label">プロフィール画像</label>
            <div class="flex items-center space-x-4">
              <UserAvatar :user="formData" size="md" />
              <BaseButton type="button" variant="secondary" @click="isAvatarModalOpen = true">画像を変更</BaseButton>
            </div>
          </div>

          <!-- 名前入力フィールド -->
          <div>
            <label for="name" class="form-label">名前<span class="pl-1 text-red-500">*</span></label>
            <input id="name" name="name" type="text" autocomplete="off" class="form-input-base" :class="[showNameBorder ? 'form-input-error' : 'form-input-normal']" placeholder="例: 山田 太郎" v-model="formData.name" @input="nameModified = true" />
          </div>

          <!-- メールアドレス入力フィールド -->
          <div>
            <label for="email-address" class="form-label">メールアドレス<span class="pl-1 text-red-500">*</span></label>
            <input id="email-address" name="email" type="email" autocomplete="off" class="form-input-base" :class="[showEmailBorder ? 'form-input-error' : 'form-input-normal']" placeholder="your@email.com" v-model="formData.email" @input="emailModified = true" />
          </div>
        </div>
      </form>
    </div>
    <div class="flex flex-col pt-6 space-y-2 border-t md:flex-row md:justify-between md:space-y-0">
      <BaseButton variant="secondary" size="md" class="w-full md:w-auto" @click="handleCancel">キャンセル</BaseButton>
      <BaseButton type="submit" variant="primary" size="md" class="w-full md:w-auto" :disabled="isSubmitting" @click="handleSubmit">保存</BaseButton>
    </div>
  </DetailLayout>

  <Teleport to="#app">
    <SuccessToast :show="showSuccessToast" title="更新完了" message="プロフィールを更新しました！" :duration="toastDuration" />
    <AvatarUploadModal :is-open="isAvatarModalOpen" :user="formData" @close="isAvatarModalOpen = false" @updated="onAvatarUpdated" />
  </Teleport>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

// ========================================
// 内部インポート
// ========================================
// Piniaストア
import { useAuthStore } from '@/stores/auth';

// コンポーネント
import DetailLayout from '@/layouts/DetailLayout.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import SuccessToast from '@/components/common/SuccessToast.vue';
import UserAvatar from '@/components/common/UserAvatar.vue';
import AvatarUploadModal from '@/components/common/AvatarUploadModal.vue';

// バリデーション
import { validateProfile } from '@/validators/profileValidator';

// ========================================
// 初期設定
// ========================================
const router = useRouter();
const authStore = useAuthStore();

// ========================================
// 状態管理
// ========================================
// 入力状態
const formData = reactive({
  name: '',
  email: '',
  avatar: '',
});

// バリデーション
// 各入力フィールドのエラーメッセージを保持
const errors = reactive({
  name: '',
  email: '',
  avatar: '',
});

// API側のエラー
const apiError = ref('');

// 各入力フィールドが変更されたかどうかのフラグ
const nameModified = ref(false);
const emailModified = ref(false);

// UI状態
const isSubmitting = ref(false);
const imageError = ref(false);
const showSuccessToast = ref(false);
const isAvatarModalOpen = ref(false);

// 定数
const toastDuration = 2000; // 通知を表示させる時間

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

// Vue側のバリデーションエラーメッセージを集約
const validationErrors = computed(() => {
  const messages = [];
  if (errors.name) messages.push(errors.name);
  if (errors.email) messages.push(errors.email);
  if (errors.avatar) messages.push(errors.avatar);
  return messages;
});

// ========================================
// ライフサイクル
// ========================================
// コンポーネントがマウントされた時にユーザーデータをフォームに初期設定
onMounted(async () => {
  // ログアウト中は処理をスキップ
  if (!authStore.isLoggedIn) {
    return;
  }
  // プロフィール情報がなければ取得
  if (!authStore.authUser) {
    await authStore.fetchUser();
  }

  // Piniaストアから初期値を設定
  if (authStore.authUser) {
    formData.name = authStore.authUser.name || '';
    formData.email = authStore.authUser.email || '';
    formData.avatar = authStore.authUser.avatar || '';
  }
});

// ========================================
// メソッド
// ========================================
// イベントハンドラ
// キャンセルボタンクリック時の処理: プロフィールページへ戻る
const handleCancel = () => {
  router.push('/profile');
};

// プロフィール画像更新完了時の処理
const onAvatarUpdated = (newAvatarUrl) => {
  formData.avatar = newAvatarUrl;
};

// API送信処理
// プロフィール情報の更新
const handleSubmit = async () => {
  // バリデーション実行前に状態をリセット
  errors.name = '';
  errors.email = '';
  errors.avatar = '';
  apiError.value = '';
  nameModified.value = false;
  emailModified.value = false;

  // 空白を除去
  formData.name = formData.name.trim();
  formData.email = formData.email.trim();

  // フィールドバリデーション
  const validation = validateProfile(formData);

  // バリデーション結果に基づいてエラーメッセージを設定
  if (!validation.isValid) {
    Object.keys(validation.errors).forEach((key) => {
      errors[key] = validation.errors[key];
    });
    return;
  }

  // ボタンの無効化（二重送信防止）
  isSubmitting.value = true;
  // プロフィール情報の更新
  try {
    const profileUpdateData = {
      name: formData.name,
      email: formData.email,
      avatar: formData.avatar,
    };
    // Piniaストアのアクションを呼び出し、プロフィール情報の更新
    await authStore.updateProfile(profileUpdateData);

    // 成功メッセージを表示し、プロフィール詳細ページへ遷移
    showSuccessToast.value = true;
    setTimeout(() => {
      router.push('/profile');
    }, toastDuration);
  } catch (error) {
    console.error('プロフィール更新エラー:', error);
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
