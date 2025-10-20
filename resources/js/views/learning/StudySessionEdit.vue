<template>
  <!-- 学習記録編集ページのメインコンポーネント -->
  <div v-if="isLoading" class="py-10 text-center">
    <LoadingSpinner size="lg" message="データを読み込んでいます..." />
  </div>
  <DetailLayout v-else>
    <!-- セクションヘッダー -->
    <template #section-header>
      <h2 class="section-header">学習記録の編集</h2>
      <div class="section-subtext">
        <span>{{ pageDescription }}</span>
      </div>
    </template>

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

    <!-- フォームセクション -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <StudySessionFormFields
        v-model="form"
        :sections="availableSections"
        :validation-errors="validationErrors"
        :learning-content-title="learningContent ? learningContent.title : ''"
        :formatted-date-full="formattedDateFull"
        :formatted-date-short="formattedDateShort"
        :formatted-time="formattedTime"
        :display-study-hours="displayStudyHours"
        :display-study-minutes="displayStudyMinutes"
        :show-section-border="showSectionBorder"
        :show-duration-border="showDurationBorder"
        :show-memo-border="showMemoBorder"
        :show-studied-at-border="showStudiedAtBorder"
        @open-date-modal="openDateModal"
        @open-time-modal="openTimeModal"
        @reset-time-to-now="resetTimeToNow"
        @section-modified="sectionModified = true"
        @duration-modified="durationModified = true"
        @memo-modified="memoModified = true"
        @studied-at-modified="studiedAtModified = true"
      />

      <!-- アクションボタン: キャンセルと記録を保存 -->
      <div class="flex flex-col pt-6 space-y-2 border-t md:flex-row md:justify-between md:space-y-0">
        <CancelButton @click="handleClose" class="w-full md:w-auto" />
        <BaseButton type="submit" variant="primary" size="md" class="w-full md:w-auto" :disabled="isSubmitting"> 記録を更新 </BaseButton>
      </div>
    </form>
  </DetailLayout>

  <Teleport to="#app">
    <DatePickerModal :is-open="isDateModalOpen" :initial-date="form.studied_at" @close="isDateModalOpen = false" @confirm="handleDateConfirm" />

    <TimeInputModal
      :is-open="isTimeModalOpen"
      :initial-hours="timeModalMode === 'timeOfDay' ? new Date(form.studied_at).getHours() : displayStudyHours"
      :initial-minutes="timeModalMode === 'timeOfDay' ? new Date(form.studied_at).getMinutes() : displayStudyMinutes"
      :is-time-of-day-mode="timeModalMode === 'timeOfDay'"
      @close="isTimeModalOpen = false"
      @confirm="handleTimeConfirm"
    />

    <ConfirmModal :is-open="isUnsavedModalOpen" title="編集内容が保存されていません" message="編集した内容を破棄してもよろしいですか？" confirm-button-text="破棄" confirm-button-variant="danger" :show-item-detail="false" @confirm="router.back()" @cancel="isUnsavedModalOpen = false" />
    <SuccessToast :show="showSuccessToast" title="更新完了" message="学習記録を更新しました！" :duration="toastDuration" />
  </Teleport>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// ========================================
// 内部インポート
// ========================================
// Piniaストア
import { useAuthStore } from '@/stores/auth';
import { useLearningContentStore } from '@/stores/learningContent';
import { useLearningSessionStore } from '@/stores/learningSession';
import { useSectionStore } from '@/stores/sections';

// コンポーザブル
import { useStudySessionForm } from '@/composables/useStudySessionForm';
import { useLoading } from '@/composables/ui/useLoading';

// コンポーネント
import DetailLayout from '@/layouts/DetailLayout.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import ConfirmModal from '@/components/common/ConfirmModal.vue';
import DatePickerModal from '@/components/common/DatePickerModal.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import SuccessToast from '@/components/common/SuccessToast.vue';
import TimeInputModal from '@/components/common/TimeInputModal.vue';
import CancelButton from '@/components/common/buttons/CancelButton.vue';
import StudySessionFormFields from '@/components/learning/StudySessionFormFields.vue';

