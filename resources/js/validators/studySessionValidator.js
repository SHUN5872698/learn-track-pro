/**
 * 学習記録バリデーションルール
 * Laravel側のルールと統一
 */

// ========================================
// 定数定義
// ========================================
export const STUDY_SESSION_VALIDATION_RULES = {
  // 学習時間
  MAX_STUDY_MINUTES: 1439, // 23時間59分
  MIN_STUDY_MINUTES: 1,

  // メモ
  MAX_MEMO_LENGTH: 500,

  // 調子評価
  MIN_MOOD_RATING: 1,
  MAX_MOOD_RATING: 5,

  // セッションタイプ
  VALID_SESSION_TYPES: ['manual', 'stopwatch'],
};

export const STUDY_SESSION_ERROR_MESSAGES = {
  // セクション
  SECTION_REQUIRED: '学習セクションを選択してください',

  // 学習日時
  STUDIED_AT_REQUIRED: '学習日時を入力してください',
  STUDIED_AT_INVALID: '学習日時が不正な形式です',
  STUDIED_AT_FUTURE: '現在日以降の日時は登録できません',

  // 学習時間
  STUDY_MINUTES_REQUIRED: '学習時間を入力してください',
  STUDY_MINUTES_MIN: `学習時間は${STUDY_SESSION_VALIDATION_RULES.MIN_STUDY_MINUTES}分以上で入力してください`,
  STUDY_MINUTES_MAX: '学習時間は1日（24時間）以内で入力してください',
  STUDY_MINUTES_INTEGER: '学習時間は整数で入力してください',

  // 調子評価
  MOOD_RATING_RANGE: `学習中の調子は${STUDY_SESSION_VALIDATION_RULES.MIN_MOOD_RATING}から${STUDY_SESSION_VALIDATION_RULES.MAX_MOOD_RATING}の範囲で評価してください`,

  // メモ
  MEMO_MAX_LENGTH: `学習メモは${STUDY_SESSION_VALIDATION_RULES.MAX_MEMO_LENGTH}文字以内で入力してください`,

  // セッションタイプ関連
  SESSION_TYPE_REQUIRED: '記録方法を選択してください',
  SESSION_TYPE_INVALID: '記録方法は「手動入力」または「ストップウォッチ」のいずれかを選択してください',
};

// ========================================
// バリデーション関数
// ========================================

/**
 * バリデーション結果の型定義
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - バリデーション結果
 * @property {string} message - エラーメッセージ
 */

/**
 * セクションIDのバリデーション
 * @param {number|string|null} sectionId - 検証するセクションID
 * @returns {ValidationResult}
 */
export const validateSectionId = (sectionId) => {
  if (!sectionId) {
    return { isValid: false, message: STUDY_SESSION_ERROR_MESSAGES.SECTION_REQUIRED };
  }

  return { isValid: true, message: '' };
};

/**
 * 学習日時のバリデーション
 * @param {string|Date|null} studiedAt - 検証する学習日時
 * @returns {ValidationResult}
 */
export const validateStudiedAt = (studiedAt) => {
  if (!studiedAt) {
    return { isValid: false, message: STUDY_SESSION_ERROR_MESSAGES.STUDIED_AT_REQUIRED };
  }

  const studiedDate = new Date(studiedAt);

  // 不正な日付形式
  if (isNaN(studiedDate.getTime())) {
    return { isValid: false, message: STUDY_SESSION_ERROR_MESSAGES.STUDIED_AT_INVALID };
  }

  // 未来の日時チェック
  const now = new Date();
  if (studiedDate > now) {
    return { isValid: false, message: STUDY_SESSION_ERROR_MESSAGES.STUDIED_AT_FUTURE };
  }

  return { isValid: true, message: '' };
};

/**
 * 学習時間のバリデーション
 * @param {number|string|null} studyMinutes - 検証する学習時間（分）
 * @returns {ValidationResult}
 */
