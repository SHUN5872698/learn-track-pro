<template>
  <!-- 学習コンテンツカードコンポーネント -->
  <div @click="navigateToDetail" class="p-6 transition-all duration-300 transform border shadow-lg cursor-pointer bg-white/70 backdrop-blur-md rounded-2xl hover:shadow-xl animate-fade-in border-white/20 hover:scale-105">
    <!-- カードヘッダー -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <h3 class="mb-2 text-lg font-semibold text-slate-900">{{ content.title }}</h3>
        <!-- 技術とステータス情報 -->
        <div class="space-y-1 text-slate-600">
          <div class="flex items-center space-x-1 text-xs">
            <span class="font-medium">技術:</span>
            <img v-if="displayTechnology.icon" :src="displayTechnology.icon" :alt="displayTechnology.name" class="w-5 h-5 mr-1" />
            <span class="font-medium">{{ displayTechnology.name }}</span>
          </div>
          <div class="flex items-center space-x-1 text-xs">
            <span class="font-medium">ステータス:</span>
            <div class="flex items-center font-medium" :class="statusDisplay.class">
              <component :is="statusDisplay.icon" class="w-5 h-5 mr-1" />
              {{ statusDisplay.text }}
            </div>
          </div>
        </div>
      </div>

      <!-- 三点リーダーメニュー -->
      <div class="relative ml-4">
        <BaseButton ref="menuButtonRef" @click.stop="toggleMenu" variant="icon" size="md" shape="rounded" :icon-only="true" tooltip="メニューを表示" :class="{ 'bg-slate-200 text-slate-600': isMenuOpen }">
          <EllipsisHorizontalIcon class="w-5 h-5" />
        </BaseButton>

        <!-- ドロップダウンメニュー -->
        <div ref="dropdownMenuRef" v-if="isMenuOpen" class="absolute right-0 z-10 w-32 py-2 mt-1 border shadow-xl bg-white/90 backdrop-blur-md border-slate-200/50 rounded-xl top-full animate-scale-in">
          <template v-for="item in menuItems" :key="item.name">
            <hr v-if="item.separator" class="my-1 border-slate-100" />
            <button @click.stop="item.action" :class="['flex items-center w-full px-4 py-2 mx-1 text-sm text-left transition-all duration-150 rounded-lg', getMenuItemClass(item)]">
              <component :is="item.iconComponent" class="w-4 h-4 mr-2" />
              {{ item.name }}
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- 進捗表示セクション -->
    <div class="mb-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-slate-700">進捗</span>
        <span class="text-sm font-semibold text-transparent bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text">{{ content.progress }}%</span>
      </div>
      <div class="w-full h-3 rounded-full bg-slate-200">
        <div class="h-3 transition-all duration-500 rounded-full shadow-sm bg-gradient-to-r from-violet-500 to-emerald-500" :style="{ width: content.progress + '%' }"></div>
      </div>
      <!-- 進捗バーの下にセクション数と総学習時間を横並びで表示 -->
      <div class="flex items-center justify-between mt-4 text-sm text-slate-600">
        <div class="flex items-center space-x-1">
          <span class="font-medium text-violet-600">{{ content.completed_sections }}</span>
          / {{ content.total_sections }} セクション完了
        </div>
        <div v-if="content.totalStudyMinutes > 0" class="flex items-center space-x-1">
          <ClockIcon class="w-4 h-4 mr-1" />
          総学習時間: {{ formatMinutes(content.totalStudyMinutes) }}
        </div>
      </div>
    </div>

    <!-- カードフッター -->
    <div class="flex items-center justify-between pt-4 border-t border-slate-100">
      <div class="text-xs text-slate-500">最終学習日: {{ content.latestSessionUpdatedAt ? formatDate(content.latestSessionUpdatedAt) : '-' }}</div>
      <button
        @click.stop="navigateToAddRecord"
        :disabled="content.totalSections === 0"
        :class="['flex items-center px-2 py-1 text-xs font-medium transition-all duration-200 rounded-lg', content.totalSections === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-violet-600 hover:bg-violet-100 hover:text-violet-800']"
      >
        <PlusCircleIcon class="w-4 h-4 mr-1" />
        記録を追加
      </button>
    </div>
  </div>

  <!-- 削除確認モーダル -->
  <ConfirmModal :is-open="isModalOpen" :item-name="content.title" :is-submitting="isSubmitting" @confirm="confirmDelete" @cancel="cancelDelete" />
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { PencilIcon, InformationCircleIcon, TrashIcon, ClockIcon, CheckCircleIcon, ArrowPathIcon, EllipsisHorizontalIcon, PlayCircleIcon, DocumentIcon, PlusCircleIcon, ChartBarIcon } from '@heroicons/vue/24/solid';

// ========================================
// 内部インポート
// ========================================
// コンポーザブル
import { useLearningData } from '@/composables/useLearningData';

