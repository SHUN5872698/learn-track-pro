<template>
  <!-- 学習ダッシュボードコンポーネント -->
  <DashboardLayout>
    <template #header-title>学習ダッシュボード</template>
    <template #header-action>
      <BaseButton variant="primary" :left-icon="PlusCircleIcon" @click="goToCreatePage">学習を追加</BaseButton>
    </template>
    <template #header-description>あなたの学習進捗を管理・追跡します</template>

    <div v-if="loading" class="py-10 text-center">
      <p class="text-slate-500">データを読み込んでいます...</p>
    </div>
    <div v-else>
      <!-- 学習統計概要を表示するコンポーネント -->
      <StatsOverview :learningContents="learningContents" />

      <!-- 進行中の学習コンテンツをカード形式で表示するセクション -->
      <div class="mb-6">
        <h3 class="mb-4 text-xl font-semibold text-slate-900">進行中の学習</h3>
        <div v-if="inProgressContents.length > 0" class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <LearningContentCard v-for="content in inProgressContents" :key="content.id" :content="content" />
        </div>
        <div v-else class="py-10 text-center text-slate-500">
          <p>進行中の学習コンテンツはありません。</p>
        </div>
      </div>

      <!-- 完了した学習コンテンツをカード形式で表示するセクション -->
      <div class="pt-6 mb-6 border-t border-slate-200">
        <h3 class="mb-4 text-xl font-semibold text-slate-900">完了した学習</h3>
        <div v-if="completedContents.length > 0" class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <LearningContentCard v-for="content in completedContents" :key="content.id" :content="content" />
        </div>
        <div v-else class="py-10 text-center text-slate-500">
          <p>完了した学習コンテンツはありません。</p>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { PlusCircleIcon } from '@heroicons/vue/24/solid';

// ========================================
// 内部インポート
// ========================================
// コンポーザブル
import { useLearningData } from '@/composables/useLearningData';

// コンポーネント
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import LearningContentCard from '@/components/learning/LearningContentCard.vue';
import StatsOverview from '@/components/learning/StatsOverview.vue';

// ========================================
// 初期設定
// ========================================
const router = useRouter();

// ========================================
// コンポーザブル実行
// ========================================
const { learningContents, fetchContents, loading, fetchLearningSessions } = useLearningData();

// ========================================
// ライフサイクル
// ========================================
onMounted(async () => {
  await fetchContents();
  await fetchLearningSessions();
});

// ========================================
// 算出プロパティ
// ========================================
// 進行中の学習コンテンツをフィルタリング
const inProgressContents = computed(() => {
  return learningContents.value.filter((content) => content.status === 'in_progress' || content.status === 'not_started');
});

// 完了した学習コンテンツをフィルタリング
const completedContents = computed(() => {
  return learningContents.value.filter((content) => content.status === 'completed');
});

// ========================================
// メソッド
// ========================================
// イベントハンドラ
const goToCreatePage = () => {
  router.push('/learning-contents/create');
};
</script>