export const validateStudyMinutes = (studyMinutes) => {
  // 必須チェック
  if (studyMinutes === null || studyMinutes === undefined || studyMinutes === '') {
    return { isValid: false, message: STUDY_SESSION_ERROR_MESSAGES.STUDY_MINUTES_REQUIRED };
  }

  const minutes = Number(studyMinutes);

  // 整数チェック
  if (!Number.isInteger(minutes)) {
    return { isValid: false, message: STUDY_SESSION_ERROR_MESSAGES.STUDY_MINUTES_INTEGER };
  }

  // 最小値チェック
  if (minutes < STUDY_SESSION_VALIDATION_RULES.MIN_STUDY_MINUTES) {
    return { isValid: false, message: STUDY_SESSION_ERROR_MESSAGES.STUDY_MINUTES_MIN };
  }

  // 最大値チェック
  if (minutes > STUDY_SESSION_VALIDATION_RULES.MAX_STUDY_MINUTES) {
    return { isValid: false, message: STUDY_SESSION_ERROR_MESSAGES.STUDY_MINUTES_MAX };
  }

  return { isValid: true, message: '' };
};

/**
 * 調子評価のバリデーション
 * @param {number|string|null} moodRating - 検証する調子評価（1-5）
 * @returns {ValidationResult}
 */
export const validateMoodRating = (moodRating) => {
  // 任意項目のため、値がない場合は有効
  if (moodRating === null || moodRating === undefined || moodRating === '' || moodRating === 0) {
    return { isValid: true, message: '' };
  }

  const rating = Number(moodRating);

  // 範囲チェック
  if (rating < STUDY_SESSION_VALIDATION_RULES.MIN_MOOD_RATING || rating > STUDY_SESSION_VALIDATION_RULES.MAX_MOOD_RATING) {
    return { isValid: false, message: STUDY_SESSION_ERROR_MESSAGES.MOOD_RATING_RANGE };
  }

  return { isValid: true, message: '' };
};

/**
 * メモのバリデーション
 * @param {string|null} memo - 検証するメモ
 * @returns {ValidationResult}
 */
export const validateMemo = (memo) => {
  // 任意項目のため、値がない場合は有効
  if (!memo || !memo.trim()) {
    return { isValid: true, message: '' };
  }

  // 最大長チェック
  if (memo.length > STUDY_SESSION_VALIDATION_RULES.MAX_MEMO_LENGTH) {
    return { isValid: false, message: STUDY_SESSION_ERROR_MESSAGES.MEMO_MAX_LENGTH };
  }

  return { isValid: true, message: '' };
};

/**
 * セッションタイプのバリデーション
 * @param {string|null} sessionType - 検証するセッションタイプ
 * @returns {ValidationResult}
 */
export const validateSessionType = (sessionType) => {
  // 必須チェック
  if (!sessionType) {
    return { isValid: false, message: STUDY_SESSION_ERROR_MESSAGES.SESSION_TYPE_REQUIRED };
  }

  // 有効な値かチェック
  if (!STUDY_SESSION_VALIDATION_RULES.VALID_SESSION_TYPES.includes(sessionType)) {
    return { isValid: false, message: STUDY_SESSION_ERROR_MESSAGES.SESSION_TYPE_INVALID };
  }

  return { isValid: true, message: '' };
};

/**
 * 学習記録フォーム全体のバリデーション
 * @param {Object} form - 検証するフォームデータ
 * @param {number|string} form.section_id - セクションID
 * @param {string|Date} form.studied_at - 学習日時
 * @param {number|string} form.study_minutes - 学習時間（分）
 * @param {string} form.session_type - セッションタイプ
 * @param {number|string|null} form.mood_rating - 調子評価（任意）
 * @param {string|null} form.memo - メモ（任意）
 * @returns {string[]} エラーメッセージの配列
 */
export const validateStudySessionForm = (form) => {
  const errors = [];

  // セクションID
  const sectionResult = validateSectionId(form.section_id);
  if (!sectionResult.isValid) {
    errors.push(sectionResult.message);
  }

  // 学習日時
  const studiedAtResult = validateStudiedAt(form.studied_at);
  if (!studiedAtResult.isValid) {
    errors.push(studiedAtResult.message);
  }

  // 学習時間
  const studyMinutesResult = validateStudyMinutes(form.study_minutes);
  if (!studyMinutesResult.isValid) {
    errors.push(studyMinutesResult.message);
  }

  // セッションタイプ
  const sessionTypeResult = validateSessionType(form.session_type);
  if (!sessionTypeResult.isValid) {
    errors.push(sessionTypeResult.message);
  }

  // メモ（任意）
  const memoResult = validateMemo(form.memo);
  if (!memoResult.isValid) {
    errors.push(memoResult.message);
  }

  // 調子評価（任意）
  const moodRatingResult = validateMoodRating(form.mood_rating);
  if (!moodRatingResult.isValid) {
    errors.push(moodRatingResult.message);
  }

  return errors;
};
