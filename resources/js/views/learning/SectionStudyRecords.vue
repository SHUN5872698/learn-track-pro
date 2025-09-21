<template>
  <!-- 学習記録一覧コンポーネント -->
  <DetailLayout>
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

    <template #section-header>
      <h2 class="mb-2 text-2xl font-bold text-slate-800">{{ section ? section.title : '' }}</h2>
      <div class="flex space-x-6 text-slate-600">
        <span
          >合計学習時間: <span class="font-semibold text-violet-700">{{ totalStudyTime }}</span></span
        >
        <span
          >記録件数: <span class="font-semibold text-violet-700">{{ sectionRecords.length }} 件</span></span
        >
      </div>
    </template>
    <!-- ローディング中の表示 -->
    <div v-if="loading" class="py-10 text-center">
      <p class="text-slate-500">データを読み込んでいます...</p>
    </div>

    <div v-else-if="section && learningContent">
      <!-- 学習記録一覧 -->
      <div>
        <h3 class="mb-4 text-lg font-semibold text-slate-800">学習記録一覧</h3>
        <div v-if="paginatedRecords.length > 0" class="space-y-4">
          <div v-for="record in paginatedRecords" :key="record.id" class="p-5 bg-white border rounded-lg shadow-sm">
            <div class="flex items-start justify-between">
              <div>
                <p class="font-semibold text-slate-800">{{ formatDateTime(record.studied_at) }}</p>
                <p class="text-sm text-slate-600">学習時間: {{ formatMinutes(record.study_minutes) }}</p>
                <div class="flex items-center mt-1">
                  <span class="mr-1 text-sm text-slate-600">調子:</span>
                  <StarIcon v-for="r in 5" :key="r" class="w-4 h-4" :class="r <= record.mood_rating ? 'text-yellow-400' : 'text-gray-300'" />
                </div>
                <p v-if="record.memo" class="mt-2 text-sm text-slate-700">メモ: {{ record.memo }}</p>
              </div>
              <div class="flex space-x-2">
                <BaseButton variant="icon-primary" size="md" :left-icon="PencilIcon" :icon-only="true" @click="router.push(`/learning-contents/${learningContentId}/sessions/${record.id}/edit`)"> 記録を編集 </BaseButton>
                <DeleteButton variant="icon-danger" size="sm" @click="openDeleteModal(record)"> 記録を削除 </DeleteButton>
              </div>
            </div>
          </div>
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

    <!-- 削除確認モーダル -->
    <ConfirmModal :is-open="isModalOpen" title="学習記録を削除しますか？" confirm-button-text="削除" @confirm="confirmDelete" @cancel="isModalOpen = false">
      <template #content>
        <div v-if="recordToDelete" class="p-4 mb-6 text-sm border rounded-lg bg-slate-50 border-slate-200">
          <p><span class="font-semibold">日時:</span> {{ formatDateTime(recordToDelete.studied_at) }}</p>
          <p><span class="font-semibold">学習時間:</span> {{ formatMinutes(recordToDelete.study_minutes) }}</p>
          <p v-if="recordToDelete.memo" class="mt-2"><span class="font-semibold">メモ:</span> {{ recordToDelete.memo }}</p>
        </div>
        <p class="mb-6 text-slate-600">この操作は元に戻せません。</p>
      </template>
    </ConfirmModal>
  </DetailLayout>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { StarIcon, PencilIcon, PlusCircleIcon, ArrowLeftIcon } from '@heroicons/vue/24/solid';

// ========================================
// 内部インポート
// ========================================
import { useLearningData } from '../../composables/useLearningData';
import { useLearningSessionStore } from '@/stores/learningSession';
import { useSectionStore } from '@/stores/sections';

// コンポーネント
import DetailLayout from '../../layouts/DetailLayout.vue';
import ConfirmModal from '../../components/common/ConfirmModal.vue';
import BaseButton from '../../components/common/BaseButton.vue';
import BackButton from '../../components/common/buttons/BackButton.vue';
import DeleteButton from '../../components/common/buttons/DeleteButton.vue';
import Pagination from '../../components/common/Pagination.vue';

// ========================================
// ユーティリティ関数（純粋関数）
// ========================================
import { formatDateTime, formatMinutes } from '../../utils/dateFormatters';

// ========================================
// 初期設定
// ========================================
const route = useRoute();
const router = useRouter();

// ========================================
// コンポーザブルの実行
// ========================================
const { learningContents, sections, deleteStudySession, fetchContents } = useLearningData();
const sectionStore = useSectionStore();
const sessionStore = useLearningSessionStore();

// ========================================
// 状態管理
// ========================================
const loading = ref(true); // ローディング状態
// 削除モーダルの状態管理
const isModalOpen = ref(false);
const recordToDelete = ref(null);

// ページネーション
const recordCurrentPage = ref(1);
const recordItemsPerPage = 10;

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
  loading.value = true;

  // 学習コンテンツを取得
  if (learningContents.value.length === 0) {
    await fetchContents();
  }

  // セクションを取得（重要！）
  await sectionStore.fetchSections(learningContentId.value);

  // 学習記録を取得
  await sessionStore.fetchLearningSessions({
    section_id: sectionId.value,
  });

  loading.value = false;
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
