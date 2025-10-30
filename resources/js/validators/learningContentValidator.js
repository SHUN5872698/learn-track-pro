/**
 * 学習内容管理バリデーションルール
 * Laravel側のルールと統一
 */

// ========================================
// 定数定義
// ========================================
export const LEARNING_CONTENT_VALIDATION_RULES = {
  // 学習内容
  TITLE_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 500,

  // セクション
  SECTION_TITLE_MAX_LENGTH: 50,
  SECTIONS_MIN_COUNT: 1,
};

export const LEARNING_CONTENT_ERROR_MESSAGES = {
  // 技術選択
  TECHNOLOGY_REQUIRED: '技術を選択してください',

  // タイトル
  TITLE_REQUIRED: 'タイトルを入力してください',
  TITLE_MAX_LENGTH: `タイトルは${LEARNING_CONTENT_VALIDATION_RULES.TITLE_MAX_LENGTH}文字以内で入力してください`,

  // 概要
  DESCRIPTION_MAX_LENGTH: `概要は${LEARNING_CONTENT_VALIDATION_RULES.DESCRIPTION_MAX_LENGTH}文字以内で入力してください`,

  // セクション
  SECTIONS_REQUIRED: 'セクションを最低1つ追加してください',
  SECTION_TITLE_REQUIRED: 'すべてのセクションにタイトルを入力してください',
  SECTION_TITLE_MAX_LENGTH: `セクションのタイトルは${LEARNING_CONTENT_VALIDATION_RULES.SECTION_TITLE_MAX_LENGTH}文字以内で入力してください`,
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
 * 技術選択のバリデーション
 * @param {number|null} technologyId - 検証する技術ID
 * @returns {ValidationResult}
 */
export const validateTechnology = (technologyId) => {
  if (!technologyId) {
    return { isValid: false, message: LEARNING_CONTENT_ERROR_MESSAGES.TECHNOLOGY_REQUIRED };
  }

  return { isValid: true, message: '' };
};

/**
 * タイトルのバリデーション
 * @param {string} title - 検証するタイトル
 * @returns {ValidationResult}
 */
export const validateTitle = (title) => {
  const trimmedTitle = title?.trim() || '';

  if (!trimmedTitle) {
    return { isValid: false, message: LEARNING_CONTENT_ERROR_MESSAGES.TITLE_REQUIRED };
  }

  if (trimmedTitle.length > LEARNING_CONTENT_VALIDATION_RULES.TITLE_MAX_LENGTH) {
    return { isValid: false, message: LEARNING_CONTENT_ERROR_MESSAGES.TITLE_MAX_LENGTH };
  }

  return { isValid: true, message: '' };
};

/**
 * 概要のバリデーション
 * @param {string} description - 検証する概要
 * @returns {ValidationResult}
 */
export const validateDescription = (description) => {
  // 任意項目なので空でもOK
  if (!description) {
    return { isValid: true, message: '' };
  }

  const trimmedDescription = description.trim();

  if (trimmedDescription.length > LEARNING_CONTENT_VALIDATION_RULES.DESCRIPTION_MAX_LENGTH) {
    return { isValid: false, message: LEARNING_CONTENT_ERROR_MESSAGES.DESCRIPTION_MAX_LENGTH };
  }

  return { isValid: true, message: '' };
};

/**
 * セクション配列のバリデーション
 * @param {Array} sections - 検証するセクション配列
 * @returns {ValidationResult}
 */
export const validateSections = (sections) => {
  // セクション数チェック
  if (!sections || sections.length < LEARNING_CONTENT_VALIDATION_RULES.SECTIONS_MIN_COUNT) {
    return { isValid: false, message: LEARNING_CONTENT_ERROR_MESSAGES.SECTIONS_REQUIRED };
  }

  // 各セクションのタイトルチェック
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const trimmedTitle = section.title?.trim() || '';

    if (!trimmedTitle) {
      return { isValid: false, message: LEARNING_CONTENT_ERROR_MESSAGES.SECTION_TITLE_REQUIRED };
    }

    if (trimmedTitle.length > LEARNING_CONTENT_VALIDATION_RULES.SECTION_TITLE_MAX_LENGTH) {
      return { isValid: false, message: LEARNING_CONTENT_ERROR_MESSAGES.SECTION_TITLE_MAX_LENGTH };
    }
  }

  return { isValid: true, message: '' };
};
