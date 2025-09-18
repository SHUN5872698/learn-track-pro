<template>
  <!-- 学習内容作成ページのメインコンテナ -->
  <DetailLayout title="新しい学習内容の作成" description="学習したい内容とセクションを登録します。">
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
      </div>

      <!-- Step 2: セクション設定セクション -->
      <div v-if="currentStep === 2">
        <!-- セクションリスト編集コンポーネント -->
        <SectionListEditor v-model="form.sections" :show-hint="true" :has-error="validationErrors.some((error) => error.includes('セクション'))" />
      </div>

      <!-- Step 3: 確認画面セクション -->
      <div v-if="currentStep === 3" class="space-y-6 animate-fade-in">
        <!-- 基本情報の確認表示 -->
        <div class="p-6 border rounded-lg bg-slate-50">
          <h3 class="mb-4 text-lg font-semibold border-b text-slate-800">基本情報</h3>
          <p><span class="font-semibold">技術:</span> {{ getTechnologyName }}</p>
          <p><span class="font-semibold">タイトル:</span> {{ form.title }}</p>
          <p><span class="font-semibold">内容:</span> {{ form.description || '未入力' }}</p>
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
          <label for="startImmediately" class="flex items-center ml-2 text-sm"> すぐに学習を開始する </label>
        </div>
        <!-- チェックボックスのヒント -->
        <p class="flex items-center mt-2 text-sm text-slate-500">
          <LightBulbIcon class="w-5 h-5 mr-2 text-yellow-500" />
          チェックすると「学習中」状態で作成します
        </p>
      </div>

      <!-- ウィザードのナビゲーションボタン -->
      <WizardNavigation :current-step="currentStep" :total-steps="stepNames.length" :show-back="currentStep > 1" :show-next="currentStep < stepNames.length" :show-submit="currentStep === stepNames.length" @cancel="handleCancel" @back="prevStep" @next="handleNext" @submit="handleSubmit" />
    </form>
  </DetailLayout>

  <!-- 未保存の変更がある場合の確認モーダル -->
  <ConfirmModal :is-open="isUnsavedModalOpen" title="編集内容が保存されていません" message="編集した内容を破棄してもよろしいですか？" confirm-button-text="破棄" confirm-button-variant="danger" :show-item-detail="false" @confirm="router.push('/dashboard')" @cancel="isUnsavedModalOpen = false" />
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { LightBulbIcon } from '@heroicons/vue/24/solid';

// ========================================
// 内部インポート
// ========================================
// コンポーザブル
import { useLearningData } from '../../composables/useLearningData';
import { useWizardForm } from '../../composables/useWizardForm';
import { useLearningContentForm } from '../../composables/useLearningContentForm';

// コンポーネント
import DetailLayout from '../../layouts/DetailLayout.vue';
import TechnologySelector from '../../components/learning/wizard/TechnologySelector.vue';
import WizardStepIndicator from '../../components/learning/wizard/WizardStepIndicator.vue';
import SectionListEditor from '../../components/learning/wizard/SectionListEditor.vue';
import WizardNavigation from '../../components/learning/wizard/WizardNavigation.vue';
import ConfirmModal from '../../components/common/ConfirmModal.vue';

// ========================================
// 初期設定
// ========================================
const router = useRouter();

// コンポーザブル実行
const { technologies, createContent } = useLearningData();
const stepNames = ['基本情報', 'セクション設定', '確認'];
const { currentStep, nextStep, prevStep, validationErrors, validateStep } = useWizardForm(stepNames.length);
const { form, hasUnsavedChanges, validateBasicInfo, validateSections } = useLearningContentForm();

// ========================================
// 状態管理
// ========================================
// 入力状態
const titleModified = ref(false);
const descriptionModified = ref(false);
const technologyModified = ref(false);

// UI状態
const isUnsavedModalOpen = ref(false);

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

// データ取得用
const getTechnologyName = computed(() => {
  const tech = technologies.value.find((t) => t.id === form.technology_id);
  return tech ? tech.name : '';
});

// ========================================
// メソッド
// ========================================
// イベントハンドラ
// ウィザードナビゲーション
const handleNext = () => {
  // 修正フラグをリセット
  titleModified.value = false;
  descriptionModified.value = false;
  technologyModified.value = false;

  if (currentStep.value === 1) {
    // ステップ1のバリデーションを実行し、成功すれば次のステップへ
    if (validateStep(validateBasicInfo)) {
      nextStep();
    }
  } else if (currentStep.value === 2) {
    // ステップ2のバリデーションを実行し、成功すれば次のステップへ
    if (validateStep(validateSections)) {
      nextStep();
    }
  }
};

// フォーム送信
const handleSubmit = async () => {
  console.log('【Create.handleSubmit】開始');

  try {
    // セクションにstatusとcompleted_atを追加（in_progressで作成）
    const formDataWithStatus = {
      ...form,
      sections: form.sections.map((section, index) => ({
        ...section,
        order: index + 1,
        status: 'in_progress',
        completed_at: null,
      })),
    };

    console.log('【Create.handleSubmit】送信データ全体:', formDataWithStatus);
    console.log('【Create.handleSubmit】セクション詳細:');
    formDataWithStatus.sections.forEach((section, index) => {
      console.log(`  ${index + 1}. title: "${section.title}", status: "${section.status}"`);
    });

    const newContentId = await createContent(formDataWithStatus);
    console.log('【Create.handleSubmit】作成完了 ID:', newContentId);

    alert('新しい学習内容を作成しました！');
    router.push(`/learning/${newContentId}`);
  } catch (error) {
    console.error('【Create.handleSubmit】エラー:', error);
    validationErrors.value = ['作成中にエラーが発生しました。'];
  }
};

// キャンセル処理
const handleCancel = () => {
  if (hasUnsavedChanges.value) {
    isUnsavedModalOpen.value = true;
  } else {
    router.push('/dashboard');
  }
};
</script>
