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
  // ログイン状態からログアウト状態に変わった時
  if (oldValue === true && newValue === false) {
    console.log('🔄 ログアウトを検知、ログインページへリダイレクト');
    router.push('/login');
  }
  // ログアウト状態からログイン状態に変わった時
  else if (oldValue === false && newValue === true) {
    console.log('🔄 ログインを検知、ダッシュボードへリダイレクト');
    router.push('/dashboard');
  }
});

// 初回マウント時の状態チェック
// ページリロード時などに適切なページへリダイレクト
if (!authStore.isLoggedIn) {
  const protectedRoutes = ['/dashboard', '/profile', '/reports'];
  if (protectedRoutes.some((route) => window.location.pathname.startsWith(route))) {
    router.push('/login');
  }
}
</script>
