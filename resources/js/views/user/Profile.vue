<template>
  <!-- プロフィールコンポーネント -->
  <DetailLayout>
    <!-- ユーザー情報がある場合のみ表示 -->
    <div v-if="authStore.authUser">
      <h2 class="mb-2 text-2xl font-bold text-slate-800">プロフィール</h2>

      <!-- アバター部 -->
      <div class="flex justify-center mb-6">
        <UserAvatar :user="user" size="lg" />
      </div>

      <!-- ユーザー情報: 名前、メールアドレス、登録日を表示 -->
      <div class="space-y-2 text-center">
        <h3 class="text-2xl font-bold text-slate-900">{{ user.name }}</h3>
        <p class="text-gray-600">{{ user.email }}</p>
        <p v-if="user.created_at" class="text-sm text-gray-500">登録日: {{ new Date(user.created_at).toLocaleDateString('ja-JP') }}</p>
      </div>
    </div>

    <!-- 読み込み中の表示 -->
    <div v-else class="flex items-center justify-center p-12">
      <p class="text-gray-500">読み込み中...</p>
    </div>

    <template #actions>
      <BaseButton v-if="authStore.authUser" to="/profile/edit" variant="primary" :left-icon="PencilIcon"> 編集 </BaseButton>
    </template>
  </DetailLayout>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed, onMounted } from 'vue';
import { PencilIcon } from '@heroicons/vue/24/outline';

// ========================================
// 内部インポート
// ========================================
// Piniaストア
import { useAuthStore } from '@/stores/auth';

// コンポーネント
import DetailLayout from '@/layouts/DetailLayout.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import UserAvatar from '@/components/common/UserAvatar.vue';

// ========================================
// 初期設定
// ========================================
// コンポーザブル
const authStore = useAuthStore();

// ========================================
// 算出プロパティ
// ========================================
const user = computed(() => authStore.authUser || {});

// ========================================
// ライフサイクル
// ========================================
onMounted(async () => {
  // ログアウト中は処理をスキップ
  if (!authStore.isLoggedIn) {
    return;
  }

  // データが読み込まれていない場合は先に読み込む
  if (!authStore.authUser) {
    await authStore.fetchUser();
  }
});
</script>
