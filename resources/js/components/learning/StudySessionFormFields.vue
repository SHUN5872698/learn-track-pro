<template>
  <div class="space-y-6">
    <!-- 学習セクション選択ドロップダウン -->
    <div>
      <SectionSelector v-model="localForm.section_id" :sections="sections" :has-error="showSectionBorder" @modified="$emit('section-modified')" />
    </div>

    <!-- 学習日入力フィールド: 日付と時刻の選択、現時刻リセット機能 -->
    <div>
      <label for="studied-at" class="form-label">学習日</label>
      <div class="flex items-center w-full px-3 py-2 mt-1 text-sm placeholder-gray-400 border rounded-md shadow-sm appearance-none focus:outline-none" :class="[showStudiedAtBorder ? 'form-input-error' : 'form-input-normal']">
        <div class="flex items-center flex-1 space-x-2">
          <!-- 日付選択部分 -->
          <div @click.stop="handleDateClick" class="flex items-center px-2 py-1 space-x-2 transition-colors duration-200 rounded-md cursor-pointer hover:bg-gray-200">
            <CalendarIcon class="w-5 h-5 text-gray-400" />
            <span class="text-slate-700 md:hidden">{{ formattedDateShort }}</span>
            <span class="hidden text-slate-700 md:inline">{{ formattedDateFull }}</span>
          </div>
          <!-- 時刻選択部分 -->
          <div @click.stop="handleTimeClick" class="flex items-center px-2 py-1 space-x-2 transition-colors duration-200 rounded-md cursor-pointer hover:bg-gray-200">
            <ClockIcon class="w-5 h-5 text-gray-400" />
            <span class="text-slate-700"> {{ formattedTime }} </span>
          </div>
        </div>

        <!-- 現時刻ボタン：モバイルはアイコンのみ、デスクトップはテキスト -->
        <button type="button" @click.stop="handleResetTime" class="flex items-center justify-center px-2 py-1 text-sm font-medium transition-colors rounded-md cursor-pointer text-violet-600 hover:bg-violet-100 md:px-3" title="現時刻にリセット">
          <!-- モバイル：アイコンのみ -->
          <ArrowPathIcon class="w-5 h-5 md:hidden" />
          <!-- デスクトップ：テキスト -->
          <span class="hidden md:inline">現時刻</span>
        </button>
      </div>
    </div>

    <!-- 学習時間入力ボタン -->
    <div>
      <label for="study-time" class="form-label"> 学習時間<span class="pl-1 text-red-500">*</span> </label>
      <button type="button" @click="handleDurationClick" class="text-sm form-input-base hover:bg-gray-100" :class="[showDurationBorder ? 'form-input-error' : 'form-input-normal']">
        <div class="flex items-center space-x-2">
          <ClockIcon class="w-5 h-5 text-gray-400" />
          <span class="text-slate-700"> {{ displayStudyHours }}時間 {{ displayStudyMinutes }}分</span>
        </div>
      </button>
    </div>

    <!-- 学習メモ入力テキストエリア -->
    <div>
      <label for="memo" class="form-label">学習メモ</label>
      <textarea id="memo" name="memo" rows="5" autocomplete="off" class="text-sm form-input-base" :class="[showMemoBorder ? 'form-input-error' : 'form-input-normal']" placeholder="学習した内容のメモや感想を自由に入力してください。" v-model="localForm.memo" @input="$emit('memo-modified')"></textarea>
      <p class="text-counter" :class="{ 'text-counter-over': memoIsOverLimit }">{{ memoCounterText }}</p>
    </div>

    <!-- 学習中の調子評価スターアイコン -->
    <div>
      <label class="form-label">学習中の調子</label>
      <div class="flex items-center mt-2 space-x-2">
        <StarIcon v-for="rating in 5" :key="rating" @click="localForm.mood_rating = localForm.mood_rating === rating ? 0 : rating" class="w-8 h-8 transition-all duration-200 cursor-pointer" :class="rating <= localForm.mood_rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'" />
      </div>
    </div>
  </div>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed } from 'vue';
import { StarIcon, CalendarIcon, ClockIcon, ArrowPathIcon } from '@heroicons/vue/24/solid';

// ========================================
// 内部インポート
// ========================================
// コンポーネント
import SectionSelector from '@/components/common/SectionSelector.vue';

// バリデーションルール
import { STUDY_SESSION_VALIDATION_RULES } from '@/validators/studySessionValidator.js';

// ========================================
// 初期設定
// ========================================
const props = defineProps({
  modelValue: Object,
  sections: Array,
  learningContentTitle: String,
  formattedDateFull: String,
  formattedDateShort: String,
  formattedTime: String,
  displayStudyHours: Number,
  displayStudyMinutes: Number,
  showSectionBorder: Boolean,
  showDurationBorder: Boolean,
  showMemoBorder: Boolean,
  showStudiedAtBorder: Boolean,
});

const emit = defineEmits(['update:modelValue', 'openDateModal', 'openTimeModal', 'resetTimeToNow', 'section-modified', 'duration-modified', 'memo-modified', 'studied-at-modified']);

// ========================================
// 状態管理
// ========================================
// 定数
const MAX_TEXTAREA_LENGTH = STUDY_SESSION_VALIDATION_RULES.MAX_MEMO_LENGTH;

// ========================================
// 算出プロパティ
// ========================================
const localForm = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// 文字数カウント
const memoLength = computed(() => localForm.value?.memo?.length || 0);
const memoIsOverLimit = computed(() => memoLength.value > MAX_TEXTAREA_LENGTH);
const memoCounterText = computed(() => `${memoLength.value}/${MAX_TEXTAREA_LENGTH}文字`);

// ========================================
// メソッド
// ========================================
// イベントハンドラ
const handleDateClick = () => {
  emit('studied-at-modified');
  emit('openDateModal');
};

const handleTimeClick = () => {
  emit('studied-at-modified');
  emit('openTimeModal', 'timeOfDay');
};

const handleResetTime = () => {
  emit('studied-at-modified');
  emit('resetTimeToNow');
};

const handleDurationClick = () => {
  emit('duration-modified');
  emit('openTimeModal', 'duration');
};
</script>