// コンポーネント
import ConfirmModal from '@/components/common/ConfirmModal.vue';
import BaseButton from '@/components/common/BaseButton.vue';

// Piniaストア
import { useMasterDataStore } from '@/stores/masterData';

// ========================================
// Props定義
// ========================================
const props = defineProps({
  content: Object, // 表示する学習コンテンツデータ
});

// ========================================
// 初期設定
// ========================================
const router = useRouter();

// ========================================
// コンポーザブルの実行
// ========================================
const { completeContent, reopenContent, activeMenuId, setActiveMenu, deleteLearningContent, technologies } = useLearningData();

const masterDataStore = useMasterDataStore();

// ========================================
// 状態管理
// ========================================
// UI状態
const isSubmitting = ref(false);
const isModalOpen = ref(false); // 削除確認モーダルの表示状態を管理
const menuButtonRef = ref(null); // 三点リーダーメニューボタンのDOM要素への参照
const dropdownMenuRef = ref(null); // ドロップダウンメニューのDOM要素への参照

// ========================================
// 算出プロパティ
// ========================================
// 学習ステータスに対応する表示設定（テキスト、CSSクラス、アイコンコンポーネント）を定義
const STATUS_CONFIGS = {
  completed: {
    text: '完了済',
    class: 'text-emerald-600',
    icon: CheckCircleIcon,
  },
  in_progress: {
    text: '学習中',
    class: 'text-blue-600',
    icon: PlayCircleIcon,
  },
  not_started: {
    text: '未着手',
    class: 'text-slate-500',
    icon: DocumentIcon,
  },
};

// 学習コンテンツの現在のステータスに基づいて、表示用のテキスト、クラス、アイコンを動的に決定
const statusDisplay = computed(() => {
  if (!props.content) return { text: '', class: '', icon: null };

  const config = STATUS_CONFIGS[props.content.status];
  if (config) return config;

  // 定義されていないステータスの場合のデフォルト値
  return {
    text: props.content.status,
    class: 'text-slate-500',
    icon: DocumentIcon,
  };
});

// 現在の学習コンテンツのIDがアクティブなメニューIDと一致するかどうかで、メニューの開閉状態を判断
const isMenuOpen = computed(() => activeMenuId.value === props.content.id);

// 学習コンテンツのステータスや進捗に応じて、三点リーダーメニューの項目を動的に生成
const menuItems = computed(() => {
  // 全てのコンテンツに共通する基本メニュー項目
  const baseItems = [
    {
      name: '編集',
      iconComponent: PencilIcon,
      action: handleEdit,
    },
    {
      name: '詳細',
      iconComponent: InformationCircleIcon,
      action: handleDetails,
    },
    {
      name: 'レポート',
      iconComponent: ChartBarIcon,
      action: handleProgressDetails,
    },
  ];

  // コンテンツのステータスによって追加されるメニュー項目
  const statusItems = [];

  // コンテンツが「完了済み」の場合、「学習を再開」オプションを追加
  if (props.content.status === 'completed') {
    statusItems.push({
      name: '学習を再開',
      iconComponent: ArrowPathIcon,
      action: handleReopen,
      primary: true, // スタイル適用のため
    });
  }
  // コンテンツの進捗が100%だが、まだ「完了済み」ではない場合、「完了にする」オプションを追加
  else if (props.content.progress === 100) {
    statusItems.push({
      name: '完了にする',
      iconComponent: CheckCircleIcon,
      action: handleComplete,
      primary: true, // スタイル適用のため
    });
  }

  // 常に表示される削除オプション（メニューの最後にセパレータ付きで配置）
  const deleteItem = {
    name: '削除',
    iconComponent: TrashIcon,
    action: handleDelete,
    danger: true, // 危険なアクションであることを示すスタイル適用のため
    separator: true, // メニュー項目を視覚的に区切るため
  };
  // 生成された全てのメニュー項目を結合して返す
  return [...baseItems, ...statusItems, deleteItem];
});

// 技術アイコンと名前を表示するための算出プロパティ
const displayTechnology = computed(() => {
  const tech = masterDataStore.getTechnologyById(props.content.technology_id);
  return tech || { name: '不明', icon: '' };
});

// ========================================
// ライフサイクル
// ========================================
// コンポーネントがマウントされた時に、ドキュメント全体へのクリックイベントリスナーを登録
onMounted(() => document.addEventListener('click', handleClickOutside));
// コンポーネントがアンマウントされた時に、ドロップダウンメニュー外のクリックイベントリスナーを解除
onUnmounted(() => document.removeEventListener('click', handleClickOutside));

