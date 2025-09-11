/**
 * プロフィール編集のバリデーションルール
 */

// 1. バリデーションルールの定数化
const VALIDATION_RULES = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 100,
  PASSWORD_MIN_LENGTH: 8,
  avatar_MAX_LENGTH: 500,
};

// 2. エラーメッセージの一元管理
const ERROR_MESSAGES = {
  // 名前関連
  NAME_REQUIRED: '名前は必須です',
  NAME_MIN_LENGTH: `名前は${VALIDATION_RULES.NAME_MIN_LENGTH}文字以上で入力してください`,
  NAME_MAX_LENGTH: `名前は${VALIDATION_RULES.NAME_MAX_LENGTH}文字以内で入力してください`,
  NAME_INVALID_CHARS: '使用できない文字が含まれています',

  // メールアドレス関連
  EMAIL_REQUIRED: 'メールアドレスは必須です',
  EMAIL_INVALID_FORMAT: '有効なメールアドレスを入力してください',
  EMAIL_MAX_LENGTH: `メールアドレスは${VALIDATION_RULES.EMAIL_MAX_LENGTH}文字以内で入力してください`,

  // パスワード関連
  PASSWORD_REQUIRED: 'パスワードは必須です',
  PASSWORD_MIN_LENGTH: `パスワードは${VALIDATION_RULES.PASSWORD_MIN_LENGTH}文字以上で入力してください`,
  PASSWORD_WEAK: '',
  PASSWORD_CONFIRMATION_REQUIRED: 'パスワード確認は必須です',
  PASSWORD_MISMATCH: 'パスワードが一致しません',

  // アバター関連
  AVATAR_INVALID_URL: '有効なURLを入力してください',
  AVATAR_INVALID_IMAGE: '画像のURLを入力してください',
};

// 3. 正規表現パターンの定数化
const PATTERNS = {
  // 名前: 英数字、日本語（ひらがな、カタカナ、漢字）、空白文字を許可
  NAME: /^[a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF\s]+$/,

  // メールアドレス: 標準的なメールアドレス形式を検証
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  // パスワード: 最低8文字を許可
  PASSWORD: /^.{8,}$/,
  // パスワード: 大文字、小文字、数字をそれぞれ1つ以上含む
  // PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$/,

  // 画像URL: 一般的な画像ファイル拡張子（jpg, jpeg, png, gif, webp）を検証
  IMAGE_URL: /\.(jpg|jpeg|png|gif|webp)$/i,
};

// 4. 個別バリデーション関数（リファクタリング版）
/**
 * 名前のバリデーション
 * @param {string} name - 検証する名前
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateName = (name) => {
  const trimmedName = name?.trim() || '';

  if (!trimmedName) {
    return { isValid: false, message: ERROR_MESSAGES.NAME_REQUIRED };
  }

  if (trimmedName.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    return { isValid: false, message: ERROR_MESSAGES.NAME_MIN_LENGTH };
  }

  if (trimmedName.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
    return { isValid: false, message: ERROR_MESSAGES.NAME_MAX_LENGTH };
  }

  if (!PATTERNS.NAME.test(trimmedName)) {
    return { isValid: false, message: ERROR_MESSAGES.NAME_INVALID_CHARS };
  }

  return { isValid: true, message: '' };
};

/**
 * メールアドレスのバリデーション
 * @param {string} email - 検証するメールアドレス
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateEmail = (email) => {
  const trimmedEmail = email?.trim() || '';

  if (!trimmedEmail) {
    return { isValid: false, message: ERROR_MESSAGES.EMAIL_REQUIRED };
  }

  if (!PATTERNS.EMAIL.test(trimmedEmail)) {
    return { isValid: false, message: ERROR_MESSAGES.EMAIL_INVALID_FORMAT };
  }

  if (trimmedEmail.length > VALIDATION_RULES.EMAIL_MAX_LENGTH) {
    return { isValid: false, message: ERROR_MESSAGES.EMAIL_MAX_LENGTH };
  }

  return { isValid: true, message: '' };
};

/**
 * パスワードのバリデーション
 * @param {string} password - 検証するパスワード
 * @returns {object} { isValid: boolean, message: string }
 */
export const validatePassword = (password) => {
  if (!password || !password.trim()) {
    return { isValid: false, message: ERROR_MESSAGES.PASSWORD_REQUIRED };
  }

  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return { isValid: false, message: ERROR_MESSAGES.PASSWORD_MIN_LENGTH };
  }

  if (!PATTERNS.PASSWORD.test(password)) {
    return { isValid: false, message: ERROR_MESSAGES.PASSWORD_WEAK };
  }

  return { isValid: true, message: '' };
};

