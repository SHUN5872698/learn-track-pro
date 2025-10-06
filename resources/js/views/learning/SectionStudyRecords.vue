<template>
  <!-- 学習記録一覧コンポーネント -->
  <div v-if="isLoading" class="py-10 text-center">
    <LoadingSpinner size="lg" message="データを読み込んでいます..." />
  </div>
  <DetailLayout v-else>
    <template #breadcrumb>
      <nav class="flex items-center text-sm text-slate-500">
        <router-link v-if="learningContent" :to="`/learning/${learningContent.id}`" class="flex items-center font-medium text-violet-600 hover:text-violet-800 hover:underline">
          <ArrowLeftIcon class="w-4 h-4 mr-1" />
          {{ learningContent.title }}
        </router-link>
        <span v-if="learningContent" class="mx-2">/</span>
        <span v-if="section">{{ section.title }}の学習記録</span>
      </nav>
    </template>

    <!-- セクションヘッダー -->
    <template #section-header>
      <h2 class="mb-2 text-2xl font-bold text-slate-800">{{ section ? section.title : '' }}</h2>
      <div v-if="learningContent" class="text-slate-600">
        <div class="flex items-center space-x-4 text-xs font-medium md:text-sm">
          <div class="flex items-center space-x-1">
            <span>合計学習時間: </span>
            <span>{{ totalStudyTime }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <span>記録件数: </span>
            <span>{{ sectionRecords.length }} 件</span>
          </div>
        </div>
      </div>
    </template>
    <div v-if="section && learningContent">
      <!-- 学習記録一覧 -->
      <div>
        <h3 class="mb-4 text-lg font-semibold text-slate-800">学習記録一覧</h3>
        <div v-if="paginatedRecords.length > 0" class="space-y-4">
          <LearningRecordCard v-for="record in paginatedRecords" :key="record.id" :record="record" @edit="router.push(`/learning-contents/${learningContentId}/sessions/${record.id}/edit`)" @delete="openDeleteModal(record)"> </LearningRecordCard>
          <Pagination :total-items="sectionRecords.length" :items-per-page="recordItemsPerPage" :current-page="recordCurrentPage" @update:currentPage="recordCurrentPage = $event" />
        </div>
        <div v-else class="py-10 text-center text-slate-500">
          <p>このセクションの学習記録はまだありません。</p>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-slate-500">
      <p>セクションが見つかりません。</p>
    </div>

    <template #actions>
      <BackButton v-if="learningContent" :to="`/learning/${learningContent.id}`" />
      <BaseButton v-if="learningContent && section" variant="primary" :left-icon="PlusCircleIcon" @click="goToRecordForm">このセクションに記録を追加</BaseButton>
    </template>

    <Teleport to="#app">
      <DeleteRecordConfirmModal :is-open="isModalOpen" :record="recordToDelete" @confirm="confirmDelete" @cancel="isModalOpen = false" />
    </Teleport>
  </DetailLayout>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PlusCircleIcon, ArrowLeftIcon } from '@heroicons/vue/24/solid';

// ========================================
// 内部インポート
// ========================================
// Piniaストア
import { useAuthStore } from '@/stores/auth';
import { useLearningSessionStore } from '@/stores/learningSession';
import { useSectionStore } from '@/stores/sections';

// コンポーザブル
import { useLearningData } from '@/composables/useLearningData';
import { useLoading } from '@/composables/ui/useLoading';

// コンポーネント
import DetailLayout from '@/layouts/DetailLayout.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import BackButton from '@/components/common/buttons/BackButton.vue';
import LearningRecordCard from '@/components/learning/LearningRecordCard.vue';
import Pagination from '@/components/common/Pagination.vue';
import DeleteRecordConfirmModal from '@/components/learning/DeleteRecordConfirmModal.vue';

// ========================================
// ユーティリティ関数（純粋関数）
// ========================================
import { formatDateTime, formatMinutes } from '@/utils/dateFormatters';

// ========================================
// 初期設定
// ========================================
// ルーター・ルート
const route = useRoute();
const router = useRouter();

// コンポーザブル
const { learningContents, sections, deleteStudySession, fetchContents } = useLearningData();
const { isLoading, withLoading } = useLoading();
const authStore = useAuthStore();
const sectionStore = useSectionStore();
const sessionStore = useLearningSessionStore();

// ========================================
// 状態管理
// ========================================
// 削除モーダルの状態管理
const isModalOpen = ref(false);
const recordToDelete = ref(null);

// ページネーション
const recordCurrentPage = ref(1);
const recordItemsPerPage = 5;

// ========================================
// 算出プロパティ
// ========================================
// ルートパラメータから学習コンテンツIDとセクションIDを取得
const learningContentId = computed(() => parseInt(route.params.id, 10));
const sectionId = computed(() => parseInt(route.params.sectionId, 10));

// 算出プロパティで現在の学習コンテンツとセクション情報を取得
const learningContent = computed(() => learningContents.value.find((c) => c.id === learningContentId.value));
const section = computed(() => sections.value.find((s) => s.id === sectionId.value));

// 現在のセクションに紐づく学習記録をフィルタリングし、新しい順にソート
const sectionRecords = computed(() => {
  return sessionStore.sessionsBySectionId(sectionId.value).sort((a, b) => new Date(b.studied_at) - new Date(a.studied_at));
});

// ページネーションされた学習記録リスト
const paginatedRecords = computed(() => {
  const startIndex = (recordCurrentPage.value - 1) * recordItemsPerPage;
  const endIndex = startIndex + recordItemsPerPage;
  return sectionRecords.value.slice(startIndex, endIndex);
});

// セクションの総学習時間を計算
const totalStudyTime = computed(() => {
  const totalMinutes = sectionRecords.value.reduce((sum, record) => sum + record.study_minutes, 0);
  return formatMinutes(totalMinutes);
});

// ========================================
// ライフサイクル
// ========================================
onMounted(async () => {
  // ログアウト中は処理をスキップ
  if (!authStore.isLoggedIn) {
    return;
  }
  await withLoading('section-records-init', async () => {
    // 学習コンテンツを取得
    if (learningContents.value.length === 0) {
      await fetchContents();
    }
    // 並列実行でパフォーマンス向上
    await Promise.all([
      // セクションを取得
      sectionStore.fetchSections(learningContentId.value),
      // 学習記録を取得
      sessionStore.fetchLearningSessions({
        section_id: sectionId.value,
        all: 'true', // 全件取得フラグ
      }),
    ]);
  });
});

// ========================================
// メソッド
// ========================================
// イベントハンドラ
// 学習記録フォームページへ遷移（セクションIDをクエリパラメータで渡す）
const goToRecordForm = () => {
  router.push({
    path: `/learning-contents/${learningContentId.value}/record`,
    query: { section_id: sectionId.value },
  });
};

// 削除モーダルを開く
const openDeleteModal = (record) => {
  recordToDelete.value = record;
  isModalOpen.value = true;
};

// 削除確認時の処理
const confirmDelete = async () => {
  if (recordToDelete.value) {
    await deleteStudySession(recordToDelete.value.id);
  }
  isModalOpen.value = false;
  recordToDelete.value = null;
};
</script>
