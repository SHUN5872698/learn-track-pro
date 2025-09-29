<template>
  <!-- モーダルのルート要素: 表示状態とテンプレートモードを制御 -->
  <TransitionRoot :show="isOpen" as="div">
    <!-- ダイアログコンポーネント: モーダルのアクセシビリティと閉じるイベントを管理 -->
    <Dialog as="div" class="relative z-50" @close="$emit('close')">

      <!-- モーダルの背景オーバーレイ: フェードイン/アウトのアニメーション -->
      <TransitionChild as="div" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
      </TransitionChild>

      <!-- モーダルコンテンツのコンテナ: スクロール可能で中央に配置 -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-full p-4">

          <!-- モーダルパネルのトランジション: スケールとフェードイン/アウトのアニメーション -->
          <TransitionChild enter="ease-out duration-300" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
            <!-- モーダルパネル本体: 時間選択UIを含む -->
            <DialogPanel as="div" class="w-full max-w-md p-8 transform border shadow-xl bg-white/90 backdrop-blur-md rounded-2xl border-white/20">
              <!-- モーダルのタイトル -->
              <h3 class="mb-6 text-xl font-bold text-center text-slate-900">時間を選択</h3>

              <!-- 時間と分の入力フィールドコンテナ -->
              <div class="flex items-center justify-center mb-6 space-x-4">
                <!-- 時間入力セクション -->
                <div>
                  <label for="hours" class="block mb-1 text-sm font-medium text-slate-700">時間</label>
                  <input id="hours" type="number" v-model.number="selectedHours" min="0" max="23" class="block w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm" />
                </div>
                <!-- 区切り文字 -->
                <span class="text-2xl font-bold text-slate-700">:</span>
                <!-- 分入力セクション -->
                <div>
                  <label for="minutes" class="block mb-1 text-sm font-medium text-slate-700">分</label>
                  <input id="minutes" type="number" v-model.number="selectedMinutes" min="0" max="59" class="block w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm" />
                </div>
              </div>

              <!-- アクションボタンコンテナ -->
              <div class="flex justify-end pt-6 space-x-3">
                <CancelButton @click="$emit('close')" />
                <BaseButton variant="primary" @click="confirmSelection">確認</BaseButton>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue';
import BaseButton from '@/components/common/BaseButton.vue';
import CancelButton from '@/components/common/buttons/CancelButton.vue';

const props = defineProps({
  isOpen: Boolean,
  initialHours: { type: Number, default: 0 },
  initialMinutes: { type: Number, default: 0 },
  isTimeOfDayMode: { type: Boolean, default: false },
});

const emit = defineEmits(['close', 'confirm']);

const selectedHours = ref(props.initialHours);
const selectedMinutes = ref(props.initialMinutes);

// モーダルが開いたときに選択された時間と分を初期化する: ユーザーがモーダルを開くたびに、初期値が正しく反映されるようにするため
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      selectedHours.value = props.initialHours;
      selectedMinutes.value = props.initialMinutes;
    }
  },
  { immediate: true }
);

// 選択を確定し、親コンポーネントに時間と分を通知する: ユーザーが「確認」ボタンをクリックした際に、選択された時間と分を親コンポーネントに渡し、モーダルを閉じるため
const confirmSelection = () => {
  emit('confirm', { hours: selectedHours.value, minutes: selectedMinutes.value, isTimeOfDay: props.isTimeOfDayMode });
  emit('close');
};
</script>
