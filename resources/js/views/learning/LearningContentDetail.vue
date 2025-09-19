<template>
  <!-- 学習コンテンツ詳細コンポーネント -->
  <DetailLayout>
    <template #breadcrumb>
      <nav class="flex items-center text-sm text-slate-500">
        <router-link to="/dashboard" class="flex items-center font-medium text-violet-600 hover:text-violet-800 hover:underline">
          <ArrowLeftIcon class="w-4 h-4 mr-1" />
          ダッシュボード
        </router-link>
        <span class="mx-2">/</span>
        <span>{{ learningContent ? learningContent.title : '' }}</span>
      </nav>
    </template>

    <template #section-header>
      <h2 class="mb-2 text-2xl font-bold text-slate-800">{{ learningContent ? learningContent.title : '' }}</h2>
      <div v-if="learningContent" class="text-sm text-slate-600">
        <!-- 技術とステータス情報 -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-1">
            <span class="text-xs font-medium md:text-sm">技術:</span>
            <img v-if="displayTechnology.icon" :src="displayTechnology.icon" :alt="displayTechnology.name" class="w-5 h-5 mr-1" />
            <span class="text-xs font-medium md:text-sm">{{ displayTechnology.name }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <span class="text-xs font-medium md:text-sm">ステータス:</span>
            <div class="flex items-center text-xs font-medium md:text-sm" :class="statusDisplay.class">
              <component :is="statusDisplay.icon" class="w-5 h-5 mr-1" />
              {{ statusDisplay.text }}
            </div>
          </div>
        </div>
        <div class="flex items-center mt-2 space-x-4">
          <span class="text-xs font-medium md:text-sm">作成日: {{ formatDate(learningContent.created_at) }}</span>
          <span class="text-xs font-medium md:text-sm">最終学習日: {{ learningContent.latestSessionUpdatedAt ? formatDate(learningContent.latestSessionUpdatedAt) : '-' }}</span>
        </div>
      </div>
    </template>

    <!-- ローディング中の表示 -->
    <div v-if="loading" class="py-10 text-center">
      <p class="text-slate-500">データを読み込んでいます...</p>
    </div>
    <div v-else-if="learningContent">
      <!-- 説明セクション -->
      <div class="mb-6">
        <h3 class="mb-2 text-lg font-semibold text-slate-800">説明</h3>
        <p class="text-slate-600">{{ learningContent.description }}</p>
      </div>

      <!-- 進捗表示セクション -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-slate-700">進捗</span>
          <span class="text-sm font-semibold text-transparent bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text">{{ learningContent.progress }}%</span>
        </div>
        <div class="w-full h-3 rounded-full bg-slate-200">
          <div class="h-3 transition-all duration-500 rounded-full shadow-sm bg-gradient-to-r from-violet-500 to-emerald-500" :style="{ width: learningContent.progress + '%' }"></div>
        </div>
        <div class="flex items-center justify-between mt-2 text-sm text-slate-600">
          <span>{{ learningContent.completed_sections }}/{{ learningContent.total_sections }} セクション完了</span>
          <span class="flex items-center">
            <ClockIcon class="w-4 h-4 mr-1 text-slate-400" />
            総学習時間: {{ formatMinutes(learningContent.totalStudyMinutes) }}
          </span>
        </div>
      </div>

      <!-- セクション一覧 -->
      <div>
        <h3 class="mb-2 text-lg font-semibold text-slate-800">セクション一覧</h3>

        <!-- 完了状態切り替えのヒント（セクション一覧の直下） -->
        <p class="flex items-center mb-4 text-sm text-slate-500">
          <LightBulbIcon class="w-5 h-5 mr-2 text-yellow-500" />
          チェックマークをクリックすると完了状態を切り替えられます。
        </p>

        <div v-if="contentSections.length > 0">
          <ul class="space-y-3">
            <li v-for="section in paginatedContentSections" :key="section.id" class="flex items-center justify-between p-4 transition-all duration-200 bg-white border rounded-lg shadow-sm hover:shadow-md hover:border-violet-300">
              <div class="flex items-center flex-1">
                <!-- チェックボックス -->
                <button
                  @click="handleToggleComplete(section, $event)"
                  class="relative p-1.5 mr-3 transition-all duration-200 rounded-full hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  :title="normalizeStatus(section.status) === 'completed' ? 'クリックで未完了にする' : 'クリックで完了にする'"
                >
                  <transition name="check" mode="out-in">
                    <CheckCircleIconSolid v-if="normalizeStatus(section.status) === 'completed'" key="completed" class="w-6 h-6 text-emerald-500 hover:text-emerald-600" />
                    <CheckCircleIconOutline v-else key="incomplete" class="w-6 h-6 text-gray-400 transition-colors duration-200 hover:text-violet-600" />
                  </transition>
                </button>

                <!-- セクション情報（クリックで詳細へ） -->
                <div @click="goToSectionRecords(section.id)" class="flex items-center flex-1 cursor-pointer">
                  <span class="font-medium text-slate-800" :class="{ 'line-through text-gray-500': normalizeStatus(section.status) === 'completed' }"> {{ section.order }}. {{ section.title }} </span>
                  <span class="ml-2 text-sm text-slate-500"> ({{ normalizeStatus(section.status) === 'completed' ? '完了' : '学習中' }}) </span>
                </div>
              </div>

              <!-- 記録件数 -->
              <div class="ml-4 text-sm text-slate-500">[{{ getRecordCountForSection(section.id) }}件の記録]</div>
            </li>
          </ul>
          <Pagination :total-items="contentSections.length" :items-per-page="sectionItemsPerPage" :current-page="sectionCurrentPage" @update:currentPage="sectionCurrentPage = $event" />
        </div>

        <div v-else class="py-10 text-center text-slate-500">
          <p>この学習コンテンツには、まだセクションが登録されていません。</p>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-slate-500">
      <p>学習コンテンツが見つかりません。</p>
    </div>

    <template #actions>
      <BackButton to="/dashboard" />
      <BaseButton variant="info" size="md" :left-icon="ChartBarIcon" @click="goToProgressDetails"> 個別レポート </BaseButton>
      <BaseButton variant="primary" size="md" :left-icon="PencilIcon" @click="router.push(`/learning/${learningContent.id}/edit`)" v-if="learningContent"> 内容を編集 </BaseButton>
    </template>
  </DetailLayout>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PlayCircleIcon, DocumentIcon, PencilIcon, ClockIcon, ArrowLeftIcon, ChartBarIcon, CheckCircleIcon as CheckCircleIconSolid, LightBulbIcon } from '@heroicons/vue/24/solid';
