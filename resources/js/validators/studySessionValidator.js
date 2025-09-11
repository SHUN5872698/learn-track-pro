// 1. バリデーションルールの定数化
const VALIDATION_RULES = {
  MAX_STUDY_MINUTES: 1439, // 23時間59分
  MAX_MEMO_LENGTH: 200,
  MIN_MOOD_RATING: 1,
  MAX_MOOD_RATING: 5,
};

// 2. エラーメッセージの一元管理
const ERROR_MESSAGES = {
  SECTION_REQUIRED: '学習セクションを選択してください。',
  STUDIED_AT_REQUIRED: '学習日時を入力してください。',
  STUDIED_AT_INVALID: '学習日時が不正な形式です。',
  STUDY_MINUTES_REQUIRED: '学習時間を入力してください。',
  STUDY_MINUTES_MIN: '学習時間は1分以上で入力してください。',
  STUDY_MINUTES_MAX: '学習時間は24時間未満で入力してください。',
  STUDY_MINUTES_INTEGER: '学習時間は整数で入力してください。',
  MOOD_RATING_RANGE: `学習中の調子は${VALIDATION_RULES.MIN_MOOD_RATING}から${VALIDATION_RULES.MAX_MOOD_RATING}の範囲で評価してください。`,
  MEMO_MAX_LENGTH: `学習メモは${VALIDATION_RULES.MAX_MEMO_LENGTH}文字以内で入力してください。`,
};

// 3. リファクタリングされたバリデーション関数
export function validateStudySessionForm(form) {
  const errors = [];

  // section_id: 必須
  if (!form.section_id) {
    errors.push(ERROR_MESSAGES.SECTION_REQUIRED);
  }

  // studied_at: 必須、日付形式
  if (!form.studied_at) {
    errors.push(ERROR_MESSAGES.STUDIED_AT_REQUIRED);
  } else if (isNaN(new Date(form.studied_at).getTime())) {
    errors.push(ERROR_MESSAGES.STUDIED_AT_INVALID);
  }

  // study_minutes: 必須、1以上の整数
  if (form.study_minutes === null || form.study_minutes === undefined) {
    errors.push(ERROR_MESSAGES.STUDY_MINUTES_REQUIRED);
  } else if (form.study_minutes < 1) {
    errors.push(ERROR_MESSAGES.STUDY_MINUTES_MIN);
  } else if (!Number.isInteger(form.study_minutes)) {
    errors.push(ERROR_MESSAGES.STUDY_MINUTES_INTEGER);
  } else if (form.study_minutes > VALIDATION_RULES.MAX_STUDY_MINUTES) {
    errors.push(ERROR_MESSAGES.STUDY_MINUTES_MAX);
  }

  // mood_rating: 任意、値が存在する場合は1-5の範囲
  if (form.mood_rating !== null && form.mood_rating !== undefined && form.mood_rating !== 0) {
    if (form.mood_rating < VALIDATION_RULES.MIN_MOOD_RATING || form.mood_rating > VALIDATION_RULES.MAX_MOOD_RATING) {
      errors.push(ERROR_MESSAGES.MOOD_RATING_RANGE);
    }
  }

  // memo: 任意、最大200文字
  if (form.memo && form.memo.length > VALIDATION_RULES.MAX_MEMO_LENGTH) {
    errors.push(ERROR_MESSAGES.MEMO_MAX_LENGTH);
  }

  return errors;
}

// 4. ルールと定数をエクスポート（他のファイルで使用可能にする）
export { VALIDATION_RULES, ERROR_MESSAGES };
