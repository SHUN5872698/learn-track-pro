<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="$emit('close')">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-full p-4 text-center">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
            <DialogPanel class="w-full max-w-md p-8 transform border shadow-xl bg-white/90 backdrop-blur-md rounded-2xl border-white/20">
              <h3 class="mb-6 text-xl font-bold text-center text-slate-900">日付を選択</h3>

              <!-- カレンダーヘッダー -->
              <div class="flex items-center justify-between mb-4">
                <BaseButton @click="prevMonth" variant="ghost" size="md" shape="circle" :icon-only="true">
                  <ChevronLeftIcon class="w-5 h-5 text-gray-600" />
                </BaseButton>
                <span class="text-lg font-semibold text-slate-800">{{ currentYear }}年 {{ currentMonth + 1 }}月</span>
                <BaseButton @click="nextMonth" variant="ghost" size="md" shape="circle" :icon-only="true">
                  <ChevronRightIcon class="w-5 h-5 text-gray-600" />
                </BaseButton>
              </div>

              <!-- カレンダーグリッド -->
              <div class="grid grid-cols-7 gap-1 text-center">
                <div v-for="dayName in dayNames" :key="dayName" class="py-2 text-sm font-medium text-gray-500">{{ dayName }}</div>
                <div
                  v-for="day in calendarDays"
                  :key="day.dateString"
                  class="py-2 rounded-lg cursor-pointer"
                  :class="{
                    'text-gray-400': !day.isCurrentMonth,
                    'text-slate-800': day.isCurrentMonth,
                    'bg-blue-100 text-blue-700 font-semibold': day.isToday && day.isCurrentMonth && !isSelected(day.date),
                    'bg-violet-600 text-white font-bold': isSelected(day.date),
                    'hover:bg-gray-100': day.isCurrentMonth && !isSelected(day.date),
                  }"
                  @click="selectDate(day.date)"
                >
                  {{ day.date.getDate() }}
                </div>
              </div>

              <!-- アクション -->
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
import { ref, computed, watch } from 'vue';
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';
import BaseButton from './BaseButton.vue';
import CancelButton from './buttons/CancelButton.vue';

const props = defineProps({
  isOpen: Boolean,
  initialDate: String, // YYYY-MM-DD
});

const emit = defineEmits(['close', 'confirm']);

const currentMonth = ref(0); // 0-11
const currentYear = ref(0);
const selectedDate = ref(null); // Date object

const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

// モーダルが開いたときにカレンダーの表示を初期化する
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      const dateToSet = props.initialDate ? new Date(props.initialDate) : new Date();
      currentMonth.value = dateToSet.getMonth();
      currentYear.value = dateToSet.getFullYear();
      // initialDateが提供されている場合のみ、その日付を選択状態にする
      selectedDate.value = props.initialDate ? dateToSet : null;
    }
  },
  { immediate: true }
);

const today = new Date();
today.setHours(0, 0, 0, 0); // 日付比較のために時刻情報をリセット

// 指定された日付が今日であるかを判定する
const isToday = (date) => {
  return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
};

// 指定された日付が選択されているかを判定する
const isSelected = (date) => {
  // selectedDate.value が null の場合は false を返すように明示的に追加
  if (!selectedDate.value) return false;

  return date.getFullYear() === selectedDate.value.getFullYear() && date.getMonth() === selectedDate.value.getMonth() && date.getDate() === selectedDate.value.getDate();
};

// カレンダーの日付グリッドを生成する
const generateCalendarDays = computed(() => {
  const days = [];
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1);
  const lastDayOfMonth = new Date(currentYear.value, currentMonth.value + 1, 0);
  const numDaysInMonth = lastDayOfMonth.getDate();

  // 前月の日付を追加して最初の週を埋める
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0:日曜日, 1:月曜日...
  for (let i = 0; i < startDayOfWeek; i++) {
    const prevMonthDay = new Date(currentYear.value, currentMonth.value, 0 - (startDayOfWeek - 1 - i));
    days.push({ date: prevMonthDay, isCurrentMonth: false, dateString: prevMonthDay.toISOString().split('T')[0] });
  }

  // 今月の日付を追加
  for (let i = 1; i <= numDaysInMonth; i++) {
    const currentMonthDay = new Date(currentYear.value, currentMonth.value, i);
    days.push({ date: currentMonthDay, isCurrentMonth: true, dateString: currentMonthDay.toISOString().split('T')[0] });
  }

  // 翌月の日付を追加して最後の週を埋める
  const totalDays = days.length;
  const remainingCells = 42 - totalDays; // 一貫したレイアウトのために6週間分を確保
  for (let i = 1; i <= remainingCells; i++) {
    const nextMonthDay = new Date(currentYear.value, currentMonth.value + 1, i);
    days.push({ date: nextMonthDay, isCurrentMonth: false, dateString: nextMonthDay.toISOString().split('T')[0] });
  }

  return days;
});

const calendarDays = generateCalendarDays;

// 前の月に移動する
const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

// 次の月に移動する
const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

// 日付を選択する
const selectDate = (date) => {
  selectedDate.value = date;
};

// 選択を確定し、親コンポーネントに日付を通知する
const confirmSelection = () => {
  if (selectedDate.value) {
    const year = selectedDate.value.getFullYear();
    const month = String(selectedDate.value.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.value.getDate()).padStart(2, '0');
    emit('confirm', `${year}-${month}-${day}`);
  }
  emit('close');
};
</script>
