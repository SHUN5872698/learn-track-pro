<template>
  <!-- 学習内容編集ページのメインコンテナ -->
  <DetailLayout title="学習内容を編集" description="登録済みの学習内容を更新します。">
    <!-- ローディング中の表示 -->
    <div v-if="loading" class="py-10 text-center">
      <p class="text-slate-500">データを読み込んでいます...</p>
    </div>
    <div v-else>
      <!-- ウィザードのステップ表示コンポーネント -->
      <WizardStepIndicator :current-step="currentStep" :step-names="stepNames" />

      <!-- バリデーションエラーメッセージの表示 -->
      <div v-if="validationErrors.length" class="p-4 mb-6 text-red-800 bg-red-100 border-l-4 border-red-500 rounded-md">
        <h3 class="font-bold">入力エラー</h3>
        <ul class="mt-2 ml-2 list-disc list-inside">
          <li v-for="error in validationErrors" :key="error">{{ error }}</li>
        </ul>
      </div>

      <!-- フォーム本体 -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Step 1: 基本情報入力セクション -->
        <div v-if="currentStep === 1" class="space-y-6 animate-fade-in">
          <!-- 技術選択コンポーネント -->
          <TechnologySelector v-model="form.technology_id" :technologies="technologies" :has-error="showTechnologyBorder" @update:modelValue="technologyModified = true" />
          <div>
            <label for="title" class="block text-sm font-medium text-slate-700">タイトル<span class="pl-1 text-red-500">*</span></label>
            <input
              type="text"
              id="title"
              v-model="form.title"
              placeholder="例: Laravel完全マスター"
              class="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm appearance-none focus:outline-none sm:text-sm"
              @input="titleModified = true"
              :class="[showTitleBorder ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-violet-500 focus:ring-violet-500']"
            />
          </div>

          <!-- 内容入力フィールド -->
          <div>
            <label for="description" class="block text-sm font-medium text-slate-700">概要</label>
            <textarea
              id="description"
              rows="4"
              v-model="form.description"
              placeholder="学習内容の詳細を自由に入力してください。"
              class="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm appearance-none focus:outline-none sm:text-sm"
              @input="descriptionModified = true"
              :class="[showDescriptionBorder ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-violet-500 focus:ring-violet-500']"
            ></textarea>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">ステータス</label>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input type="radio" v-model="form.status" value="not_started" :class="['w-4 h-4 border-gray-300 focus:ring-violet-500', form.status === 'not_started' ? 'text-slate-500' : 'text-gray-700']" />
                <span :class="['ml-2 text-sm font-medium', form.status === 'not_started' ? 'text-slate-500' : 'text-gray-700']">未着手</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="form.status" value="in_progress" :class="['w-4 h-4 border-gray-300 focus:ring-violet-500', form.status === 'in_progress' ? 'text-blue-600' : 'text-gray-700']" />
                <span :class="['ml-2 text-sm font-medium', form.status === 'in_progress' ? 'text-blue-600' : 'text-gray-700']">学習中</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="form.status" value="completed" :class="['w-4 h-4 border-gray-300 focus:ring-violet-500', form.status === 'completed' ? 'text-emerald-600' : 'text-gray-700']" />
                <span :class="['ml-2 text-sm font-medium', form.status === 'completed' ? 'text-emerald-600' : 'text-gray-700']">完了</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Step 2: セクション設定セクション -->
        <div v-if="currentStep === 2">
          <!-- セクションリスト編集コンポーネント -->
          <SectionListEditor v-model="form.sections" :is-edit-mode="true" :original-sections="originalData.sections" @request-delete="handleSectionDeleteRequest" :show-hint="false" :has-error="validationErrors.some((error) => error.includes('セクション'))" />
        </div>

        <!-- Step 3: 確認画面セクション -->
        <div v-if="currentStep === 3" class="space-y-6 animate-fade-in">
          <!-- 基本情報の確認表示 -->
          <div class="p-6 border rounded-lg bg-slate-50">
            <h3 class="mb-4 text-lg font-semibold border-b text-slate-800">基本情報</h3>
            <div v-if="basicInfoHasChanged" class="space-y-2">
              <p>
                <span class="font-semibold">技術:</span>
                <span v-if="originalData.technology_id !== form.technology_id" class="inline-flex items-center ml-2">
                  <span class="text-gray-400 line-through">{{ getTechnologyNameById(originalData.technology_id) }}</span>
                  <ArrowRightIcon class="w-4 h-4 mx-1" />
                  <span class="font-bold text-blue-600">{{ getTechnologyNameById(form.technology_id) }}</span>
                </span>
                <span v-else class="ml-2">{{ getTechnologyNameById(form.technology_id) }}</span>
              </p>
              <p>
                <span class="font-semibold">タイトル:</span>
                <span v-if="originalData.title !== form.title" class="inline-flex items-center ml-2">
                  <span class="text-gray-400 line-through">{{ originalData.title }}</span>
                  <ArrowRightIcon class="w-4 h-4 mx-1" />
                  <span class="font-bold text-blue-600">{{ form.title }}</span>
                </span>
                <span v-else class="ml-2">{{ form.title }}</span>
              </p>
              <p>
                <span class="font-semibold">説明:</span>
                <span v-if="originalData.description !== form.description" class="inline-flex items-center ml-2">
                  <span class="text-gray-400 line-through">{{ originalData.description || '未入力' }}</span>
                  <ArrowRightIcon class="w-4 h-4 mx-1" />
                  <span class="font-bold text-blue-600">{{ form.description || '未入力' }}</span>
                </span>
                <span v-else class="ml-2">{{ form.description || '未入力' }}</span>
              </p>
              <p>
                <span class="font-semibold">ステータス:</span>
                <span v-if="originalData.status !== form.status" class="inline-flex items-center ml-2">
                  <span class="text-gray-400 line-through">{{ statusMap[originalData.status] }}</span>
                  <ArrowRightIcon class="w-4 h-4 mx-1" />
                  <span class="font-bold text-blue-600">{{ statusMap[form.status] }}</span>
                </span>
                <span v-else class="ml-2">{{ statusMap[form.status] }}</span>
              </p>
            </div>
            <div v-else class="text-slate-500">変更点はありません。</div>
          </div>
          <!-- セクション情報の確認表示 -->
          <div class="p-6 border rounded-lg bg-slate-50">
            <h3 class="mb-4 text-lg font-semibold border-b text-slate-800">セクション</h3>
            <div v-if="!sectionsHaveChanged" class="text-slate-500">変更点はありません。</div>
            <div v-else>
              <ul class="space-y-1 list-decimal list-inside">
                <li v-for="change in sectionChanges" :key="change.id">
                  <span v-if="change.status === 'added'" class="font-bold text-emerald-600"> + {{ change.title }} (追加) </span>
                  <span v-if="change.status === 'existing'">
                    <span v-if="change.titleChanged" class="inline-flex items-center">
                      <span class="text-gray-400 line-through">{{ change.originalTitle }}</span>
                      <ArrowRightIcon class="w-4 h-4 mx-1" />
                      <span class="font-bold text-blue-600">{{ change.title }}</span>
                    </span>
                    <span v-else>
                      {{ change.title }}
                    </span>
                    <span v-if="change.orderChanged" class="ml-2 text-xs font-semibold text-violet-600">(順序変更)</span>
                  </span>
                </li>
              </ul>
              <ul v-if="deletedSections.length > 0" class="mt-2 space-y-1 list-inside">
                <li v-for="section in deletedSections" :key="section.id" class="text-red-600 line-through">- {{ section.title }} (削除)</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- ウィザードのナビゲーションボタン -->
        <WizardNavigation
          :current-step="currentStep"
          :total-steps="stepNames.length"
          :show-back="currentStep > 1"
          :show-next="currentStep < stepNames.length"
          :show-submit="currentStep === stepNames.length"
          submit-text="更新する"
          @cancel="handleCancel"
          @back="prevStep"
          @next="handleNext"
          @submit="handleSubmit"
        />
      </form>
    </div>
  </DetailLayout>
  <!-- 未保存の変更がある場合の確認モーダル -->
  <ConfirmModal :is-open="isUnsavedModalOpen" title="編集内容が保存されていません" message="編集した内容を破棄してもよろしいですか？" confirm-button-text="破棄" confirm-button-variant="danger" :show-item-detail="false" @confirm="router.back()" @cancel="isUnsavedModalOpen = false" />
  <!-- セクション削除確認モーダル -->
  <ConfirmModal :is-open="isDeleteModalOpen" title="セクションを削除しますか？" message="このセクションに関連する学習記録もすべて削除されます。この操作は取り消せません。" @confirm="confirmSectionDelete" @cancel="cancelSectionDelete" />
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowRightIcon } from '@heroicons/vue/24/solid';

