<template>
  <!-- セクション選択ドロップダウンコンポーネントのラッパー -->
  <div class="relative" ref="dropdownRef">
    <label class="block text-sm font-medium text-slate-700">学習セクション<span class="pl-1 text-red-500">*</span></label>
    <!-- セレクトボックス風の表示ボタン -->
    <button
      type="button"
      @click="handleButtonClick"
      class="flex items-center justify-between w-full px-3 py-2 mt-1 placeholder-gray-400 border rounded-md shadow-sm appearance-none focus:outline-none sm:text-sm hover:bg-gray-100"
      :class="[showBorder ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-violet-500 focus:border-violet-500']"
    >
      <span :class="selectedSection ? 'text-slate-900' : 'text-gray-400'">
        {{ selectedSection ? `${selectedSection.order}. ${selectedSection.title}` : '学習したセクションを選択' }}
      </span>
      <ChevronDownIcon :class="['w-5 h-5 text-gray-400 transition-transform duration-200', isDropdownOpen ? 'transform rotate-180' : '']" />
    </button>

    <!-- ドロップダウンメニューの表示/非表示アニメーション -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <!-- ドロップダウンメニュー本体 -->
      <div v-if="isDropdownOpen" class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
        <!-- 検索ボックス -->
        <div class="p-2 border-b border-gray-200">
          <div class="relative">
            <MagnifyingGlassIcon class="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input ref="searchInput" v-model="searchQuery" type="text" placeholder="セクション名で検索..." class="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-violet-500" @click.stop />
          </div>
        </div>
        <!-- 選択肢リスト -->
        <div class="overflow-y-auto max-h-60">
          <button v-for="section in filteredSections" :key="section.id" type="button" @click="selectSection(section)" class="flex items-center w-full px-3 py-2 text-left transition-colors hover:bg-violet-50" :class="{ 'bg-violet-100': modelValue === section.id }">
            <span class="flex-1">{{ section.order }}. {{ section.title }}</span>
            <CheckIcon v-if="modelValue === section.id" class="w-4 h-4 text-violet-600" />
          </button>
          <div v-if="searchQuery && filteredSections.length === 0" class="px-3 py-8 text-center">
            <p class="text-sm text-gray-500">「{{ searchQuery }}」に一致するセクションが見つかりません</p>
          </div>
          <div v-if="!searchQuery && filteredSections.length === 0" class="px-3 py-8 text-center">
            <p class="text-sm text-gray-500">セクションを検索してください</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { ChevronDownIcon, CheckIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/solid';

// ========================================
// 初期設定
// ========================================
const props = defineProps({
  modelValue: Number,
  sections: Array,
  hasError: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'modified']);

// ========================================
// 状態管理
// ========================================
// UI状態
// ドロップダウンの開閉状態を管理
const isDropdownOpen = ref(false);
// 検索クエリを管理
const searchQuery = ref('');
// フォームが変更されたかどうかを追跡し、バリデーション表示を制御
const isModified = ref(false);
// DOM要素への参照を保持
const searchInput = ref(null);
const dropdownRef = ref(null);

// ========================================
// 算出プロパティ
// ========================================
// エラー状態と変更フラグに基づいて、入力フィールドのボーダー表示を制御
const showBorder = computed(() => {
  return props.hasError && !isModified.value;
});

// 現在選択されているセクションオブジェクトを特定
const selectedSection = computed(() => props.sections.find((s) => s.id === props.modelValue));

// 検索クエリに基づいてセクションリストをフィルタリング
const filteredSections = computed(() => {
  if (!searchQuery.value) {
    return props.sections;
  }
  const query = searchQuery.value.toLowerCase();
  return props.sections.filter((section) => section.title.toLowerCase().includes(query));
});

// ========================================
// ライフサイクル
// ========================================
// コンポーネントマウント時にイベントリスナーを設定
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleEscKey);
});

// コンポーネントアンマウント時にイベントリスナーを解除
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleEscKey);
});

// ========================================
// ウォッチャー
// ========================================
// hasErrorプロップの変更を監視し、エラーが新しく発生した場合はisModifiedフラグをリセット
watch(
  () => props.hasError,
  (newValue) => {
    if (newValue) {
      isModified.value = false;
    }
  }
);

// ========================================
// メソッド
// ========================================
// イベントハンドラ
// ボタンクリック時にisModifiedフラグを立て、ドロップダウンの開閉を制御
const handleButtonClick = async () => {
  isModified.value = true;
  emit('modified');
  toggleDropdown();
};

// ドロップダウンの表示状態を切り替え、検索入力フィールドにフォーカスを設定
const toggleDropdown = async () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  if (isDropdownOpen.value) {
    await nextTick(); // DOM更新後に検索フィールドにフォーカス
    searchInput.value?.focus();
  } else {
    searchQuery.value = ''; // ドロップダウンを閉じる際に検索クエリをクリア
  }
};

// セクション選択時にisModifiedフラグを立て、選択されたセクションIDを親コンポーネントに通知
const selectSection = (section) => {
  isModified.value = true;
  emit('modified');
  emit('update:modelValue', section.id);
  isDropdownOpen.value = false; // ドロップダウンを閉じる
  searchQuery.value = ''; // 検索クエリをクリア
};

// ドロップダウン外のクリックを検出し、ドロップダウンを閉じる
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false;
    searchQuery.value = ''; // ドロップダウンを閉じる際に検索クエリをクリア
  }
};

// ESCキーが押されたときにドロップダウンを閉じる
const handleEscKey = (event) => {
  if (event.key === 'Escape' && isDropdownOpen.value) {
    isDropdownOpen.value = false;
    searchQuery.value = ''; // 検索クエリをクリア
  }
};
</script>
