<template>
  <component :is="layout">
    <router-view />
  </component>
  <Teleport to="body">
    <GlobalErrorModal />
  </Teleport>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed } from 'vue';

// ========================================
// 内部インポート
// ========================================
// Piniaストア
import { useAuthStore } from '@/stores/auth';

// コンポーネント
import AuthLayout from '@/layouts/AuthLayout.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import GlobalErrorModal from '@/components/common/GlobalErrorModal.vue';

// ========================================
// 初期設定
// ========================================
const authStore = useAuthStore();

// ========================================
// 算出プロパティ
// ========================================
const layout = computed(() => {
  return authStore.isLoggedIn ? DefaultLayout : AuthLayout;
});
</script>
