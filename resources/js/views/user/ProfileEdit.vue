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
              <img v-if="formData.avatar && !imageError" :src="formData.avatar" class="object-cover w-20 h-20 rounded-full" @error="handleImageError" />
              <div v-else class="flex items-center justify-center w-20 h-20 text-2xl font-bold text-white rounded-full bg-gradient-to-r from-violet-600 to-emerald-600">
                {{ userInitials }}
              </div>
              <BaseButton type="button" variant="secondary" :disabled="true"> 画像を変更 </BaseButton>
            </div>
            <p class="mt-2 text-sm text-gray-500">※画像アップロード機能は準備中です</p>
          </div>

          <!-- パスワード変更セクションのタイトル -->
          <h3 class="mt-8 mb-4 text-xl font-bold">パスワード変更</h3>

          <!-- 現在のパスワード入力フィールド -->
          <div>
            <label class="block mb-2 text-sm font-medium">現在のパスワード</label>
            <div class="relative mt-1">
              <input
                v-model="formData.current_password"
                :type="showCurrentPassword ? 'text' : 'password'"
                class="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errors.current_password ? 'border-red-500' : ''"
                placeholder="現在のパスワードを入力"
              />
              <button type="button" @click="showCurrentPassword = !showCurrentPassword" class="absolute inset-y-0 right-0 flex items-center pr-3">
                <EyeIcon v-if="!showCurrentPassword" class="w-5 h-5 text-gray-400" />
                <EyeSlashIcon v-else class="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <!-- 新しいパスワード入力フィールド -->
          <div>
            <label class="block mb-2 text-sm font-medium">新しいパスワード</label>
            <div class="relative mt-1">
              <input v-model="formData.new_password" :type="showNewPassword ? 'text' : 'password'" class="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" :class="errors.new_password ? 'border-red-500' : ''" placeholder="新しいパスワードを入力" />
              <button type="button" @click="showNewPassword = !showNewPassword" class="absolute inset-y-0 right-0 flex items-center pr-3">
                <EyeIcon v-if="!showNewPassword" class="w-5 h-5 text-gray-400" />
                <EyeSlashIcon v-else class="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <!-- 新しいパスワード（確認）入力フィールド -->
          <div>
            <label class="block mb-2 text-sm font-medium">新しいパスワード（確認）</label>
            <div class="relative mt-1">
              <input
                v-model="formData.new_password_confirmation"
                :type="showNewPasswordConfirmation ? 'text' : 'password'"
                class="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errors.new_password_confirmation ? 'border-red-500' : ''"
                placeholder="新しいパスワードを再入力"
              />
              <button type="button" @click="showNewPasswordConfirmation = !showNewPasswordConfirmation" class="absolute inset-y-0 right-0 flex items-center pr-3">
                <EyeIcon v-if="!showNewPasswordConfirmation" class="w-5 h-5 text-gray-400" />
                <EyeSlashIcon v-else class="w-5 h-5 text-gray-400" />
              </button>
            </div>
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
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid';

// ========================================
// 内部インポート
// ========================================
// Piniaストア（変更: useUser → useAuthStore）
import { useAuthStore } from '@/stores/auth';

// バリデーション
import { validateProfile, validateField } from '../../validators/profileValidator';

// コンポーネント
import DetailLayout from '../../layouts/DetailLayout.vue';
import BaseButton from '../../components/common/BaseButton.vue';

// ========================================
// 初期設定
// ========================================
const router = useRouter();

// Piniaストア実行（変更）
const authStore = useAuthStore();

// ========================================
// 状態管理
// ========================================
// フォームの入力値を保持するためのリアクティブなオブジェクト
const formData = reactive({
  name: '',
  email: '',
  avatar: '',
  current_password: '',
  new_password: '',
  new_password_confirmation: '',
});

const imageError = ref(false);

// バリデーションエラーメッセージを保持するためのリアクティブなオブジェクト
const errors = reactive({
  name: '',
  email: '',
  avatar: '',
  current_password: '',
  new_password: '',
  new_password_confirmation: '',
});

// パスワードの表示/非表示を切り替えるためのリアクティブな参照
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showNewPasswordConfirmation = ref(false);

// ========================================
// 算出プロパティ
// ========================================
// ユーザー名のイニシャルを生成: ユーザーアバターの代替表示として利用するため
const userInitials = computed(() => {
  if (!formData.name) return '?';
  const names = formData.name.split(' ');
  // 複数の単語からなる名前の場合、各単語の頭文字を結合して表示
  if (names.length >= 2) {
    return names[0][0] + names[1][0];
  }
  // 単一の単語からなる名前の場合、最初の2文字を大文字で表示
  return formData.name.substring(0, 2).toUpperCase();
});

// 全てのバリデーションエラーメッセージを結合して表示するための算出プロパティ
const validationErrors = computed(() => {
  const messages = [];
  if (errors.name) messages.push(errors.name);
  if (errors.email) messages.push(errors.email);
  if (errors.avatar) messages.push(errors.avatar);
  if (errors.current_password) messages.push(errors.current_password);
  if (errors.new_password) messages.push(errors.new_password);
  if (errors.new_password_confirmation) messages.push(errors.new_password_confirmation);
  return messages;
});

// ========================================
// ライフサイクル
// ========================================
// コンポーネントがマウントされた時にユーザーデータをフォームに初期設定
onMounted(async () => {
  // ユーザー情報がなければ取得（追加）
  if (!authStore.authUser) {
    await authStore.fetchUser();
  }

  // Piniaストアから初期値を設定（変更）
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
// 画像読み込みエラー時は非表示にする
const handleImageError = (e) => {
  imageError.value = true;
};

// フォーム送信時の処理: エラーのクリア、バリデーション、プロファイルとパスワードの更新
const handleSubmit = async () => {
  // 変更: async追加
  // 以前のエラーメッセージを全てクリア
  errors.name = '';
  errors.email = '';
  errors.avatar = '';
  errors.current_password = '';
  errors.new_password = '';
  errors.new_password_confirmation = '';

  // フォーム全体のバリデーションを実行
  const validation = validateProfile(formData);

  if (!validation.isValid) {
    // バリデーションエラーがある場合、エラーメッセージを対応するフィールドに設定
    Object.keys(validation.errors).forEach((key) => {
      errors[key] = validation.errors[key];
    });
    return;
  }

  // プロフィール情報のみを更新するためのデータを作成
  const profileUpdateData = {
    name: formData.name,
    email: formData.email,
    avatar: formData.avatar,
  };
  // プロフィール更新処理を実行（変更: Piniaストアのメソッドを使用）
  const profileResult = await authStore.updateUserProfile(profileUpdateData);

  // パスワード関連のフィールドが入力されている場合のみパスワード更新を試みる
  if (formData.current_password || formData.new_password || formData.new_password_confirmation) {
    // TODO: パスワード更新APIの実装待ち
    alert('パスワード更新機能は準備中です');
    return;
  }

  // プロフィール更新が成功した場合、成功メッセージを表示し、プロフィールページへ遷移
  if (profileResult.success) {
    alert('プロフィールを更新しました');
    router.push('/profile');
  } else {
    // プロフィール更新が失敗した場合、エラーメッセージを表示
    alert(profileResult.message || 'エラーが発生しました');
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
