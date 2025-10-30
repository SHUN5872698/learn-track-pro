<template>
  <header class="fixed top-0 left-0 right-0 z-30 h-16 border-b shadow-sm bg-white/95 backdrop-blur-md border-slate-200/50">
    <div class="flex items-center justify-between h-full px-4">
      <!-- モバイルメニューボタン -->
      <button @click="$emit('toggle-mobile-menu')" class="p-2 -ml-2 text-gray-500 rounded-md md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-violet-500">
        <Bars3Icon class="w-6 h-6" />
      </button>

      <!-- ロゴ -->
      <div class="flex-1 text-center md:text-left md:ml-20">
        <h1 class="text-xl font-bold text-transparent md:text-2xl bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text">LearnTrack Pro</h1>
      </div>

      <!-- ユーザー情報 -->
      <div class="flex items-center">
        <router-link to="/profile" class="flex items-center space-x-3 group">
          <UserAvatar :user="user" size="sm" class="transition-all duration-200 ring-2 ring-violet-100 group-hover:ring-violet-300" />
          <div class="hidden md:block">
            <div class="text-sm font-medium transition-all duration-200 text-slate-700 group-hover:text-violet-600">
              {{ user.name }}
            </div>
            <div class="text-xs transition-all duration-200 text-slate-500 group-hover:text-violet-500">
              {{ user.email }}
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed, onMounted } from 'vue';
import { Bars3Icon } from '@heroicons/vue/24/solid';

// ========================================
// 内部インポート
// ========================================
// Piniaストア
import { useAuthStore } from '@/stores/auth';

// コンポーネント
import UserAvatar from '@/components/common/UserAvatar.vue';

// ========================================
// 初期設定
// ========================================
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

defineEmits(['toggle-mobile-menu']);
</script>