// ========================================
// メソッド
// ========================================
// メニューアイテムのタイプ（danger, primary）に基づいて、対応するCSSクラスを返す
const getMenuItemClass = (item) => {
  if (item.danger) {
    return 'text-red-600 hover:bg-red-50'; // 削除アクションのスタイル
  }
  if (item.primary && item.name === '学習を再開') {
    return 'text-blue-600 font-medium'; // 学習再開アクションのスタイル
  }
  if (item.primary && item.name === '完了にする') {
    return 'text-emerald-600 font-medium'; // 完了アクションのスタイル
  }
  return 'text-slate-700 hover:bg-slate-50'; // デフォルトのスタイル
};

// 分単位の合計時間を「X時間Y分」形式の文字列に変換
const formatMinutes = (totalMinutes) => {
  if (totalMinutes === 0) return '0分'; // 0分の場合は「0分」と表示
  const hours = Math.floor(totalMinutes / 60); // 時間を計算
  const minutes = totalMinutes % 60; // 分を計算
  let result = '';
  if (hours > 0) {
    result += `${hours}時間`; // 時間があれば追加
  }
  if (minutes > 0) {
    result += `${minutes}分`; // 分があれば追加
  }
  return result; // 整形された文字列を返す
};

// ISO形式の日付文字列を「YYYY年MM月DD日」形式に整形
const formatDate = (dateString) => {
  if (!dateString) return ''; // 日付文字列がない場合は空文字列を返す
  const date = new Date(dateString); // Dateオブジェクトに変換
  if (isNaN(date.getTime())) return ''; // 無効な日付の場合は空文字列を返す
  // 日本語ロケールで年、月、日を整形して返す
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// 学習コンテンツの詳細ページへ遷移
const navigateToDetail = () => {
  // 現在開いているメニューとクリックしたコンテンツが同じ場合は何もしない
  if (activeMenuId.value === props.content.id) return;
  router.push(`/learning/${props.content.id}`); // 詳細ページへルーティング
};

// 学習記録追加ページへ遷移
const navigateToAddRecord = () => {
  router.push(`/learning-contents/${props.content.id}/record`); // 記録追加ページへルーティング
};

// 三点リーダーメニューの開閉を切り替える
const toggleMenu = () => {
  if (isMenuOpen.value) {
    setActiveMenu(null); // メニューが開いている場合は閉じる
  } else {
    setActiveMenu(props.content.id); // メニューが閉じている場合は開く
  }
};

// メニューを閉じる
const closeMenu = () => {
  setActiveMenu(null); // アクティブなメニューをリセットして閉じる
};

// 学習コンテンツ編集ページへ遷移し、メニューを閉じる
const handleEdit = () => {
  router.push(`/learning/${props.content.id}/edit`); // 編集ページへルーティング
  closeMenu(); // メニューを閉じる
};

// 学習コンテンツ詳細ページへ遷移し、メニューを閉じる
const handleDetails = () => {
  closeMenu(); // メニューを閉じる
  router.push(`/learning/${props.content.id}`); // 詳細ページへルーティング
};

// 学習進捗レポートページへ遷移し、メニューを閉じる
const handleProgressDetails = () => {
  closeMenu(); // メニューを閉じる
  router.push(`/learning/${props.content.id}/progress`); // 進捗レポートページへルーティング
};

// 削除確認モーダルを開き、メニューを閉じる
const handleDelete = () => {
  closeMenu(); // メニューを閉じる
  isModalOpen.value = true; // 削除確認モーダルを表示
};

// 学習コンテンツを完了状態にし、メニューを閉じる
const handleComplete = () => {
  completeContent(props.content.id); // コンテンツを完了状態に更新
  closeMenu(); // メニューを閉じる
};

// 学習コンテンツを再開状態にし、メニューを閉じる
const handleReopen = () => {
  reopenContent(props.content.id); // コンテンツを再開状態に更新
  closeMenu(); // メニューを閉じる
};

// 削除確認モーダルで「削除」がクリックされた時の処理
const confirmDelete = async () => {
  console.log('削除が確認されました:', props.content.title);
  // ボタンの無効化
  isSubmitting.value = true;
  try {
    await deleteLearningContent(props.content.id); // 実際の削除処理
    isModalOpen.value = false;
  } catch (error) {
    console.error('削除処理に失敗しました:', error);
  } finally {
    // ボタンを再び有効化
    isSubmitting.value = false;
  }
};

// 削除確認モーダルで「キャンセル」がクリックされた時の処理
const cancelDelete = () => {
  console.log('削除がキャンセルされました'); // 削除がキャンセルされたことをログに出力
  isModalOpen.value = false; // モーダルを閉じる
};

// ドロップダウンメニュー外をクリックしたときにメニューを閉じる
const handleClickOutside = (event) => {
  const target = event.target; // クリックされた要素
  // アクティブなメニューがあり、かつクリックされた要素がメニューボタンでもドロップダウンメニュー内でもない場合
  if (activeMenuId.value !== null && menuButtonRef.value && dropdownMenuRef.value && !menuButtonRef.value.rootElement.contains(target) && !dropdownMenuRef.value.contains(target)) {
    setActiveMenu(null); // メニューを閉じる
  }
};
</script>