import { CheckCircleIcon as CheckCircleIconOutline } from '@heroicons/vue/24/outline';

// ========================================
// 内部インポート
// ========================================
// コンポーザブル
import { useLearningData } from '../../composables/useLearningData';
import { useSections } from '../../composables/learning/useSections';
import { useSectionStore } from '@/stores/sections';

// Piniaストア
import { useMasterDataStore } from '@/stores/masterData';

// コンポーネント
import BaseButton from '../../components/common/BaseButton.vue';
import DetailLayout from '../../layouts/DetailLayout.vue';
import BackButton from '../../components/common/buttons/BackButton.vue';
import Pagination from '../../components/common/Pagination.vue';

// ========================================
// ユーティリティ関数（純粋関数）
// ========================================
// 日付文字列を整形するヘルパー関数
const formatDate = (dateString) => {
  if (!dateString || dateString === 'N/A') return 'N/A';
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('ja-JP', options);
};

// 分を「X時間Y分」形式に整形するヘルパー関数
const formatMinutes = (totalMinutes) => {
  if (totalMinutes === 0) return '0分';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  let result = '';
  if (hours > 0) {
    result += `${hours}時間 `;
  }
  if (minutes > 0) {
    result += `${minutes}分`;
  }
  return result.trim();
};

// ========================================
// 初期設定
// ========================================
const route = useRoute();
const router = useRouter();

