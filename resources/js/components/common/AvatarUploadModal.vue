<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <!-- 背景のオーバーレイ -->
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-full p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
            <DialogPanel class="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <DialogTitle as="h3" class="pb-4 mb-6 text-lg font-bold leading-6 text-gray-900 border-b"> プロフィール画像の変更 </DialogTitle>

              <div class="mt-2 text-center">
                <!-- プレビューエリア -->
                <div class="flex justify-center mb-6">
                  <div class="relative group">
                    <img v-if="previewUrl" :src="previewUrl" alt="Preview" class="object-cover w-24 h-24 border-4 border-gray-100 rounded-full shadow-inner" />
                    <UserAvatar v-else :user="user" size="lg" />

                    <label v-if="!isUploading" class="absolute inset-0 flex items-center justify-center transition-colors rounded-full cursor-pointer group bg-black/30 hover:bg-black/40">
                      <input ref="fileInputRef" type="file" class="hidden" accept="image/*" @change="handleFileSelect" />
                      <BaseButton @click="triggerFileInput" variant="icon-dark" size="md" shape="rounded" :icon-only="true" tooltip="画像を変更">
                        <CameraIcon class="w-6 h-6" />
                      </BaseButton>
                    </label>
                  </div>
                </div>

                <!-- Vue側のバリデーションエラー -->
                <div v-if="error" class="p-3 mb-4 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50">{{ error }}</div>

                <!-- API側のエラー -->
                <div v-if="apiError" class="p-3 mb-4 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50">{{ apiError }}</div>

                <p class="mb-6 text-sm font-medium text-gray-500">
                  推奨: 400x400px 以上の正方形画像<br />
                  対応形式: JPG, PNG, WebP (最大 2MB)
                </p>

                <div class="flex justify-end pt-4 space-x-3 border-t">
                  <BaseButton variant="secondary" @click="closeModal" :disabled="isUploading"> キャンセル </BaseButton>
                  <BaseButton variant="primary" @click="handleSubmit" :disabled="!selectedFile || isUploading">
                    {{ isUploading ? '保存中...' : '適用する' }}
                  </BaseButton>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
// ==========================
// 外部インポート
// ==========================
import { ref, watch } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { CameraIcon } from '@heroicons/vue/24/outline';

// ==========================
// 内部インポート
// ==========================
// コンポーザブル
import { useUser } from '@/composables/useUser';
// コンポーネント
import BaseButton from '@/components/common/BaseButton.vue';
import UserAvatar from '@/components/common/UserAvatar.vue';
// バリデーション
import { validateAvatarFile } from '@/validators/profileValidator';

// ==========================
// 初期設定
// ==========================
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  user: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'updated']);

// ==========================
// 状態管理
// ==========================
// バリデーション
const error = ref('');

// API側のエラー
const apiError = ref('');

// ユーザー関連のロジック（プロフィール画像アップロード等）を提供するコンポーザブル
const { uploadAvatar } = useUser();
// 選択されたファイルの実体を保持
const selectedFile = ref(null);
// プレビュー表示用の画像URLを保持
const previewUrl = ref(null);
// アップロード処理中の状態フラグ
const isUploading = ref(false);
// ファイル選択input要素への参照
const fileInputRef = ref(null);

// ==========================
// ライフサイクル
// ==========================
// モーダルが閉じたときに状態をリセット
watch(
  () => props.isOpen,
  (newVal) => {
    if (!newVal) {
      resetState();
    }
  }
);

// ==========================
// メソッド
// ==========================
// モーダルの状態の初期化
const resetState = () => {
  selectedFile.value = null;
  // プレビュー用に生成したURLをメモリから解放
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }
  error.value = '';
  apiError.value = '';
  isUploading.value = false;
};

// モーダルを閉じる
const closeModal = () => {
  if (isUploading.value) return; // アップロード中は閉じない
  emit('close');
};

// ボタンクリックで隠れたファイル選択ダイアログを起動
const triggerFileInput = () => {
  fileInputRef.value?.click();
};

// ファイルが選択された際のハンドラ
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // エラー状態をリセット
  error.value = '';
  apiError.value = '';

  // ファイルのバリデーションを実行
  const validation = validateAvatarFile(file);
  if (!validation.isValid) {
    error.value = validation.message;
    return;
  }

  // プレビュー用のURLを生成
  selectedFile.value = file;
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value); // 古いURLは解放
  }
  previewUrl.value = URL.createObjectURL(file);
};
// プロフィール画像をアップロード
const handleSubmit = async () => {
  if (!selectedFile.value || isUploading.value) return;

  // バリデーション実行前に状態をリセット
  error.value = '';
  apiError.value = '';
  isUploading.value = true;

  try {
    // コンポーザブル経由でアップロード処理を実行
    const result = await uploadAvatar(selectedFile.value);

    if (result.success) {
      // 成功したら親コンポーネントに新しいURLを通知
      emit('updated', result.avatar_url);
      isUploading.value = false;
      closeModal();
    } else {
      // Laravel側のバリデーションエラー（422）の場合
      error.value = result.message || 'アップロードに失敗しました';
    }
  } catch (err) {
    console.error('Avatar upload error:', err);
    // 予期せぬエラーはapiErrorへ
    apiError.value = '予期せぬエラーが発生しました';
  } finally {
    // 更新完了後にフラグをクリア
    isUploading.value = false;
  }
};
</script>
