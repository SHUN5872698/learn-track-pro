<template>
  <!-- 学習記録削除用のモーダルコンポーネント -->
  <TransitionRoot :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="$emit('cancel')">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-full p-4">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
            <DialogPanel class="w-full max-w-md p-8 transform border shadow-xl bg-white/90 backdrop-blur-md rounded-2xl border-white/20">
              <h3 class="mb-4 text-xl font-bold text-slate-900">学習記録を削除しますか？</h3>

              <!-- 学習記録の詳細表示 -->
              <div v-if="record" class="p-4 mb-6 text-sm rounded-xl bg-slate-50">
                <p><span class="font-semibold">日時:</span> {{ formatDateTime(record.studied_at) }}</p>
                <p><span class="font-semibold">学習時間:</span> {{ formatMinutes(record.study_minutes) }}</p>
                <div v-if="record.memo" class="mt-2">
                  <span class="font-semibold">メモ:</span>
                  <p class="mt-1 break-words whitespace-pre-wrap">{{ record.memo }}</p>
                </div>
              </div>

              <p class="mb-6 text-slate-600">この操作は元に戻せません。</p>

              <div class="flex justify-end space-x-3">
                <CancelButton @click="$emit('cancel')" :disabled="isSubmitting" />
                <BaseButton variant="danger" @click="$emit('confirm')" :disabled="isSubmitting">削除</BaseButton>
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
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue';

// ========================================
// 内部インポート
// ========================================
import BaseButton from '@/components/common/BaseButton.vue';
import CancelButton from '@/components/common/buttons/CancelButton.vue';

// ========================================
// 初期設定
// ========================================
import { formatDateTime, formatMinutes } from '@/utils/dateFormatters';

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  record: {
    type: Object,
    default: null,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['confirm', 'cancel']);
</script>
