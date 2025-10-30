import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

export const useUser = () => {
  const authStore = useAuthStore();

  const user = computed(
    () =>
      authStore.authUser || {
        id: 1,
        name: 'ゲストユーザー',
        email: 'guest@example.com',
        avatar: null,
      }
  );

  // プロフィール更新機能（authStoreへ転送）
  const updateUserProfile = async (updatedData) => {
    try {
      console.log('Updating user profile with:', updatedData);
      const result = await authStore.updateProfile(updatedData);
      return result;
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

  return {
    user: user.value,
    updateUserProfile,
    getUserInitials,
  };
};
