<template>
  <!-- プロフィールコンポーネント -->
  <DetailLayout title="プロフィール">
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

    <template #actions>
      <BaseButton to="/profile/edit" variant="primary" :left-icon="PencilIcon"> 編集 </BaseButton>
    </template>
  </DetailLayout>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { PencilIcon } from '@heroicons/vue/24/outline';

// ========================================
// 内部インポート
// ========================================
// Piniaストア
import { useAuthStore } from '@/stores/auth';

// コンポーネント
import BaseButton from '@/components/common/BaseButton.vue';
import DetailLayout from '@/layouts/DetailLayout.vue';
import UserAvatar from '@/components/common/UserAvatar.vue';

// ========================================
// 初期設定
// ========================================
const router = useRouter();
const authStore = useAuthStore();

// ========================================
// 状態管理
// ========================================
const user = computed(() => authStore.authUser || {});

// ========================================
// ライフサイクル
// ========================================
onMounted(async () => {
  if (!authStore.authUser) {
    await authStore.fetchUser();
  }
});
</script>