// バリデーション
import { validateSectionId, validateStudiedAt, validateStudyMinutes, validateMemo } from '@/validators/studySessionValidator';

// ========================================
// 初期設定
// ========================================
// ルーター・ルート
const route = useRoute();
const router = useRouter();

// コンポーザブル
const authStore = useAuthStore();
const contentStore = useLearningContentStore();
const sectionStore = useSectionStore();
const sessionStore = useLearningSessionStore();
const { isLoading, withLoading } = useLoading();

// useStudySessionFormから必要なプロパティとメソッドを取得
const {
  form, // フォームデータ
  formattedDateFull, // フォーマットされた日付文字列：デスクトップ用
  formattedDateShort, // フォーマットされた日付文字列：モバイル用
  formattedTime, // フォーマットされた時刻文字列
  displayStudyHours, // 表示用の学習時間（時間）
  displayStudyMinutes, // 表示用の学習時間（分）
  hasUnsavedChanges, // 未保存の変更があるかどうかのフラグ
  isDateModalOpen, // 日付選択モーダルの表示状態
  isTimeModalOpen, // 時間入力モーダルの表示状態
  timeModalMode, // 時間入力モーダルのモード
  openDateModal, // 日付選択モーダルを開く関数
  handleDateConfirm, // 日付選択モーダルの確定イベントハンドラ
  openTimeModal, // 時間入力モーダルを開く関数
  handleTimeConfirm, // 時間入力モーダルの確定イベントハンドラ
  resetTimeToNow, // 学習時刻を現在時刻にリセットする関数
  initializeForm, // フォームを初期化する関数
} = useStudySessionForm();

// ========================================
// 状態管理
// ========================================
// バリデーション
// 各入力フィールドのエラーメッセージを保持
const errors = reactive({
  section_id: '',
  study_minutes: '',
  studied_at: '',
  memo: '',
});

// API側のエラー
const apiError = ref('');

// 各入力フィールドが変更されたかどうかのフラグ
const sectionModified = ref(false);
const durationModified = ref(false);
const memoModified = ref(false);
const studiedAtModified = ref(false);

// UI状態
const isSubmitting = ref(false);
const isUnsavedModalOpen = ref(false); // 未保存変更確認モーダルの表示状態
const showSuccessToast = ref(false);

// 定数
const toastDuration = 2000; // 通知を表示させる時間

// ========================================
// 算出プロパティ
// ========================================
const learningContents = computed(() => contentStore.contents);
const sections = computed(() => sectionStore.sections);

// ルートパラメータから学習コンテンツIDを取得し、整数に変換
const learningContentId = computed(() => parseInt(route.params.contentId, 10));
// ルートパラメータから学習セッションIDを整数として取得
const sessionId = computed(() => parseInt(route.params.sessionId, 10));

// 算出プロパティで現在の学習コンテンツ情報を取得
const learningContent = computed(() => learningContents.value.find((c) => c.id === learningContentId.value));
// 算出プロパティで現在の学習セッション情報を取得
const studySession = computed(() => sessionStore.sessionById(sessionId.value));

// 算出プロパティで現在の学習コンテンツに紐づくセクションをフィルタリング
const availableSections = computed(() => sections.value.filter((s) => s.learning_content_id === learningContentId.value));

// ページ説明文の算出プロパティ
const pageDescription = computed(() => {
  if (learningContent.value) {
    return `「${learningContent.value.title}」の学習記録を更新します。`;
  }
  return 'データを読み込んでいます...';
});

// Vue側のバリデーションエラーメッセージを集約
const validationErrors = computed(() => {
  const messages = [];
  if (errors.section_id) messages.push(errors.section_id);
  if (errors.study_minutes) messages.push(errors.study_minutes);
  if (errors.studied_at) messages.push(errors.studied_at);
  if (errors.memo) messages.push(errors.memo);
  return messages;
});
// バリデーションエラー表示制御
const showSectionBorder = computed(() => {
  return errors.section_id !== '' && !sectionModified.value;
});
const showDurationBorder = computed(() => {
  return errors.study_minutes !== '' && !durationModified.value;
});
const showMemoBorder = computed(() => {
  return errors.memo !== '' && !memoModified.value;
});
const showStudiedAtBorder = computed(() => {
  return errors.studied_at !== '' && !studiedAtModified.value;
});

