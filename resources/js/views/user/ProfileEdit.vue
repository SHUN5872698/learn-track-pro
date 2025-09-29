<template>
  <!-- プロフィール編集コンポーネント -->
  <DetailLayout title="プロフィール編集" description="プロフィール情報を編集します。">
    <div>
      <!-- バリデーションエラーメッセージの表示エリア -->
      <div v-if="validationErrors.length" class="p-4 mb-6 text-red-800 bg-red-100 border-l-4 border-red-500 rounded-md">
        <h3 class="font-bold">入力エラー</h3>
        <ul class="mt-2 ml-2 list-disc list-inside">
          <li v-for="error in validationErrors" :key="error">{{ error }}</li>
        </ul>
      </div>

      <!-- プロフィール編集フォーム -->
      <form @submit.prevent="handleSubmit">
        <div class="space-y-6">
          <!-- 名前入力フィールド -->
          <div>
            <label class="block mb-2 text-sm font-medium">名前<span class="pl-1 text-red-500">*</span></label>
            <input v-model="formData.name" type="text" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" :class="errors.name ? 'border-red-500' : ''" placeholder="例: 山田太郎" />
          </div>

          <!-- メールアドレス入力フィールド -->
          <div>
            <label class="block mb-2 text-sm font-medium">メールアドレス<span class="pl-1 text-red-500">*</span></label>
            <input v-model="formData.email" type="email" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" :class="errors.email ? 'border-red-500' : ''" placeholder="your@email.com" />
          </div>

          <!-- アバター画像表示と変更ボタン -->
          <div>
            <label class="block mb-2 text-sm font-medium">アバター画像</label>
            <div class="flex items-center space-x-4">
              <UserAvatar :user="formData" size="md" />
              <BaseButton type="button" variant="secondary" :disabled="true"> 画像を変更 </BaseButton>
            </div>
            <p class="mt-2 text-sm text-gray-500">※画像アップロード機能は準備中です</p>
          </div>
        </div>
      </form>
    </div>
    <template #actions>
      <div class="flex justify-between pt-6 mt-6 space-x-3">
        <BaseButton @click="handleCancel" variant="secondary"> キャンセル </BaseButton>
        <BaseButton @click="handleSubmit" variant="primary" type="submit"> 保存 </BaseButton>
      </div>
    </template>
  </DetailLayout>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

// ========================================
// 内部インポート
// ========================================
// Piniaストア
import { useAuthStore } from '@/stores/auth';

// バリデーション
import { validateProfile, validateField } from '@/validators/profileValidator';

// コンポーネント
import DetailLayout from '@/layouts/DetailLayout.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import UserAvatar from '@/components/common/UserAvatar.vue';

// ========================================
// 初期設定
// ========================================
const router = useRouter();
const authStore = useAuthStore();

// ========================================
// 状態管理
// ========================================
// フォームの入力値を保持するためのリアクティブなオブジェクト
const formData = reactive({
  name: '',
  email: '',
  avatar: '',
});

const imageError = ref(false);

// バリデーションエラーメッセージを保持するためのリアクティブなオブジェクト
const errors = reactive({
  name: '',
  email: '',
  avatar: '',
});

// パスワード表示/非表示のrefは削除（パスワード機能削除のため）

// ========================================
// 算出プロパティ
// ========================================
// ユーザー名のイニシャルを生成: ユーザーアバターの代替表示として利用するため
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
  // ユーザー情報がなければ取得
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
const handleSubmit = async () => {
  // エラーメッセージを全てクリア
  errors.name = '';
  errors.email = '';
  errors.avatar = '';
  authStore.clearAuthErrors();

  // フォーム全体のバリデーションを実行
  const validation = validateProfile(formData);

  if (!validation.isValid) {
    // バリデーションエラーがある場合、エラーメッセージを対応するフィールドに設定
    Object.keys(validation.errors).forEach((key) => {
      errors[key] = validation.errors[key];
    });
    return;
  }

  // パスワード変更を試みるかどうかを判定
  const isPasswordChangeAttempted = formData.current_password || formData.password || formData.password_confirmation;

  try {
    // プロフィール情報の更新のみ（パスワード更新処理は削除）
    const profileUpdateData = {
      name: formData.name,
      email: formData.email,
      avatar: formData.avatar,
    };

    const profileResponse = await authStore.updateProfile(profileUpdateData);

    if (!profileResponse.success) {
      // プロフィール更新が失敗した場合
      if (authStore.authErrors) {
        Object.keys(authStore.authErrors).forEach((key) => {
          errors[key] = authStore.authErrors[key][0] || authStore.authErrors[key];
        });
      }
      return;
    }

    // 更新成功
    alert('プロフィールを更新しました');
    router.push('/profile');
  } catch (error) {
    // 予期せぬエラーが発生した場合
    console.error('更新エラー:', error);
    alert(error.message || '更新中に予期せぬエラーが発生しました');
  }
};

// キャンセルボタンクリック時の処理: プロフィールページへ戻る
const handleCancel = () => {
  router.push('/profile');
};

// ヘルパー関数
// 特定のフィールドのリアルタイムバリデーションを実行
const validateInput = (fieldName) => {
  errors[fieldName] = validateField(fieldName, formData[fieldName], formData);
};
</script>
