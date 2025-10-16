<template>
  <!-- 学習ダッシュボードコンポーネント -->
  <DashboardLayout>
    <template #header-title>学習ダッシュボード</template>
    <template #header-action>
      <BaseButton variant="primary" :left-icon="PlusCircleIcon" @click="goToCreatePage" class="ml-auto">学習を追加</BaseButton>
    </template>
    <template #header-description>あなたの学習進捗を管理・追跡します</template>

    <!-- ローディング中の表示 -->
    <div v-if="isLoading" class="py-10 text-center">
      <LoadingSpinner size="lg" message="データを読み込んでいます..." />
    </div>
    <div v-else>
      <!-- 学習統計概要を表示するコンポーネント -->
      <StatsOverview :learningContents="learningContents" />

      <!-- 進行中の学習コンテンツをカード形式で表示するセクション -->
      <div class="mb-6">
        <h3 class="mb-4 text-lg font-semibold md:text-xl text-slate-900">進行中の学習</h3>
        <div v-if="inProgressContents.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          <LearningContentCard v-for="content in inProgressContents" :key="content.id" :content="content" />
        </div>
        <div v-else class="py-8 text-center md:py-10 text-slate-500">
          <p>進行中の学習コンテンツはありません。</p>
        </div>
      </div>

      <!-- 完了した学習コンテンツをカード形式で表示するセクション -->
      <div class="pt-6 mb-6 border-t border-slate-200">
        <h3 class="mb-4 text-lg font-semibold md:text-xl text-slate-900">完了した学習</h3>
        <div v-if="completedContents.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          <LearningContentCard v-for="content in completedContents" :key="content.id" :content="content" />
        </div>
        <div v-else class="py-8 text-center md:py-10 text-slate-500">
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
import { useLoading } from '@/composables/ui/useLoading';

// コンポーネント
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
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
const { learningContents, fetchContents, fetchLearningSessions } = useLearningData();
const { isLoading, withLoading } = useLoading();

// ========================================
// ライフサイクル
// ========================================
onMounted(async () => {
  // withLoadingで非同期処理をラップ
  await withLoading('dashboard-init', async () => {
    // 並列実行でパフォーマンス向上
    await Promise.all([fetchContents(), fetchLearningSessions()]);
  });
});

// ========================================
// 算出プロパティ
// ========================================
// 進行中の学習コンテンツをフィルタリングし、指定された基準でソート
const inProgressContents = computed(() => {
  return learningContents.value
    .filter((content) => content.status === 'in_progress' || content.status === 'not_started')
    .sort((a, b) => {
      // 1. latestSessionUpdatedAtが最新のものを優先
      if (a.latestSessionUpdatedAt && b.latestSessionUpdatedAt) {
        if (new Date(b.latestSessionUpdatedAt).getTime() !== new Date(a.latestSessionUpdatedAt).getTime()) {
          return new Date(b.latestSessionUpdatedAt).getTime() - new Date(a.latestSessionUpdatedAt).getTime();
        }
      } else if (a.latestSessionUpdatedAt) {
        return -1; // aにのみlatestSessionUpdatedAtがある場合、aを優先
      } else if (b.latestSessionUpdatedAt) {
        return 1; // bにのみlatestSessionUpdatedAtがある場合、bを優先
      }

      // 2. statusがin_progressのものを優先
      if (a.status === 'in_progress' && b.status === 'not_started') return -1;
      if (a.status === 'not_started' && b.status === 'in_progress') return 1;

      // 3. statusが同じ場合、updated_atが最新のものを優先
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
});

// 完了した学習コンテンツをフィルタリングし、指定された基準でソート
const completedContents = computed(() => {
  return learningContents.value
    .filter((content) => content.status === 'completed')
    .sort((a, b) => {
      // 1. latestSessionUpdatedAtが最新のものを優先
      if (a.latestSessionUpdatedAt && b.latestSessionUpdatedAt) {
        if (new Date(b.latestSessionUpdatedAt).getTime() !== new Date(a.latestSessionUpdatedAt).getTime()) {
          return new Date(b.latestSessionUpdatedAt).getTime() - new Date(a.latestSessionUpdatedAt).getTime();
        }
      } else if (a.latestSessionUpdatedAt) {
        return -1; // aにのみlatestSessionUpdatedAtがある場合、aを優先
      } else if (b.latestSessionUpdatedAt) {
        return 1; // bにのみlatestSessionUpdatedAtがある場合、bを優先
      }

      // 2. updated_atが最新のものを優先
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
});

// ========================================
// メソッド
// ========================================
// イベントハンドラ
const goToCreatePage = () => {
  router.push('/learning-contents/create');
};
</script>
