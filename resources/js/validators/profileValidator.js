/**
 * プロフィール編集専用バリデーションルール
 * 認証関連は authValidator.js に分離
 */

// ========================================
// 定数定義
// ========================================
// ユーザー情報
export const PROFILE_VALIDATION_RULES = {
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 255,
  AVATAR_MAX_LENGTH: 500,
};

// プロフィール画像ファイル
export const AVATAR_FILE_RULES = {
  MAX_SIZE: 2 * 1024 * 1024, // 2MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
};

// ========================================
// エラーメッセージ
// ========================================
// ユーザー情報
export const PROFILE_ERROR_MESSAGES = {
  // 名前関連
  NAME_REQUIRED: '名前を入力してください',
  NAME_MAX_LENGTH: `名前は${PROFILE_VALIDATION_RULES.NAME_MAX_LENGTH}文字以内で入力してください`,
  NAME_INVALID_CHARS: '使用できない文字が含まれています',

  // メールアドレス関連
  EMAIL_REQUIRED: 'メールアドレスを入力してください',
  EMAIL_INVALID_FORMAT: '有効なメールアドレスを入力してください',
  EMAIL_MAX_LENGTH: `メールアドレスは${PROFILE_VALIDATION_RULES.EMAIL_MAX_LENGTH}文字以内で入力してください`,

  // プロフィール画像URL
  AVATAR_INVALID_URL: '有効なURLを入力してください',
  AVATAR_INVALID_IMAGE: '画像のURLを入力してください',
};

// プロフィール画像ファイル
export const AVATAR_FILE_ERROR_MESSAGES = {
  FILE_REQUIRED: '画像ファイルを選択してください',
  FILE_TOO_LARGE: `画像ファイルは${AVATAR_FILE_RULES.MAX_SIZE / 1024 / 1024}MB以下にしてください`,
  INVALID_TYPE: '対応形式: JPEG, PNG, WebP',
};

export const PROFILE_PATTERNS = {
  NAME: /^[a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF\s]+$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  IMAGE_URL: /\.(jpg|jpeg|png|gif|webp)$/i,
};

// ========================================
// バリデーション関数
// ========================================

/**
 * 名前のバリデーション（プロフィール編集用）
 * @param {string} name - 検証する名前
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validateName = (name) => {
  const trimmedName = name?.trim() || '';

  if (!trimmedName) {
    return { isValid: false, message: PROFILE_ERROR_MESSAGES.NAME_REQUIRED };
  }

  if (trimmedName.length > PROFILE_VALIDATION_RULES.NAME_MAX_LENGTH) {
    return { isValid: false, message: PROFILE_ERROR_MESSAGES.NAME_MAX_LENGTH };
  }

  if (!PROFILE_PATTERNS.NAME.test(trimmedName)) {
    return { isValid: false, message: PROFILE_ERROR_MESSAGES.NAME_INVALID_CHARS };
  }

  return { isValid: true, message: '' };
};

/**
 * メールアドレスのバリデーション（プロフィール編集用）
 * @param {string} email - 検証するメールアドレス
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validateEmail = (email) => {
  const trimmedEmail = email?.trim() || '';

  if (!trimmedEmail) {
    return { isValid: false, message: PROFILE_ERROR_MESSAGES.EMAIL_REQUIRED };
  }

  if (!PROFILE_PATTERNS.EMAIL.test(trimmedEmail)) {
    return { isValid: false, message: PROFILE_ERROR_MESSAGES.EMAIL_INVALID_FORMAT };
  }

  if (trimmedEmail.length > PROFILE_VALIDATION_RULES.EMAIL_MAX_LENGTH) {
    return { isValid: false, message: PROFILE_ERROR_MESSAGES.EMAIL_MAX_LENGTH };
  }

  return { isValid: true, message: '' };
};

/**
 * プロフィール画像URLのバリデーション
 * @param {string} avatarUrl - 検証するURL
 * @returns {Object} { isValid: boolean, message: string }
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
    return { isValid: false, message: PROFILE_ERROR_MESSAGES.AVATAR_INVALID_URL };
  }

  // 画像URLかどうかのチェック（特定サービスは許可）
  const urlWithoutQuery = trimmedUrl.split('?')[0];
  const allowedServices = ['pexels.com', 'unsplash.com', 'gravatar.com'];
  const isAllowedService = allowedServices.some((service) => trimmedUrl.includes(service));

  if (!PROFILE_PATTERNS.IMAGE_URL.test(urlWithoutQuery) && !isAllowedService) {
    return { isValid: false, message: PROFILE_ERROR_MESSAGES.AVATAR_INVALID_IMAGE };
  }

  return { isValid: true, message: '' };
};

/**
 * プロフィール全体のバリデーション
 * @param {Object} profileData - プロフィールデータ
 * @returns {Object} { isValid: boolean, errors: object }
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

  // プロフィール画像URLのバリデーション
  const avatarResult = validateAvatarUrl(profileData.avatar);
  if (!avatarResult.isValid) {
    errors.avatar = avatarResult.message;
    isValid = false;
  }

  return { isValid, errors };
};

/**
 * プロフィール画像ファイルのバリデーション
 * @param {File} file - 検証するファイルオブジェクト
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validateAvatarFile = (file) => {
  if (!file) {
    return { isValid: false, message: AVATAR_FILE_ERROR_MESSAGES.FILE_REQUIRED };
  }

  // サイズチェック
  if (file.size > AVATAR_FILE_RULES.MAX_SIZE) {
    return { isValid: false, message: AVATAR_FILE_ERROR_MESSAGES.FILE_TOO_LARGE };
  }

  // 形式チェック (MIMEタイプ)
  if (!AVATAR_FILE_RULES.ALLOWED_TYPES.includes(file.type)) {
    return { isValid: false, message: AVATAR_FILE_ERROR_MESSAGES.INVALID_TYPE };
  }

  return { isValid: true, message: '' };
};

/**
 * リアルタイムバリデーション用のヘルパー
 * @param {string} fieldName - フィールド名
 * @param {any} value - 検証する値
 * @param {Object} allFormData - フォーム全体のデータ（将来的な拡張用）
 * @returns {string} エラーメッセージ（エラーがない場合は空文字）
 */
export const validateField = (fieldName, value, allFormData = {}) => {
  const validators = {
    name: () => validateName(value),
    email: () => validateEmail(value),
    avatar: () => validateAvatarUrl(value),
  };

  const validator = validators[fieldName];
  if (!validator) return '';

  const result = validator();
  return result.isValid ? '' : result.message;
};
