/**
 * 認証関連バリデーションルール
 * Laravel側のルールと統一
 */

// ========================================
// 定数定義
// ========================================
export const AUTH_VALIDATION_RULES = {
  // 名前
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 50,

  // メールアドレス
  EMAIL_MAX_LENGTH: 255,

  // パスワード
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 255,
};

export const AUTH_ERROR_MESSAGES = {
  // 名前関連
  NAME_REQUIRED: '名前を入力してください',
  NAME_MAX_LENGTH: `名前は${AUTH_VALIDATION_RULES.NAME_MAX_LENGTH}文字以内で入力してください`,
  NAME_INVALID_CHARS: '使用できない文字が含まれています',

  // メールアドレス関連
  EMAIL_REQUIRED: 'メールアドレスを入力してください',
  EMAIL_INVALID_FORMAT: '有効なメールアドレスを入力してください',
  EMAIL_MAX_LENGTH: `メールアドレスは${AUTH_VALIDATION_RULES.EMAIL_MAX_LENGTH}文字以内で入力してください`,

  // パスワード関連
  PASSWORD_REQUIRED: 'パスワードを入力してください',
  PASSWORD_MIN_LENGTH: `パスワードは${AUTH_VALIDATION_RULES.PASSWORD_MIN_LENGTH}文字以上で入力してください`,
  PASSWORD_MAX_LENGTH: `パスワードは${AUTH_VALIDATION_RULES.PASSWORD_MAX_LENGTH}文字以内で入力してください`,
  PASSWORD_CONFIRMATION_REQUIRED: 'パスワード確認を入力してください',
  PASSWORD_MISMATCH: 'パスワードが一致しません',

  // 現在のパスワード
  CURRENT_PASSWORD_REQUIRED: '現在のパスワードを入力してください',
};

export const AUTH_PATTERNS = {
  // 名前: 英数字、日本語（ひらがな、カタカナ、漢字）、空白文字を許可
  NAME: /^[a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF\s]+$/,
  // メールアドレス: 標準的なメールアドレス形式を検証
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  // パスワード: 最低8文字（Laravel Password::default()に準拠）
  PASSWORD: /^.{8,}$/,
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
 * 名前のバリデーション（登録用）
 * @param {string} name - 検証する名前
 * @returns {ValidationResult}
 */
export const validateName = (name) => {
  const trimmedName = name?.trim() || '';

  if (!trimmedName) {
    return { isValid: false, message: AUTH_ERROR_MESSAGES.NAME_REQUIRED };
  }

  if (trimmedName.length > AUTH_VALIDATION_RULES.NAME_MAX_LENGTH) {
    return { isValid: false, message: AUTH_ERROR_MESSAGES.NAME_MAX_LENGTH };
  }

  if (!AUTH_PATTERNS.NAME.test(trimmedName)) {
    return { isValid: false, message: AUTH_ERROR_MESSAGES.NAME_INVALID_CHARS };
  }

  return { isValid: true, message: '' };
};

/**
 * メールアドレスのバリデーション
 * @param {string} email - 検証するメールアドレス
 * @returns {ValidationResult}
 */
export const validateEmail = (email) => {
  const trimmedEmail = email?.trim() || '';

  if (!trimmedEmail) {
    return { isValid: false, message: AUTH_ERROR_MESSAGES.EMAIL_REQUIRED };
  }

  if (!AUTH_PATTERNS.EMAIL.test(trimmedEmail)) {
    return { isValid: false, message: AUTH_ERROR_MESSAGES.EMAIL_INVALID_FORMAT };
  }

  if (trimmedEmail.length > AUTH_VALIDATION_RULES.EMAIL_MAX_LENGTH) {
    return { isValid: false, message: AUTH_ERROR_MESSAGES.EMAIL_MAX_LENGTH };
  }

  return { isValid: true, message: '' };
};

/**
 * パスワードのバリデーション（新規登録・リセット用）
 * @param {string} password - 検証するパスワード
 * @returns {ValidationResult}
 */
export const validatePassword = (password) => {
  if (!password || !password.trim()) {
    return { isValid: false, message: AUTH_ERROR_MESSAGES.PASSWORD_REQUIRED };
  }

  if (password.length < AUTH_VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return { isValid: false, message: AUTH_ERROR_MESSAGES.PASSWORD_MIN_LENGTH };
  }

  if (password.length > AUTH_VALIDATION_RULES.PASSWORD_MAX_LENGTH) {
    return { isValid: false, message: AUTH_ERROR_MESSAGES.PASSWORD_MAX_LENGTH };
  }

  return { isValid: true, message: '' };
};

/**
 * パスワード確認のバリデーション
 * @param {string} passwordConfirmation - 検証するパスワード確認
 * @param {string} password - 比較対象のパスワード
 * @returns {ValidationResult}
 */
export const validatePasswordConfirmation = (passwordConfirmation, password) => {
  if (!passwordConfirmation || !passwordConfirmation.trim()) {
    return { isValid: false, message: AUTH_ERROR_MESSAGES.PASSWORD_CONFIRMATION_REQUIRED };
  }

  if (passwordConfirmation !== password) {
    return { isValid: false, message: AUTH_ERROR_MESSAGES.PASSWORD_MISMATCH };
  }

  return { isValid: true, message: '' };
};

/**
 * 現在のパスワードのバリデーション（パスワード変更用）
 * @param {string} currentPassword - 検証する現在のパスワード
 * @returns {ValidationResult}
 */
export const validateCurrentPassword = (currentPassword) => {
  if (!currentPassword || !currentPassword.trim()) {
    return { isValid: false, message: AUTH_ERROR_MESSAGES.CURRENT_PASSWORD_REQUIRED };
  }

  return { isValid: true, message: '' };
};
