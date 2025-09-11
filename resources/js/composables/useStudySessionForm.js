import { ref, reactive, computed } from 'vue';
import { validateStudySessionForm } from '../validators/studySessionValidator';

export function useStudySessionForm(initialData = null) {
  const defaultForm = {
    learning_content_id: null,
    section_id: null,
    studied_at: '',
    study_minutes: 0,
    memo: '',
    mood_rating: 0,
    session_type: 'manual',
  };

  const form = reactive({ ...defaultForm });
  const initialFormState = ref(null);

  const validationErrors = ref([]);

  // モーダル表示状態
  const isDateModalOpen = ref(false);
  const isTimeModalOpen = ref(false);
  const timeModalMode = ref('duration');

  // フォームの初期化
  const initializeForm = (data) => {
    Object.assign(form, { ...defaultForm, ...data });

    // 既存のstudied_atがDateオブジェクトでない場合、ISO文字列に変換して日付と時刻を整形
    if (form.studied_at && !(form.studied_at instanceof Date)) {
      const date = new Date(form.studied_at);
      const pad = (num) => String(num).padStart(2, '0');
      form.studied_at = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    } else if (!form.studied_at) {
      // studied_atがnullまたは空の場合、現在時刻を設定
      const now = new Date();
      const pad = (num) => String(num).padStart(2, '0');
      form.studied_at = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    }
    // フォームの初期状態をJSON文字列として保存し、未保存の変更を検出するために使用
    initialFormState.value = JSON.stringify(form);
  };

  // フォームに未保存の変更があるかどうかを判定
  const hasUnsavedChanges = computed(() => {
    return initialFormState.value !== JSON.stringify(form);
  });

  // 日時フォーマット
  const formattedDate = computed(() => {
    if (!form.studied_at) return '日付を選択';
    const date = new Date(form.studied_at);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  });

  const formattedTime = computed(() => {
    if (!form.studied_at) return '時刻を選択';
    const date = new Date(form.studied_at);
    return new Intl.DateTimeFormat('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  });

  // 学習時間フォーマット
  const displayStudyHours = computed(() => Math.floor(form.study_minutes / 60));
  const displayStudyMinutes = computed(() => form.study_minutes % 60);

  // バリデーション実行
  const validateForm = () => {
    validationErrors.value = validateStudySessionForm(form);
    return validationErrors.value.length === 0;
  };

  // モーダル制御関数
  const openDateModal = () => {
    isDateModalOpen.value = true;
  };

  // 日付選択モーダルで日付が確定された際の処理
  const handleDateConfirm = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const existingDate = new Date(form.studied_at);
    // 選択された日付と既存の時刻を組み合わせて新しいDateオブジェクトを作成
    const newDate = new Date(year, month - 1, day, existingDate.getHours(), existingDate.getMinutes());
    const pad = (num) => String(num).padStart(2, '0');
    // フォームのstudied_atを更新
    form.studied_at = `${newDate.getFullYear()}-${pad(newDate.getMonth() + 1)}-${pad(newDate.getDate())}T${pad(newDate.getHours())}:${pad(newDate.getMinutes())}`;
    isDateModalOpen.value = false;
  };

  // 時間入力モーダルを開く
  const openTimeModal = (mode) => {
    timeModalMode.value = mode;
    isTimeModalOpen.value = true;
  };

  // 時間入力モーダルで時間が確定された際の処理
  const handleTimeConfirm = ({ hours, minutes, isTimeOfDay }) => {
    if (isTimeOfDay) {
      const currentDateTime = new Date(form.studied_at);
      // 選択された時間と既存の日付を組み合わせて新しいDateオブジェクトを作成
      const newDateTime = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate(), hours, minutes);
      const pad = (num) => String(num).padStart(2, '0');
      // フォームのstudied_atを更新
      form.studied_at = `${newDateTime.getFullYear()}-${pad(newDateTime.getMonth() + 1)}-${pad(newDateTime.getDate())}T${pad(newDateTime.getHours())}:${pad(newDateTime.getMinutes())}`;
    } else {
      // 学習時間を分単位で更新
      form.study_minutes = hours * 60 + minutes;
    }
    isTimeModalOpen.value = false;
  };

  // studied_atの時刻を現在時刻にリセット
  const resetTimeToNow = () => {
    const now = new Date();
    const existingDate = new Date(form.studied_at);
    // 既存の日付を保持しつつ、時刻のみを現在時刻に更新
    const newDateTime = new Date(existingDate.getFullYear(), existingDate.getMonth(), existingDate.getDate(), now.getHours(), now.getMinutes());
    const pad = (num) => String(num).padStart(2, '0');
    form.studied_at = `${newDateTime.getFullYear()}-${pad(newDateTime.getMonth() + 1)}-${pad(newDateTime.getDate())}T${pad(newDateTime.getHours())}:${pad(newDateTime.getMinutes())}`;
  };

  // initialDataが提供された場合、すぐにフォームを初期化
  if (initialData) {
    initializeForm(initialData);
  }

  return {
    form,
    validationErrors,
    formattedDate,
    formattedTime,
    displayStudyHours,
    displayStudyMinutes,
    hasUnsavedChanges,
    validateForm,
    isDateModalOpen,
    isTimeModalOpen,
    timeModalMode,
    openDateModal,
    handleDateConfirm,
    openTimeModal,
    handleTimeConfirm,
    resetTimeToNow,
    initializeForm,
  };
}
