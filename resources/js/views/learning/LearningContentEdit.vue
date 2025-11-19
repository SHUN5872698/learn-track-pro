<template>
  <!-- 学習内容編集ページのメインコンポーネント -->
  <div v-if="isLoading" class="py-10 text-center">
    <LoadingSpinner size="lg" message="データを読み込んでいます..." />
  </div>
  <DetailLayout v-else>
    <!-- セクションヘッダー -->
    <template #section-header>
      <h2 class="section-header">学習内容を編集</h2>
      <div class="section-subtext">
        <span>登録済みの学習内容を更新します。</span>
      </div>
    </template>
    <!-- ウィザードのステップ表示コンポーネント -->
    <WizardStepIndicator :current-step="currentStep" :step-names="stepNames" />

    <!-- Vue側のバリデーションエラー -->
    <div v-if="validationErrors.length" class="error-container">
      <h3 class="font-bold">入力エラー</h3>
      <ul class="mt-2 ml-2 list-disc list-inside">
        <li v-for="error in validationErrors" :key="error">{{ error }}</li>
      </ul>
    </div>

    <!-- API側のエラー -->
    <div v-if="apiError" class="error-container">
      <h3 class="font-bold">エラー</h3>
      <ul class="mt-2 ml-2 list-disc list-inside">
        <li>{{ apiError }}</li>
      </ul>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Step 1: 基本情報入力セクション -->
      <div v-if="currentStep === 1" class="space-y-6 animate-fade-in">
        <!-- 技術選択コンポーネント -->
        <TechnologySelector v-model="form.technology_id" :technologies="technologies" :has-error="showTechnologyBorder" @update:modelValue="technologyModified = true" />
        <div>
          <label for="title" class="form-label">タイトル<span class="pl-1 text-red-500">*</span></label>
          <input id="title" name="title" type="text" autocomplete="off" class="form-input-base" :class="[showTitleBorder ? 'form-input-error' : 'form-input-normal']" placeholder="例: Laravel完全マスター" v-model="form.title" @input="titleModified = true" />
        </div>

        <!-- 学習メモ入力テキストエリア -->
        <div>
          <label for="description" class="form-label">概要</label>
          <textarea
            id="description"
            name="description"
            rows="5"
            autocomplete="off"
            class="form-input-base"
            :class="[showDescriptionBorder ? 'form-input-error' : 'form-input-normal']"
            placeholder="学習内容の詳細を自由に入力してください。"
            v-model="form.description"
            @input="descriptionModified = true"
          ></textarea>
          <p class="text-counter" :class="descriptionIsOverLimit ? 'text-counter-over' : ''">
            {{ descriptionCounterText }}
          </p>
        </div>

        <!-- 学習ステータス -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">ステータス</label>
          <div class="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
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
        <SectionListEditor v-model="form.sections" :is-edit-mode="true" :original-sections="originalData.sections" @request-delete="handleSectionDeleteRequest" :show-hint="false" :has-error="showSectionsBorder" />
      </div>

      <!-- Step 3: 確認画面セクション -->
      <div v-if="currentStep === 3" class="space-y-6 animate-fade-in">
        <!-- 基本情報の確認表示 -->
        <div class="p-4 border rounded-lg md:p-6 bg-slate-50">
          <h3 class="pb-2 mb-3 text-base font-semibold border-b md:text-lg text-slate-800">基本情報</h3>
          <div v-if="basicInfoHasChanged" class="space-y-2 text-sm md:text-base">
            <p>
              <span class="font-semibold">技術:</span>
              <span v-if="originalData.technology_id !== form.technology_id" class="inline-flex items-center ml-2">
                <span class="text-gray-400 line-through"> {{ getTechnologyNameById(originalData.technology_id) }}</span>
                <ArrowRightIcon class="w-4 h-4 mx-1" />
                <span class="font-bold text-blue-600"> {{ getTechnologyNameById(form.technology_id) }}</span>
              </span>
              <span v-else class="ml-2">{{ getTechnologyNameById(form.technology_id) }}</span>
            </p>

            <p>
              <span class="font-semibold">タイトル:</span>
              <span v-if="originalData.title !== form.title" class="inline-flex items-center ml-2">
                <span class="text-gray-400 line-through"> {{ originalData.title }}</span>
                <ArrowRightIcon class="w-4 h-4 mx-1" />
                <span class="font-bold text-blue-600"> {{ form.title }} </span>
              </span>
              <span v-else class="ml-2">{{ form.title }}</span>
            </p>

            <div>
              <span class="font-semibold">概要:</span>
              <div v-if="originalData.description !== form.description" class="mt-1 space-y-2">
                <div class="p-2 bg-gray-100 rounded">
                  <p class="text-xs text-gray-500">変更前:</p>
                  <p class="text-sm text-gray-400 line-through break-words whitespace-pre-wrap">{{ originalData.description || '（未入力）' }}</p>
                </div>
                <div class="p-2 rounded bg-blue-50">
                  <p class="text-xs text-blue-600">変更後:</p>
                  <p class="text-sm font-bold text-blue-600 break-words whitespace-pre-wrap">{{ form.description || '（未入力）' }}</p>
                </div>
              </div>
              <p v-else class="mt-1 break-words whitespace-pre-wrap">{{ form.description || '（未入力）' }}</p>
            </div>

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
          <div v-else class="text-sm text-slate-500 md:text-base">変更点はありません。</div>
        </div>
        <!-- セクション情報の確認表示 -->
        <div class="p-4 border rounded-lg md:p-6 bg-slate-50">
          <h3 class="mb-4 text-base font-semibold border-b md:text-lg text-slate-800">セクション</h3>
          <div v-if="!sectionsHaveChanged" class="text-sm text-slate-500 md:text-base">変更点はありません。</div>
          <div v-else class="text-sm md:text-base">
            <ul class="space-y-1 list-decimal list-inside">
              <li v-for="change in sectionChanges" :key="change.id">
                <span v-if="change.status === 'added'" class="font-bold text-emerald-600"> + {{ change.title }} (追加) </span>
                <span v-if="change.status === 'existing'">
                  <span v-if="change.titleChanged" class="inline-flex items-center">
                    <span class="text-gray-400 line-through">{{ change.originalTitle }}</span>
                    <ArrowRightIcon class="w-4 h-4 mx-1" />
                    <span class="font-bold text-blue-600">{{ change.title }}</span>
                  </span>
                  <span v-else> {{ change.title }} </span>
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
        :is-submitting="isSubmitting"
        @cancel="handleCancel"
        @back="prevStep"
        @next="handleNext"
        @submit="handleSubmit"
      />
    </form>
  </DetailLayout>

  <Teleport to="#app">
    <ConfirmModal :is-open="isUnsavedModalOpen" title="編集内容が保存されていません" message="編集した内容を破棄してもよろしいですか？" confirm-button-text="破棄" confirm-button-variant="danger" :show-item-detail="false" @confirm="router.back()" @cancel="isUnsavedModalOpen = false" />
    <ConfirmModal :is-open="isDeleteModalOpen" title="セクションを削除しますか？" message="このセクションに関連する学習記録もすべて削除されます。この操作は取り消せません。" @confirm="confirmSectionDelete" @cancel="cancelSectionDelete" />
    <SuccessToast :show="showSuccessToast" title="更新完了" message="学習内容を更新しました！" :duration="toastDuration" />
  </Teleport>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowRightIcon } from '@heroicons/vue/24/solid';

