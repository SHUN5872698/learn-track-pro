<template>
  <!-- 学習内容作成ページのメインコンポーネント -->
  <DetailLayout>
    <!-- セクションヘッダー -->
    <template #section-header>
      <h2 class="section-header">新しい学習内容の作成</h2>
      <div class="section-subtext">
        <span>学習したい内容とセクションを登録します。</span>
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
            :class="[descriptionIsOverLimit ? 'form-input-error' : 'form-input-normal']"
            placeholder="学習内容の詳細を自由に入力してください。"
            v-model="form.description"
            @input="descriptionModified = true"
          ></textarea>
          <p class="text-counter" :class="descriptionIsOverLimit ? 'text-counter-over' : ''">
            {{ descriptionCounterText }}
          </p>
        </div>
      </div>

      <!-- Step 2: セクション設定セクション -->
      <div v-if="currentStep === 2">
        <!-- セクションリスト編集コンポーネント -->
        <SectionListEditor v-model="form.sections" :show-hint="true" :has-error="showSectionsBorder" />
      </div>

      <!-- Step 3: 確認画面セクション -->
      <div v-if="currentStep === 3" class="space-y-6 animate-fade-in">
        <!-- 基本情報の確認表示 -->
        <div class="p-4 border rounded-lg md:p-6 bg-slate-50">
          <h3 class="pb-2 mb-3 text-base font-semibold border-b md:text-lg text-slate-800">基本情報</h3>
          <p class="text-sm break-words md:text-base"><span class="font-semibold">技術:</span> {{ getTechnologyName }}</p>
          <p><span class="font-semibold">タイトル:</span> {{ form.title }}</p>
          <div>
            <span class="font-semibold">概要:</span>
            <div class="p-2 my-1 bg-gray-100 rounded">
              <p class="break-words whitespace-pre-wrap">{{ form.description || '（未入力）' }}</p>
            </div>
          </div>
        </div>
        <!-- セクション情報の確認表示 -->
        <div class="p-6 border rounded-lg bg-slate-50">
          <h3 class="mb-4 text-lg font-semibold border-b text-slate-800">セクション ({{ form.sections.length }}個)</h3>
          <ul class="ml-5 list-decimal">
            <li v-for="section in form.sections" :key="section.order">{{ section.title }}</li>
          </ul>
        </div>
        <!-- 「すぐに学習を開始する」チェックボックス -->
        <div class="flex items-center mt-4">
          <input id="startImmediately" type="checkbox" v-model="form.startImmediately" class="w-4 h-4 border-gray-300 rounded text-violet-600 focus:ring-violet-500" />
          <label for="startImmediately" class="flex items-center ml-2 text-sm">すぐに学習を開始する</label>
        </div>
        <!-- チェックボックスのヒント -->
        <p class="flex items-center mt-2 text-sm text-slate-500">
          <LightBulbIcon class="w-5 h-5 mr-2 text-yellow-500" />
          チェックすると「学習中」状態で作成します
        </p>
      </div>

      <!-- ウィザードのナビゲーションボタン -->
      <WizardNavigation
        :current-step="currentStep"
        :total-steps="stepNames.length"
        :show-back="currentStep > 1"
        :show-next="currentStep < stepNames.length"
        :show-submit="currentStep === stepNames.length"
        :is-submitting="isSubmitting"
        @cancel="handleCancel"
        @back="prevStep"
        @next="handleNext"
        @submit="handleSubmit"
      />
    </form>
  </DetailLayout>

  <Teleport to="#app">
    <ConfirmModal :is-open="isUnsavedModalOpen" title="編集内容が保存されていません" message="編集した内容を破棄してもよろしいですか？" confirm-button-text="破棄" confirm-button-variant="danger" :show-item-detail="false" @confirm="router.push('/dashboard')" @cancel="isUnsavedModalOpen = false" />
    <SuccessToast :show="showSuccessToast" title="作成完了" message="学習内容を作成しました！" :duration="toastDuration" />
  </Teleport>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { LightBulbIcon } from '@heroicons/vue/24/solid';

// ========================================
// 内部インポート
// ========================================
// Piniaストア
import { useAuthStore } from '@/stores/auth';
import { useLearningContentStore } from '@/stores/learningContent';

// コンポーザブル
import { useLearningContentForm } from '@/composables/useLearningContentForm';
import { useLearningData } from '@/composables/useLearningData';
import { useWizardForm } from '@/composables/useWizardForm';

// コンポーネント
import DetailLayout from '@/layouts/DetailLayout.vue';
import ConfirmModal from '@/components/common/ConfirmModal.vue';
import SuccessToast from '@/components/common/SuccessToast.vue';
import SectionListEditor from '@/components/learning/wizard/SectionListEditor.vue';
import TechnologySelector from '@/components/learning/wizard/TechnologySelector.vue';
import WizardNavigation from '@/components/learning/wizard/WizardNavigation.vue';
import WizardStepIndicator from '@/components/learning/wizard/WizardStepIndicator.vue';

// バリデーションルール
import { validateTechnology, validateTitle, validateDescription, validateSections, LEARNING_CONTENT_VALIDATION_RULES } from '@/validators/learningContentValidator';

// ========================================
// 初期設定
// ========================================
// ルーター・ルート
const router = useRouter();

// コンポーザブル
const stepNames = ['基本情報', 'セクション設定', '確認'];
const authStore = useAuthStore();
const contentStore = useLearningContentStore();
const { form, hasUnsavedChanges } = useLearningContentForm();
const { technologies } = useLearningData();
const { currentStep, nextStep, prevStep } = useWizardForm(stepNames.length);

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
const technologyModified = ref(false);
const titleModified = ref(false);
const descriptionModified = ref(false);

// UI状態
const isUnsavedModalOpen = ref(false);
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

// 学習内容の取得
const getTechnologyName = computed(() => {
  const tech = technologies.value.find((t) => t.id === form.technology_id);
  return tech ? tech.name : '';
});

// ========================================
// ライフサイクル
// ========================================
onMounted(async () => {
  // ログアウト中は処理をスキップ
  if (!authStore.isLoggedIn) {
    return;
  }
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
    // 変更がない場合はダッシュボードへ遷移
    router.push('/dashboard');
  }
};

// API送信処理
// 学習記録とセクションの作成
const handleSubmit = async () => {
  // NOTE: API側エラーリセットは必ずボタン非活性化解除前に実行すること
  apiError.value = '';
  // ボタンの無効化（二重送信防止）
  isSubmitting.value = true;

  try {
    // フォームデータにセクションのステータスと完了日時を追加し、バックエンドの期待する形式に整形
    const formDataWithStatus = {
      ...form,
      sections: form.sections.map((section, index) => ({
        ...section,
        order: index + 1,
        status: 'in_progress',
        completed_at: null,
      })),
    };
    // Piniaストアのアクションを呼び出し、学習内容を作成
    const newContent = await contentStore.createContent(formDataWithStatus);

    // 成功メッセージを表示し、作成した学習内容の詳細ページへ遷移
    showSuccessToast.value = true;
    setTimeout(() => {
      router.push(`/learning/${newContent.id}`);
    }, toastDuration);
  } catch (error) {
    console.error('学習内容作成エラー:', error);
    if (error?.response?.status === 422) {
      // Laravel側のバリデーションエラー（422）の場合
      apiError.value = '入力データに問題があります。';
    } else {
      // それ以外のレスポンスエラーは固定メッセージ
      apiError.value = 'エラーが発生しました。';
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>
