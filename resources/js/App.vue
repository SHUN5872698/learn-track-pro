<template>
  <component :is="layout">
    <router-view />
  </component>
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

import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { useAuthStore } from '@/stores/auth';

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