// ========================================
// 内部インポート
// ========================================
// Piniaストア
import { useAuthStore } from '@/stores/auth';
import { useLearningContentStore } from '@/stores/learningContent';
import { useSectionStore } from '@/stores/sections';

// コンポーザブル
import { useLearningContentForm } from '@/composables/useLearningContentForm';
import { useLearningData } from '@/composables/useLearningData';
import { useLoading } from '@/composables/ui/useLoading';
import { useWizardForm } from '@/composables/useWizardForm';

// コンポーネント
import DetailLayout from '@/layouts/DetailLayout.vue';
import ConfirmModal from '@/components/common/ConfirmModal.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import SuccessToast from '@/components/common/SuccessToast.vue';
import SectionListEditor from '@/components/learning/wizard/SectionListEditor.vue';
import TechnologySelector from '@/components/learning/wizard/TechnologySelector.vue';
import WizardNavigation from '@/components/learning/wizard/WizardNavigation.vue';
import WizardStepIndicator from '@/components/learning/wizard/WizardStepIndicator.vue';

// バリデーションルール
import { validateTechnology, validateTitle, validateDescription, validateSections, LEARNING_CONTENT_VALIDATION_RULES } from '@/validators/learningContentValidator';

// ========================================
// ユーティリティ関数
// ========================================
/**
 * LCS（Longest Common Subsequence：最長共通部分列）アルゴリズム
 *
 * 目的: 編集画面でセクションの「順序変更」を正確に検出するために使用
 *
 * 背景:
 * - セクションは追加・削除・タイトル変更・順序変更の4つの操作がある
 * - 単純な配列比較では「順序変更」と「削除+追加」を区別できない
 * - LCSを使うことで、元の順序を保持している要素を特定できる
 *
 * 例:
 * - 元: [1, 2, 3, 4]
 * - 新: [1, 3, 2, 4]
 * - LCS: [1, 3, 4] → 2は順序が変わった（1と3の間から3と4の間に移動）
 *
 * アルゴリズム:
 * 1. 動的計画法で各位置でのLCSの長さを計算（dp配列）
 * 2. dp配列をバックトラックして実際のLCS要素を抽出
 *
 * @param {Array} arr1 - 元の配列（編集前のセクションID配列）
 * @param {Array} arr2 - 新しい配列（編集後のセクションID配列）
 * @returns {Array} - 最長共通部分列（順序が保たれているID配列）
 */