// ========================================
// 内部インポート
// ========================================
import { useSectionStore } from '@/stores/sections';

// コンポーザブル
import { useLearningData } from '@/composables/useLearningData';
import { useWizardForm } from '@/composables/useWizardForm';
import { useLearningContentForm } from '@/composables/useLearningContentForm';

// Pinia
import { useLearningContentStore } from '@/stores/learningContent';

// コンポーネント
import DetailLayout from '@/layouts/DetailLayout.vue';
import WizardStepIndicator from '@/components/learning/wizard/WizardStepIndicator.vue';
import TechnologySelector from '@/components/learning/wizard/TechnologySelector.vue';
import SectionListEditor from '@/components/learning/wizard/SectionListEditor.vue';
import WizardNavigation from '@/components/learning/wizard/WizardNavigation.vue';
import ConfirmModal from '@/components/common/ConfirmModal.vue';

// ========================================
// ユーティリティ関数
// ========================================
// LCSアルゴリズム: 順序変更を正確に検出するために使用
function findLCS(arr1, arr2) {
  const m = arr1.length;
  const n = arr2.length;
  const dp = Array(m + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (arr1[i - 1] === arr2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const lcs = [];
  let i = m,
    j = n;
  while (i > 0 && j > 0) {
    if (arr1[i - 1] === arr2[j - 1]) {
      lcs.unshift(arr1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  return lcs;
}

// ========================================
// 初期設定
// ========================================
// ルーター・ルート
const route = useRoute();
const router = useRouter();
const contentId = parseInt(route.params.id, 10);

// コンポーザブル
const contentStore = useLearningContentStore();
const sectionStore = useSectionStore();
const { learningContentsRaw, sections, technologies, updateLearningContent } = useLearningData();
const stepNames = ['基本情報', 'セクション設定', '確認'];
const { currentStep, nextStep, prevStep, validationErrors, validateStep } = useWizardForm(stepNames.length);
const { form, hasUnsavedChanges, validateBasicInfo, validateSections } = useLearningContentForm();

// ========================================
// 状態管理
// ========================================
// 入力状態
const loading = ref(true);
const titleModified = ref(false);
const descriptionModified = ref(false);
const technologyModified = ref(false);

// データ
const originalData = ref(null);
const deletedSections = ref([]);

// UI状態
const isUnsavedModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const sectionToDeleteIndex = ref(null);

// 定数
const statusMap = {
  not_started: '未着手',
  in_progress: '学習中',
  completed: '完了',
};

// ========================================
// 算出プロパティ
// ========================================
// バリデーションエラー表示制御
const showTitleBorder = computed(() => {
  return validationErrors.value.some((error) => error.includes('タイトル')) && !titleModified.value;
});

const showDescriptionBorder = computed(() => {
  return validationErrors.value.some((error) => error.includes('説明')) && !descriptionModified.value;
});

const showTechnologyBorder = computed(() => {
  return validationErrors.value.some((error) => error.includes('技術')) && !technologyModified.value;
});

// 変更検知
const basicInfoHasChanged = computed(() => {
  if (!originalData.value) return false;
  // いずれかのフィールドが変更されていれば確認画面で差分表示する
  return originalData.value.technology_id !== form.technology_id || originalData.value.title !== form.title || originalData.value.description !== form.description || originalData.value.status !== form.status;
});

// セクションに変更があるか判定
const sectionsHaveChanged = computed(() => {
  if (!originalData.value) return false;
  if (deletedSections.value.length > 0) return true;

  // JSON文字列化で順序・内容の完全一致を確認（深い比較の軽量版）
  const originalSectionsString = JSON.stringify(originalData.value.sections.map((s) => ({ id: s.id, title: s.title })));
  const newSectionsString = JSON.stringify(form.sections.map((s) => ({ id: s.id, title: s.title })));

  return originalSectionsString !== newSectionsString;
});

// 各セクションの変更内容を詳細分析
const sectionChanges = computed(() => {
  if (!originalData.value) return [];

  // 両方に存在するIDのみ抽出（追加・削除を除外）
  const originalExistingIds = originalData.value.sections.map((s) => s.id).filter((id) => form.sections.some((fs) => fs.id === id));
  const newExistingIds = form.sections.map((s) => s.id).filter((id) => originalData.value.sections.some((os) => os.id === id));
  // LCSで順序が保たれているIDを特定
  const lcsIds = new Set(findLCS(originalExistingIds, newExistingIds));

  return form.sections.map((section) => {
    const originalSection = originalData.value.sections.find((os) => os.id === section.id);

    // 新規追加セクション
    if (!originalSection) {
      return { id: section.id, status: 'added', title: section.title };
    }

    const titleChanged = originalSection.title !== section.title;
    // LCSに含まれない = 順序が変わった
    const orderChanged = !lcsIds.has(section.id);

    return {
      id: section.id,
      status: 'existing',
      title: section.title,
      originalTitle: originalSection.title,
      titleChanged,
      orderChanged,
    };
  });
});

// ========================================
// ライフサイクル
// ========================================
onMounted(async () => {
  try {
    loading.value = true; // 明示的に設定

    // データが読み込まれていない場合は先に読み込む
    if (learningContentsRaw.value.length === 0) {
      const { fetchContents } = useLearningData();
      await fetchContents();
    }

    // セクションデータも読み込む
    if (sections.value.length === 0) {
      await sectionStore.fetchSections(contentId);
    }

    // データ読み込み後にコンテンツを検索
    const content = learningContentsRaw.value.find((c) => c.id === contentId);
    if (!content) {
      console.error('コンテンツが見つかりません:', contentId);
      router.push('/404');
      return;
    }

    loadContentData();
  } catch (error) {
    console.error('データ読み込みエラー:', error);
    validationErrors.value = ['データの読み込みに失敗しました'];
  } finally {
    loading.value = false;
  }
});
// ========================================
// メソッド
// ========================================
// イベントハンドラ
const handleNext = () => {
  titleModified.value = false;
  descriptionModified.value = false;
  technologyModified.value = false;

  if (currentStep.value === 1) {
    if (validateStep(validateBasicInfo)) nextStep();
  } else if (currentStep.value === 2) {
    if (validateStep(validateSections)) nextStep();
  }
};

const handleSubmit = async () => {
  console.log('【Edit.handleSubmit】開始 - コンテンツID:', contentId);

  try {
    // 基本情報の更新
    const basicInfo = {
      title: form.title,
      description: form.description,
      technology_id: form.technology_id,
      status: form.status,
    };
    await contentStore.updateContent(contentId, basicInfo);

    // セクションデータの送信（index + 1 を使用）
    const sectionPayload = {
      sections: form.sections.map((s, index) => ({
        id: s.id && !s.id.toString().startsWith('new_') ? s.id : null,
        title: s.title,
        order: index + 1,
      })),
      deleted_section_ids: deletedSections.value.map((s) => s.id),
    };

    await sectionStore.bulkUpdateSections(contentId, sectionPayload);

    console.log('【Edit.handleSubmit】更新完了');
    alert('学習内容を更新しました！');
    router.push(`/learning/${contentId}`);
  } catch (error) {
    console.error('【Edit.handleSubmit】エラー:', error);
    validationErrors.value = ['更新中にエラーが発生しました。'];
  }
};

const handleCancel = () => {
  if (hasUnsavedChanges.value) {
    isUnsavedModalOpen.value = true;
  } else {
    router.back();
  }
};

// セクション削除関連
const handleSectionDeleteRequest = (index) => {
  sectionToDeleteIndex.value = index;
  isDeleteModalOpen.value = true;
};
const confirmSectionDelete = () => {
  if (sectionToDeleteIndex.value !== null) {
    deletedSections.value.push(form.sections[sectionToDeleteIndex.value]);
    form.sections.splice(sectionToDeleteIndex.value, 1);
  }
  isDeleteModalOpen.value = false;
  sectionToDeleteIndex.value = null;
};
const cancelSectionDelete = () => {
  isDeleteModalOpen.value = false;
  sectionToDeleteIndex.value = null;
};

// ヘルパー関数
/**
 * 既存の学習コンテンツデータを読み込み、フォームに設定する
 *
 * この関数は2つのデータソースを統合する：
 * 1. learningContentsRaw: 基本情報（タイトル、説明、技術など）
 * 2. sections: セクション情報（各セクションのstatus、completed_atを含む）
 *
 * 統合したデータを：
 * - originalData: 変更前の状態として保持（差分表示用）
 * - form: 編集用フォームデータとして設定
 */
const loadContentData = () => {
  // 学習コンテンツの基本情報を取得
  const content = learningContentsRaw.value.find((c) => c.id === contentId);
  if (content) {
    // このコンテンツに紐づくセクション情報を取得し、
    // status（未着手/学習中/完了）とcompleted_at（完了日時）も含めて整形
    const contentSections = sections.value
      .filter((s) => s.learning_content_id === contentId) // このコンテンツのセクションのみ抽出
      .sort((a, b) => a.order - b.order) // 表示順でソート
      .map((s) => ({
        id: s.id,
        title: s.title,
        order: s.order,
        status: s.status, // セクションの学習状態（DBから取得）
        completed_at: s.completed_at, // セクションの完了日時（DBから取得）
      }));

    // 変更前の状態を保存（確認画面での差分表示に使用）
    originalData.value = {
      ...content,
      sections: contentSections,
    };

    // 編集フォームにデータを設定
    Object.assign(form, {
      technology_id: content.technology_id,
      title: content.title,
      description: content.description || '',
      status: content.status,
      sections: contentSections, // statusとcompleted_atを含むセクション情報
    });
  }
};

const getTechnologyNameById = (id) => {
  const tech = technologies.value.find((t) => t.id === id);
  return tech ? tech.name : '不明';
};
</script>
