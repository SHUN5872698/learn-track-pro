<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
    <!-- ヘッダー -->
    <AppHeader :user="user" @toggle-mobile-menu="toggleMobileMenu" />

    <!-- サイドバー -->
    <AppSidebar :user="user" :is-open="isMobileMenuOpen" @close-mobile-menu="closeMobileMenu" />

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
import { ref } from 'vue';

// ========================================
// 内部インポート
// ========================================
// コンポーネント
import AppHeader from '../components/common/AppHeader.vue';
import AppSidebar from '../components/common/AppSidebar.vue';

// コンポーザブル
import { useUser } from '../composables/useUser';

// ========================================
// 初期設定
// ========================================
// コンポーザブル実行
const { user } = useUser();

// ========================================
// 状態管理
// ========================================
// モバイルメニューの開閉状態を管理
const isMobileMenuOpen = ref(false);

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
