import { ref } from 'vue';

export const mockUsers = ref([
  {
    id: 1,
    name: 'TaroYamada',
    email: 'taro.yamada@example.com',
    avatar: 'storage/images/avatars/pexels-photo-614810.png',
    // avatar: null,
    email_verified_at: '2024-01-15T00:00',
    created_at: '2024-01-15T00:00',
    updated_at: '2025-09-06T12:00',
    totalProgress: 67, // 動的な値にするにはバックエンドAPIからユーザー情報を取得が必要
    completedCourses: 2, // 動的な値にするにはバックエンドAPIからユーザー情報を取得が必
  },
]);

// 現在のログインユーザーID
export const currentUserId = ref(1);
