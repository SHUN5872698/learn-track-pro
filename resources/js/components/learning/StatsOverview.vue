<template>
  <!-- 学習統計サマリーカード -->
  <div class="mb-8">
    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <!-- 学習中コース -->
      <div class="p-6 transition-all duration-300 transform border shadow-lg bg-white/70 backdrop-blur-md rounded-2xl hover:shadow-xl border-white/20 hover:scale-105">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="flex items-center justify-center bg-gradient-to-br from-violet-100 to-violet-200 rounded-xl">
              <BookOpenIcon class="w-10 h-10 text-violet-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-slate-500">学習中コース</p>
            <p class="text-xl font-bold md:text-2xl text-slate-900">{{ learningContents.filter((content) => content.status !== 'completed').length }}</p>
          </div>
        </div>
      </div>

      <!-- 完了セクション -->
      <div class="p-6 transition-all duration-300 transform border shadow-lg bg-white/70 backdrop-blur-md rounded-2xl hover:shadow-xl border-white/20 hover:scale-105">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl">
              <CheckBadgeIcon class="w-10 h-10 text-emerald-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-slate-500">完了セクション</p>
            <p class="text-xl font-bold md:text-2xl text-slate-900">{{ totalCompletedSections }}/{{ totalSections }}</p>
          </div>
        </div>
      </div>

      <!-- 平均進捗 -->
      <div class="p-6 transition-all duration-300 transform border shadow-lg bg-white/70 backdrop-blur-md rounded-2xl hover:shadow-xl border-white/20 hover:scale-105">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
              <ChartBarIcon class="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-slate-500">平均進捗</p>
            <p class="text-xl font-bold md:text-2xl text-slate-900">{{ averageProgress }}%</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed } from 'vue';
import { BookOpenIcon, CheckBadgeIcon, ChartBarIcon } from '@heroicons/vue/24/solid';

// ========================================
// 内部インポート
// ========================================
// コンポーザブル
import { useLearningData } from '@/composables/useLearningData';

// ========================================
// Props定義
// ========================================
const props = defineProps({
  learningContents: Array,
});

// ========================================
// 初期設定
// ========================================
const { learningContents } = useLearningData();

// ========================================
// 算出プロパティ
// ========================================
// 学習内容の進捗計算
const averageProgress = computed(() => {
  // 学習内容がない場合は平均進捗を0とする
  if (props.learningContents.length === 0) return 0;
  const total = props.learningContents.reduce((sum, content) => sum + content.progress, 0);
  return Math.round(total / props.learningContents.length);
});

// 全ての学習内容の完了セクション数を合計
const totalCompletedSections = computed(() => {
  return props.learningContents.reduce((sum, content) => sum + content.completed_sections, 0);
});

// 全ての学習内容の総セクション数を合計
const totalSections = computed(() => {
  return props.learningContents.reduce((sum, content) => sum + (content.total_sections || 0), 0);
});
</script>
