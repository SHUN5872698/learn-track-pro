<template>
  <!-- モバイル用オーバーレイ -->
  <Transition enter-active-class="transition-opacity duration-300 ease-in-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300 ease-in-out" leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div v-if="isOpen" class="fixed inset-0 z-30 bg-black bg-opacity-30 backdrop-blur-sm md:hidden" @click="$emit('close-mobile-menu')"></div>
  </Transition>

  <!-- サイドバー本体 -->
  <!-- デスクトップ: 常に表示、top-16から始まる -->
  <!-- モバイル: isOpenの時のみ表示、top-0から始まる -->
  <aside
    class="fixed left-0 z-40 transition-all duration-300 ease-in-out border-r border-gray-100 shadow-xl bg-white/70 backdrop-blur-md top-0 h-full w-64 group md:top-16 md:h-[calc(100vh-4rem)] md:w-16 md:hover:w-64"
    :class="[
      // モバイルのみの動的クラス
      isOpen ? 'translate-x-0' : '-translate-x-full',
      // デスクトップでは常に表示
      'md:translate-x-0',
    ]"
  >
    <!-- モバイル用ヘッダー（デスクトップでは非表示） -->
    <div class="flex items-center justify-between h-16 px-4 md:hidden">
      <h1 class="text-xl font-bold text-transparent bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text">LearnTrack Pro</h1>
      <button @click="$emit('close-mobile-menu')" class="p-2 -mr-2 text-gray-500 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-violet-500">
        <XMarkIcon class="w-6 h-6" />
      </button>
    </div>

    <!-- ナビゲーション -->
    <nav class="px-4 mt-8">
      <ul class="space-y-2">
        <li v-for="item in menuItems" :key="item.id">
          <a href="#" :class="['relative flex items-center py-3 text-sm font-medium rounded-2xl transition-all duration-200', item.active ? 'text-white' : 'text-gray-600 hover:bg-gray-50/50 hover:text-gray-900']" @click.prevent="handleMenuItemClick(item)">
            <!-- アクティブ時のグラデーション背景を独立した要素として配置 -->
            <!-- アイコンとテキストの前面表示を保証するため、背景を独立した要素として配置 -->
            <div v-if="item.active" class="absolute top-0 bottom-0 shadow-lg left-2 -right-2 bg-gradient-to-r from-violet-600 to-violet-700 rounded-2xl"></div>
            <!-- アイコンとテキストはz-indexで前面に表示 -->
            <!-- 背景の上にアイコンとテキストを重ねるため、z-indexを適用 -->
            <div class="relative z-10 flex items-center pl-3">
              <component :is="item.iconComponent" :class="['h-5 w-5 flex-shrink-0', item.active ? 'text-white' : 'text-gray-400 group-hover:text-violet-500']" />
              <!-- サイドバー展開時にテキストをフェードイン表示するため、opacityとvisibilityを制御 -->
              <span class="ml-3 whitespace-nowrap md:opacity-0 md:invisible md:transition-opacity md:duration-300 md:ease-in-out md:group-hover:opacity-100 md:group-hover:visible">
                {{ item.name }}
              </span>
            </div>
          </a>
        </li>
      </ul>

      <!-- 学習統計情報を表示するセクション -->
      <!-- サイドバー展開時に統計情報を表示するため、opacityとvisibilityを制御 -->
      <div class="px-4 py-4 mt-8 bg-gradient-to-br from-violet-50 to-emerald-50 rounded-2xl md:invisible md:opacity-0 md:transition-opacity md:duration-300 md:ease-in-out md:group-hover:opacity-100 md:group-hover:visible">
        <h3 class="mb-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">学習統計</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">完了コース</span>
            <span class="text-sm font-semibold text-transparent bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text">
              {{ completedCoursesCount }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">平均進捗</span>
            <span class="text-sm font-semibold text-transparent bg-gradient-to-r from-emerald-600 to-violet-600 bg-clip-text"> {{ averageProgress }}% </span>
          </div>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { ref, watch, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { BookOpenIcon, DocumentChartBarIcon, UserCircleIcon, ArrowLeftStartOnRectangleIcon, XMarkIcon } from '@heroicons/vue/24/solid';

// ========================================
// 内部インポート
// ========================================
// Piniaストア
import { useAuthStore } from '@/stores/auth';

// コンポーザブル
import { useLearningData } from '../../composables/useLearningData';

// ========================================
// Props & Emits
// ========================================
const props = defineProps({
  isOpen: Boolean, // モバイルメニューの開閉状態
});

const emit = defineEmits(['close-mobile-menu']);

// ========================================
// 初期設定
// ========================================
// Piniaストア実行
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const { learningContents } = useLearningData();

// ========================================
// ライフサイクル
// ========================================
onMounted(async () => {
  if (!authStore.authUser) {
    await authStore.fetchUser();
  }
});

// ========================================
// 状態管理
// ========================================
// メニューアイテム
const menuItems = ref([
  {
    id: 'learning',
    name: '学習内容',
    iconComponent: BookOpenIcon,
    path: '/dashboard',
    active: true,
    action: () => router.push('/dashboard'),
  },
  {
    id: 'reports',
    name: '学習レポート',
    iconComponent: DocumentChartBarIcon,
    path: '/reports',
    active: false,
    action: () => router.push('/reports'),
  },
  {
    id: 'profile',
    name: 'プロフィール',
    iconComponent: UserCircleIcon,
    path: '/profile',
    active: false,
    action: () => router.push('/profile'),
  },
  {
    id: 'logout',
    name: 'ログアウト',
    iconComponent: ArrowLeftStartOnRectangleIcon,
    active: false,
    action: async () => {
      await authStore.logout();
    },
  },
]);

// ========================================
// 算出プロパティ
// ========================================
// 統計情報 - 完了コース数
const completedCoursesCount = computed(() => {
  return learningContents.value.filter((content) => content.status === 'completed').length;
});

// 統計情報 - 全体進捗
const averageProgress = computed(() => {
  if (learningContents.value.length === 0) return 0;
  const total = learningContents.value.reduce((sum, content) => sum + content.progress, 0);
  return Math.round(total / learningContents.value.length);
});

// ========================================
// ウォッチャー
// ========================================
// ルート変更監視: 現在のパスに基づいてアクティブなメニューアイテムを更新
watch(
  () => route.path,
  (newPath) => {
    menuItems.value.forEach((item) => {
      item.active = item.path === newPath || (item.path === '/dashboard' && newPath === '/');
    });
  },
  { immediate: true } // コンポーネント初期化時にも即座に実行
);

// ========================================
// メソッド
// ========================================
// イベントハンドラ
// メニューアイテムクリック時の処理: アクティブ状態を切り替え、関連するアクションを実行
const handleMenuItemClick = (item) => {
  // クリックされたアイテムをアクティブにし、他のアイテムを非アクティブにする
  menuItems.value.forEach((menuItem) => {
    menuItem.active = menuItem.id === item.id;
  });

  // アイテムにアクションが定義されていれば実行
  if (item.action) {
    item.action();
    // モバイルメニューが開いている場合は閉じる
    if (props.isOpen) {
      emit('close-mobile-menu');
    }
  }
};
</script>
