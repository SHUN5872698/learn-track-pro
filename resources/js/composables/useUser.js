import { reactive } from 'vue';
import { mockUsers, currentUserId } from '../composables/data/mockUsers';

const userData = mockUsers.value.find((u) => u.id === currentUserId.value);
const user = reactive({ ...userData });

export const useUser = () => {
  // プロフィール更新機能
  const updateUserProfile = (updatedData) => {
    try {
      console.log('Updating user profile with:', updatedData);
      Object.assign(user, updatedData);

      // モックデータも更新
      const userIndex = mockUsers.value.findIndex((u) => u.id === currentUserId.value);
      if (userIndex !== -1) {
        Object.assign(mockUsers.value[userIndex], updatedData);
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to update user profile:', error);
      return { success: false, message: 'プロフィールの更新に失敗しました。' };
    }
  };

  // ユーザーのイニシャルを生成
  const getUserInitials = (name) => {
    if (!name) return '';
    const trimmedName = name.trim();
    const hasJapanese = /[　-〿぀-ゟ゠-ヿ一-鿿]/.test(trimmedName);

    if (hasJapanese) {
      return trimmedName.substring(0, 2);
    } else {
      const parts = trimmedName.split(' ').filter((part) => part.length > 0);
      if (parts.length > 1) {
        return parts.map((part) => part.charAt(0).toUpperCase()).join('');
      } else if (trimmedName.length > 1) {
        return trimmedName.substring(0, 2).toUpperCase();
      } else {
        return trimmedName.toUpperCase();
      }
    }
  };

  // パスワード更新機能（モック）
  const updatePassword = (passwordData) => {
    try {
      console.log('Updating password with:', passwordData);
      // ここに実際のAPIコールロジックを追加
      // 例: await api.post('/user/password', passwordData);
      return { success: true, message: 'パスワードを更新しました。' };
    } catch (error) {
      console.error('Failed to update password:', error);
      return { success: false, message: 'パスワードの更新に失敗しました。' };
    }
  };

  return {
    user,
    updateUserProfile,
    getUserInitials,
    updatePassword,
  };
};
