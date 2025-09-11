<template>
  <div class="mb-8">
    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <!-- 学習中コース -->
      <div class="p-6 transition-all duration-300 transform border shadow-lg bg-white/70 backdrop-blur-md rounded-2xl hover:shadow-xl border-white/20 hover:scale-105">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-violet-100 to-violet-200 rounded-xl">
              <BookOpenIcon class="text-lg text-violet-600" />
            </div>
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-slate-500">学習中コース</div>
            <div class="text-2xl font-bold text-slate-900">{{ learningContents.filter(content => content.status !== 'completed').length }}</div>
          </div>
        </div>
      </div>

      <!-- 完了セクション -->
      <div class="p-6 transition-all duration-300 transform border shadow-lg bg-white/70 backdrop-blur-md rounded-2xl hover:shadow-xl border-white/20 hover:scale-105">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl">
              <CheckBadgeIcon class="text-lg text-emerald-600" />
            </div>
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-500">完了セクション</div>
            <div class="text-2xl font-bold text-gray-900">{{ totalCompletedSections }}/{{ totalSections }}</div>
          </div>
        </div>
      </div>

      <!-- 平均進捗 -->
      <div class="p-6 transition-all duration-300 transform border shadow-lg bg-white/70 backdrop-blur-md rounded-2xl hover:shadow-xl border-white/20 hover:scale-105">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
              <ChartBarIcon class="text-lg text-blue-600" />
            </div>
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-500">平均進捗</div>
            <div class="text-2xl font-bold text-gray-900">{{ averageProgress }}%</div>
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
import { useLearningData } from '../../composables/useLearningData';

// ========================================
// 初期設定・コンポーザブル
// ========================================
const props = defineProps({
  learningContents: Array,
});

const { learningContents } = useLearningData();

// ========================================
// 算出プロパティ
// ========================================
// 学習コンテンツの進捗計算
const averageProgress = computed(() => {
  // 学習コンテンツがない場合は平均進捗を0とする
  if (props.learningContents.length === 0) return 0;
  const total = props.learningContents.reduce((sum, content) => sum + content.progress, 0);
  return Math.round(total / props.learningContents.length);
});

// 全ての学習コンテンツの完了セクション数を合計
const totalCompletedSections = computed(() => {
  return props.learningContents.reduce((sum, content) => sum + content.completedSections, 0);
});

// 全ての学習コンテンツの総セクション数を合計
const totalSections = computed(() => {
  return props.learningContents.reduce((sum, content) => sum + content.totalSections, 0);
});
</script>
