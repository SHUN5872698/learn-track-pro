<template>
  <!-- 500エラー専用コンポーネント -->
  <TransitionRoot :show="errorModalStore.isVisible" as="template">
    <Dialog as="div" class="relative z-50" @close="() => {}">
      <!-- 背景オーバーレイ -->
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
      </TransitionChild>

      <!-- モーダルコンテンツ -->
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex items-center justify-center min-h-full p-4 text-center md:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            enter-to="opacity-100 translate-y-0 md:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 md:scale-100"
            leave-to="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
          >
            <DialogPanel class="relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl md:my-8 md:w-full md:max-w-lg md:p-6">
              <div class="md:flex md:items-start">
                <!-- アイコン -->
                <div class="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full md:mx-0 md:h-10 md:w-10">
                  <ExclamationTriangleIcon class="w-6 h-6 text-red-600" aria-hidden="true" />
                </div>

                <!-- テキスト -->
                <div class="mt-3 text-center md:ml-4 md:mt-0 md:text-left">
                  <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900"> エラーが発生しました </DialogTitle>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">サーバーエラーが発生しました</p>
                  </div>
                </div>
              </div>

              <!-- ボタン -->
              <div class="mt-5 md:mt-4 md:flex md:flex-row-reverse">
                <button type="button" class="inline-flex justify-center w-full px-3 py-2 text-sm text-white rounded-md shadow-sm bg-violet-600 hover:bg-violet-500 md:ml-3 md:w-auto" @click="handleReload">ページを再読み込み</button>
                <button type="button" class="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 md:mt-0 md:w-auto" @click="handleBackToDashboard">ダッシュボードへ戻る</button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';

// ========================================
// 内部インポート
// ========================================
import { useErrorModalStore } from '@/stores/errorModal';

// ========================================
// 初期設定
// ========================================
const errorModalStore = useErrorModalStore();

// ========================================
// メソッド
// ========================================
// ページを再読み込み
const handleReload = () => {
  window.location.reload();
};

// ダッシュボードへ戻る
const handleBackToDashboard = () => {
  errorModalStore.hideError();
  window.location.href = '/dashboard';
};
</script>
