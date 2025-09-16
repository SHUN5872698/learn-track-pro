<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';

// ========================================
// 内部インポート
// ========================================
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { useAuthStore } from '@/stores/auth';

// ========================================
// 初期設定
// ========================================
const authStore = useAuthStore();
const router = useRouter();

// ========================================
// 算出プロパティ
// ========================================
const layout = computed(() => {
  return authStore.isLoggedIn ? DefaultLayout : AuthLayout;
});

const isLoggedIn = computed(() => authStore.isLoggedIn);

// ========================================
// ライフサイクル
// ========================================
// ログアウトを検知してリダイレクト
watch(isLoggedIn, (newValue, oldValue) => {
  // ログイン状態からログアウト状態に変わった時のみ
  if (oldValue === true && newValue === false) {
    console.log('🔄 ログアウトを検知、ログインページへリダイレクト');
    router.push('/login');
  }
});
</script>