// コンポーザブル実行
const { learningContents, learningContentsRaw, getRecordCountForSection, technologies, fetchContents, loading } = useLearningData();
const { sections, updateSectionStatus, normalizeStatus, toggleSectionComplete } = useSections();
const sectionStore = useSectionStore();

// ========================================
// 状態管理
// ========================================
// ページネーション
const sectionCurrentPage = ref(1);
const sectionItemsPerPage = 10;

// ========================================
// 算出プロパティ
// ========================================
// ルートパラメータから学習コンテンツIDを取得
const learningContentId = computed(() => parseInt(route.params.id, 10));

// 算出プロパティで現在の学習コンテンツ情報を取得
const learningContent = computed(() => {
  const content = learningContents.value.find((c) => c.id === learningContentId.value);
  if (!content) return null;

  const rawContent = learningContentsRaw.value.find((c) => c.id === learningContentId.value);
  return {
    ...content,
    created_at: rawContent ? rawContent.created_at : 'N/A',
    updated_at: rawContent ? rawContent.updated_at : 'N/A',
    totalStudyMinutes: content.totalStudyMinutes,
  };
});

// 学習コンテンツのステータスに応じた表示テキストとアイコンを算出
const statusDisplay = computed(() => {
  if (!learningContent.value) return { text: '', class: '', icon: null };
  switch (learningContent.value.status) {
    case 'completed':
      return { text: '完了済', class: 'text-emerald-600', icon: CheckCircleIconSolid };
    case 'in_progress':
      return { text: '学習中', class: 'text-blue-600', icon: PlayCircleIcon };
    case 'not_started':
      return { text: '未着手', class: 'text-slate-500', icon: DocumentIcon };
    default:
      return { text: learningContent.value.status, class: 'text-slate-500', icon: DocumentIcon };
  }
});

// 現在の学習コンテンツに紐づくセクションをフィルタリングし、並び順でソート
const contentSections = computed(() => {
  if (!learningContent.value) return [];
  return sectionStore.sections.filter((s) => s.learning_content_id === learningContent.value.id).sort((a, b) => a.order - b.order);
});

// ページネーションされたセクションリスト
const paginatedContentSections = computed(() => {
  const startIndex = (sectionCurrentPage.value - 1) * sectionItemsPerPage;
  const endIndex = startIndex + sectionItemsPerPage;
  return contentSections.value.slice(startIndex, endIndex);
});

// 技術アイコンと名前を表示するための算出プロパティ
const displayTechnology = computed(() => {
  if (!learningContent.value) return { name: '不明', icon: '' };
  const tech = technologies.value.find((t) => t.id === learningContent.value.technology_id);
  return tech || { name: '不明', icon: '' };
});

// ========================================
// ライフサイクル
// ========================================
onMounted(async () => {
  // データが読み込まれていない場合は先に読み込む
  if (learningContents.value.length === 0) {
    await fetchContents();
  }
  sectionStore.fetchSections(learningContentId.value);
});

// ========================================
// メソッド
// ========================================
// イベントハンドラ
// セクション完了状態の切り替え処理
const handleToggleComplete = async (section, event) => {
  event.stopPropagation();
  const newStatus = toggleSectionComplete(section);
  await updateSectionStatus(section.id, newStatus);
  // Update learning content stats after section status change
  const learningContent = learningContents.value.find((c) => c.id === learningContentId.value);
  if (learningContent) {
    learningContent.completed_sections = contentSections.value.filter((s) => s.status === 'completed').length;
  }
};

// セクションクリック時にそのセクションの学習記録一覧ページへ遷移
const goToSectionRecords = (sectionId) => {
  router.push(`/learning/${learningContentId.value}/section/${sectionId}`);
};

// 個別レポートページへの遷移処理
const goToProgressDetails = () => {
  router.push(`/learning/${learningContentId.value}/progress`);
};
</script>

<style scoped>
.check-enter-active,
.check-leave-active {
  transition: all 0.2s ease;
}
.check-enter-from {
  transform: scale(0.8);
  opacity: 0;
}
.check-leave-to {
  transform: scale(1.2);
  opacity: 0;
}
</style>
