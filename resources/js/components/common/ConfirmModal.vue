<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="$emit('cancel')">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-full p-4">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
            <DialogPanel class="w-full max-w-md p-8 transform border shadow-xl bg-white/90 backdrop-blur-md rounded-2xl border-white/20">
              <h3 class="mb-4 text-xl font-bold text-slate-900">{{ title }}</h3>

              <!-- カスタムコンテンツスロット -->
              <slot name="content">
                <p v-if="message" class="mb-6 text-slate-600">{{ message }}</p>
                <p v-else-if="showItemDetail && itemName" class="mb-6 text-slate-600">「{{ itemName }}」を削除すると関連する学習記録も全て削除されます。この操作は元に戻せません。</p>
              </slot>

              <div class="flex justify-end space-x-3">
                <CancelButton @click="$emit('cancel')" />
                <BaseButton :variant="confirmButtonVariant" @click="$emit('confirm')">
                  {{ confirmButtonText }}
                </BaseButton>
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
defineProps({
  isOpen: { type: Boolean, default: false },
  title: {
    type: String,
    default: '学習内容を削除しますか？',
  },
  message: {
    type: String,
    default: '',
  },
  itemName: {
    type: String,
    default: '',
  },
  confirmButtonText: {
    type: String,
    default: '削除',
  },
  confirmButtonVariant: {
    type: String,
    default: 'danger',
  },
  showItemDetail: {
    type: Boolean,
    default: true,
  },
});

defineEmits(['confirm', 'cancel']);
</script>