/**
 * パスワード確認のバリデーション
 * @param {string} passwordConfirmation - 検証するパスワード確認
 * @param {string} password - 比較対象のパスワード
 * @returns {object} { isValid: boolean, message: string }
 */
export const validatePasswordConfirmation = (passwordConfirmation, password) => {
  if (!passwordConfirmation || !passwordConfirmation.trim()) {
    return { isValid: false, message: ERROR_MESSAGES.PASSWORD_CONFIRMATION_REQUIRED };
  }

  if (passwordConfirmation !== password) {
    return { isValid: false, message: ERROR_MESSAGES.PASSWORD_MISMATCH };
  }

  return { isValid: true, message: '' };
};

/**
 * アバターURLのバリデーション
 * @param {string} avatarUrl - 検証するURL
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateAvatarUrl = (avatarUrl) => {
  const trimmedUrl = avatarUrl?.trim() || '';

  // 空の場合はOK（オプション項目）
  if (!trimmedUrl) {
    return { isValid: true, message: '' };
  }

  // URL形式のチェック
  try {
    new URL(trimmedUrl);
  } catch {
    return { isValid: false, message: ERROR_MESSAGES.AVATAR_INVALID_URL };
  }

  // 画像URLかどうかのチェック（特定サービスは許可）
  const urlWithoutQuery = trimmedUrl.split('?')[0];
  const allowedServices = ['pexels.com', 'unsplash.com', 'gravatar.com'];
  const isAllowedService = allowedServices.some((service) => trimmedUrl.includes(service));

  if (!PATTERNS.IMAGE_URL.test(urlWithoutQuery) && !isAllowedService) {
    return { isValid: false, message: ERROR_MESSAGES.AVATAR_INVALID_IMAGE };
  }

  return { isValid: true, message: '' };
};

/**
 * プロフィール全体のバリデーション
 * @param {object} profileData - プロフィールデータ
 * @returns {object} { isValid: boolean, errors: object }
 */
export const validateProfile = (profileData) => {
  const errors = {};
  let isValid = true;

  // 名前のバリデーション
  const nameResult = validateName(profileData.name);
  if (!nameResult.isValid) {
    errors.name = nameResult.message;
    isValid = false;
  }

  // メールアドレスのバリデーション
  const emailResult = validateEmail(profileData.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.message;
    isValid = false;
  }

  // パスワード変更時のバリデーション（いずれかが入力されている場合）
  const hasPasswordFields = profileData.new_password || profileData.current_password || profileData.new_password_confirmation;

  if (hasPasswordFields) {
    // 現在のパスワード
    if (!profileData.current_password) {
      errors.current_password = ERROR_MESSAGES.PASSWORD_REQUIRED;
      isValid = false;
    }

    // 新しいパスワード
    const newPasswordResult = validatePassword(profileData.new_password);
    if (!newPasswordResult.isValid) {
      errors.new_password = newPasswordResult.message;
      isValid = false;
    }

    // パスワード確認
    const confirmResult = validatePasswordConfirmation(profileData.new_password_confirmation, profileData.new_password);
    if (!confirmResult.isValid) {
      errors.new_password_confirmation = confirmResult.message;
      isValid = false;
    }
  }

  // アバターURLのバリデーション
  const avatarResult = validateAvatarUrl(profileData.avatar);
  if (!avatarResult.isValid) {
    errors.avatar = avatarResult.message;
    isValid = false;
  }

  return { isValid, errors };
};

/**
 * リアルタイムバリデーション用のヘルパー
 * @param {string} fieldName - フィールド名
 * @param {any} value - 検証する値
 * @param {object} allFormData - フォーム全体のデータ（パスワード確認用）
 * @returns {string} エラーメッセージ（エラーがない場合は空文字）
 */
export const validateField = (fieldName, value, allFormData = {}) => {
  const validators = {
    name: () => validateName(value),
    email: () => validateEmail(value),
    current_password: () => validatePassword(value),
    new_password: () => validatePassword(value),
    new_password_confirmation: () => validatePasswordConfirmation(value, allFormData.new_password),
    avatar: () => validateAvatarUrl(value),
  };

  const validator = validators[fieldName];
  if (!validator) return '';

  const result = validator();
  return result.isValid ? '' : result.message;
};

// 5. エクスポート（他のファイルで使用可能にする）
export { VALIDATION_RULES, ERROR_MESSAGES, PATTERNS };
