/**
 * 日時を「YYYY年MM月DD日 HH:mm」形式に変換
 * @param {string | Date} dateInput - 日付を表す文字列またはDateオブジェクト
 * @returns {string} フォーマットされた日時文字列
 */
export const formatDateTime = (dateInput) => {
  if (!dateInput) return 'N/A';
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}年${month}月${day}日 ${hours}:${minutes}`;
};

/**
 * 日付を「YYYY年MM月DD日」形式に変換
 * @param {string | Date} dateInput - 日付を表す文字列またはDateオブジェクト
 * @returns {string} フォーマットされた日付文字列
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return 'N/A';
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
};

/**
 * 時刻を「HH:mm」形式に変換
 * @param {string | Date} dateInput - 日付を表す文字列またはDateオブジェクト
 * @returns {string} フォーマットされた時刻文字列
 */
export const formatTimeOnly = (dateInput) => {
  if (!dateInput) return 'N/A';
  const date = new Date(dateInput);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * 分を「X時間Y分」形式に変換
 * @param {number} totalMinutes - 合計分数
 * @returns {string} フォーマットされた時間文字列
 */
export const formatMinutes = (totalMinutes) => {
  if (totalMinutes === 0) return '0分';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  let result = '';
  if (hours > 0) {
    result += `${hours}時間`;
  }
  if (minutes > 0) {
    result += `${minutes}分`;
  }
  return result;
};