// ========================================
// ライフサイクル
// ========================================
onMounted(async () => {
  // ログアウト中は処理をスキップ
  if (!authStore.isLoggedIn) {
    return;
  }
  await withLoading('study-edit-init', async () => {
    try {
      if (learningContents.value.length === 0) {
        // 学習コンテンツとセクションのデータを取得
        await contentStore.fetchContents();
      }

      await sectionStore.fetchSections(learningContentId.value);
      const session = await sessionStore.fetchLearningSession(sessionId.value);

      // フォームを初期化
      initializeForm({
        id: session.id,
        learning_content_id: session.learning_content_id,
        section_id: session.section_id,
        studied_at: session.studied_at,
        study_minutes: session.study_minutes,
        memo: session.memo || '',
        mood_rating: session.mood_rating || null,
        session_type: session.session_type || 'manual',
      });
    } catch (error) {
      console.error('データ読み込みエラー:', error);
      router.push('/404');
    }
  });
});

// ========================================
// メソッド
// ========================================
// イベントハンドラ

// キャンセル処理
const handleClose = () => {
  if (hasUnsavedChanges.value) {
    // 未保存の変更がある場合、確認モーダルを表示してユーザーに破棄を促す
    isUnsavedModalOpen.value = true;
  } else {
    router.back();
  }
};

// API送信処理
// 学習記録の更新
const handleSubmit = async () => {
  // 状態をリセット
  errors.section_id = '';
  errors.study_minutes = '';
  errors.studied_at = '';
  errors.memo = '';
  apiError.value = '';
  sectionModified.value = false;
  durationModified.value = false;
  memoModified.value = false;
  studiedAtModified.value = false;

  // 空白を除去
  if (form.memo) form.memo = form.memo.trim();

  // フィールドバリデーション
  const sectionResult = validateSectionId(form.section_id);
  const studiedAtResult = validateStudiedAt(form.studied_at);
  const studyMinutesResult = validateStudyMinutes(form.study_minutes);
  const memoResult = validateMemo(form.memo);

  // エラーを設定
  if (!sectionResult.isValid) errors.section_id = sectionResult.message;
  if (!studiedAtResult.isValid) errors.studied_at = studiedAtResult.message;
  if (!studyMinutesResult.isValid) errors.study_minutes = studyMinutesResult.message;
  if (!memoResult.isValid) errors.memo = memoResult.message;

  // エラーがある場合は送信しない
  if (errors.section_id || errors.studied_at || errors.study_minutes || errors.memo) {
    return;
  }

  // ボタンの無効化
  isSubmitting.value = true;

  // 学習記録の更新
  try {
    // mood_ratingが0またはfalsy値の場合はnullを送る
    const sessionData = {
      learning_content_id: form.learning_content_id,
      section_id: form.section_id,
      studied_at: form.studied_at,
      study_minutes: form.study_minutes,
      memo: form.memo || null,
      mood_rating: form.mood_rating && form.mood_rating > 0 ? form.mood_rating : null,
      session_type: form.session_type || 'manual',
    };
    // Piniaストアのアクションを呼び出し、学習記録を更新
    await sessionStore.updateLearningSession(form.id, sessionData);

    // 成功メッセージを表示し、更新した学習記録の詳細ページへ遷移
    showSuccessToast.value = true;
    setTimeout(() => {
      router.push(`/learning/${form.learning_content_id}/section/${form.section_id}`);
    }, toastDuration);
  } catch (error) {
    console.error('学習記録更新エラー:', error);
    if (error?.response?.status === 422 && sessionStore.hasSessionErrors) {
      // Laravel側のバリデーションエラー（422）の場合、各フィールドにエラーを設定
      Object.keys(sessionStore.errors).forEach((key) => {
        errors[key] = sessionStore.errors[key][0] || sessionStore.errors[key];
      });
    } else {
      // それ以外のレスポンスエラーは固定メッセージ
      apiError.value = 'エラーが発生しました。もう一度お試しください。';
    }
  } finally {
    // フォーム送信状態をリセット
    isSubmitting.value = false;
  }
};
</script>
