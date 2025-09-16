<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
    <!-- ヘッダー -->
    <AppHeader @toggle-mobile-menu="toggleMobileMenu" />

    <!-- サイドバー -->
    <AppSidebar :is-open="isMobileMenuOpen" @close-mobile-menu="closeMobileMenu" />

    <!-- メインコンテンツ -->
    <main class="min-h-screen pt-20 duration-300 md:pt-24 md:pl-16 transition-padding">
      <div class="px-4 sm:px-6 lg:px-8">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { ref, computed, onMounted } from 'vue';

// ========================================
// 内部インポート
// ========================================
// コンポーネント
import AppHeader from '../components/common/AppHeader.vue';
import AppSidebar from '../components/common/AppSidebar.vue';

// Piniaストア
import { useAuthStore } from '@/stores/auth';

// ========================================
// 初期設定
// ========================================
const authStore = useAuthStore();

// ========================================
// 状態管理
// ========================================
const user = computed(() => authStore.authUser);

// モバイルメニューの開閉状態を管理
const isMobileMenuOpen = ref(false);

// ========================================
// ライフサイクル
// ========================================
// ユーザー情報の取得を確実に行う（追加）
onMounted(async () => {
  if (!authStore.authUser) {
    await authStore.fetchUser();
  }
});

// ========================================
// メソッド
// ========================================
// イベントハンドラ
// モバイルメニューの表示/非表示を切り替える
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// モバイルメニューを閉じる
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};
</script>