function findLCS(arr1, arr2) {
  const m = arr1.length;
  const n = arr2.length;

  // ステップ1: 動的計画法でLCSの長さを計算
  // dp[i][j] = arr1の最初のi要素とarr2の最初のj要素のLCSの長さ
  const dp = Array(m + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(0));

  // dpテーブルを構築
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (arr1[i - 1] === arr2[j - 1]) {
        // 要素が一致する場合、LCSの長さを1増やす
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        // 一致しない場合、片方を除いた時の最大値を取る
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // ステップ2: dpテーブルをバックトラックしてLCSの実際の要素を取得
  const lcs = [];
  let i = m,
    j = n;
  while (i > 0 && j > 0) {
    if (arr1[i - 1] === arr2[j - 1]) {
      // 要素が一致する場合、それはLCSの一部
      lcs.unshift(arr1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      // arr1の要素をスキップ
      i--;
    } else {
      // arr2の要素をスキップ
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
const stepNames = ['基本情報', 'セクション設定', '確認'];
const authStore = useAuthStore();
const contentStore = useLearningContentStore();
const sectionStore = useSectionStore();
const { form, hasUnsavedChanges } = useLearningContentForm();
const { learningContentsRaw, sections, technologies } = useLearningData();
const { currentStep, nextStep, prevStep } = useWizardForm(stepNames.length);
const { isLoading, withLoading } = useLoading();

// ========================================
// 状態管理
// ========================================
// バリデーション
const errors = reactive({
  technology_id: '',
  title: '',
  description: '',
  sections: '',
});

// API側のエラー
const apiError = ref('');

// 入力変更フラグ
const titleModified = ref(false);
const descriptionModified = ref(false);
const technologyModified = ref(false);

// データ
const originalData = ref(null);
const deletedSections = ref([]);
const statusMap = {
  not_started: '未着手',
  in_progress: '学習中',
  completed: '完了',
};

// UI状態
const isUnsavedModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const sectionToDeleteIndex = ref(null);
const showSuccessToast = ref(false);
const isSubmitting = ref(false);

// 定数
const MAX_TEXTAREA_LENGTH = LEARNING_CONTENT_VALIDATION_RULES.DESCRIPTION_MAX_LENGTH;
const toastDuration = 2000; // 通知を表示させる時間

// ========================================
// 算出プロパティ
// ========================================
// バリデーションエラー表示制御
const showTechnologyBorder = computed(() => {
  return errors.technology_id !== '' && !technologyModified.value;
});
const showTitleBorder = computed(() => {
  return errors.title !== '' && !titleModified.value;
});
const showDescriptionBorder = computed(() => {
  return errors.description !== '' && !descriptionModified.value;
});
const showSectionsBorder = computed(() => {
  return errors.sections !== '';
});

// validationErrorsの配列生成
const validationErrors = computed(() => {
  const messages = [];
  if (errors.technology_id) messages.push(errors.technology_id);
  if (errors.title) messages.push(errors.title);
  if (errors.description) messages.push(errors.description);
  if (errors.sections) messages.push(errors.sections);
  return messages;
});

// 文字数カウント
const descriptionLength = computed(() => form.description?.length || 0);
const descriptionIsOverLimit = computed(() => descriptionLength.value > MAX_TEXTAREA_LENGTH);
const descriptionCounterText = computed(() => `${descriptionLength.value}/${MAX_TEXTAREA_LENGTH}文字`);

// 確認画面での差分表示
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
  // ログアウト中は処理をスキップ
  if (!authStore.isLoggedIn) {
    return;
  }
  await withLoading('learning-edit-init', async () => {
    try {
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
    }
  });
});

// ========================================
// メソッド
// ========================================
// イベントハンドラ
// ウィザードナビゲーション
const handleNext = () => {
  // バリデーション実行前に状態をリセット
  errors.technology_id = '';
  errors.title = '';
  errors.description = '';
  errors.sections = '';
  technologyModified.value = false;
  titleModified.value = false;
  descriptionModified.value = false;

  if (currentStep.value === 1) {
    // ステップ1（基本情報）のバリデーション
    const technologyResult = validateTechnology(form.technology_id);
    const titleResult = validateTitle(form.title);
    const descriptionResult = validateDescription(form.description);
    // エラーを設定
    if (!technologyResult.isValid) errors.technology_id = technologyResult.message;
    if (!titleResult.isValid) errors.title = titleResult.message;
    if (!descriptionResult.isValid) errors.description = descriptionResult.message;
    // 一括チェック
    if (errors.technology_id || errors.title || errors.description) {
      return;
    }
    // 全て成功したら次のステップへ
    nextStep();
  } else if (currentStep.value === 2) {
    // ステップ2（セクション設定）のバリデーション
    const sectionsResult = validateSections(form.sections);
    if (!sectionsResult.isValid) {
      errors.sections = sectionsResult.message;
      return;
    }
    nextStep(); // 成功したら次のステップへ
  }
};

// キャンセル処理
const handleCancel = () => {
  // 未保存の変更がある場合は確認モーダルを表示
  if (hasUnsavedChanges.value) {
    isUnsavedModalOpen.value = true;
  } else {
    // 変更がない場合は前のページに戻る
    router.back();
  }
};

// セクション削除関連
const handleSectionDeleteRequest = (index) => {
  sectionToDeleteIndex.value = index;
  isDeleteModalOpen.value = true; // 削除確認モーダルを表示
};
const confirmSectionDelete = () => {
  if (sectionToDeleteIndex.value !== null) {
    // 削除対象のセクションをdeletedSectionsに追加し、フォームから削除
    deletedSections.value.push(form.sections[sectionToDeleteIndex.value]);
    form.sections.splice(sectionToDeleteIndex.value, 1);
  }
  isDeleteModalOpen.value = false; // モーダルを閉じる
  sectionToDeleteIndex.value = null; // 削除対象インデックスをリセット
};
const cancelSectionDelete = () => {
  isDeleteModalOpen.value = false; // モーダルを閉じる
  sectionToDeleteIndex.value = null; // 削除対象インデックスをリセット
};

// ヘルパー関数
/**
 * 既存の学習コンテンツデータを読み込み、フォームに設定する
 *
 * この関数は2つのデータソースを統合する：
 * 1. learningContentsRaw: 基本情報（タイトル、概要、技術など）
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

// IDから技術名を取得するヘルパー関数
const getTechnologyNameById = (id) => {
  const tech = technologies.value.find((t) => t.id === id);
  return tech ? tech.name : '不明';
};

// API送信処理
// 学習記録とセクションの更新
const handleSubmit = async () => {
  // NOTE: API側エラーリセットは必ずボタン非活性化解除前に実行すること
  apiError.value = '';
  // ボタンの無効化（二重送信防止）
  isSubmitting.value = true;

  try {
    // 基本情報の更新
    const basicInfo = {
      title: form.title,
      description: form.description,
      technology_id: form.technology_id,
      status: form.status,
    };
    // Piniaストアのアクションを呼び出し、学習コンテンツの基本情報を更新
    await contentStore.updateContent(contentId, basicInfo);

    // セクションデータの送信（index + 1 を使用）
    const sectionPayload = {
      sections: form.sections.map((s, index) => ({
        // 新規セクションはIDが文字列で始まるため、nullに変換してバックエンドで新規作成を識別
        id: s.id && !s.id.toString().startsWith('new_') ? s.id : null,
        title: s.title,
        order: index + 1, // セクションの並び順
      })),
      deleted_section_ids: deletedSections.value.map((s) => s.id), // 削除されたセクションのIDを送信
    };

    // Piniaストアのアクションを呼び出し、セクションを一括更新
    await sectionStore.bulkUpdateSections(contentId, sectionPayload);

    console.log('【Edit.handleSubmit】更新完了');
    // 成功メッセージを表示し、更新した学習内容の詳細ページへ遷移
    showSuccessToast.value = true;
    setTimeout(() => {
      router.push(`/learning/${contentId}`);
    }, toastDuration);
  } catch (error) {
    console.error('学習内容更新エラー:', error);
    if (error?.response?.status === 422) {
      // Laravel側のバリデーションエラー（422）の場合
      apiError.value = '入力データに問題があります。';
    } else {
      // それ以外のレスポンスエラーは固定メッセージ
      // TODO:トランザクション未実装のためセクションの一括更新に失敗した場合はメッセージで通知する
      if (!contentStore.error && sectionStore.error) {
        apiError.value = '※基本情報のみ更新されました。';
      } else {
        apiError.value = 'エラーが発生しました。';
      }
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>
