<template>
  <!-- セクション選択ドロップダウンコンポーネントのラッパー -->
  <div class="relative" ref="dropdownRef">
    <label class="block text-sm font-medium text-slate-700">学習セクション<span class="pl-1 text-red-500">*</span></label>
    <!-- セレクトボックス風の表示ボタン -->
    <button
      type="button"
      @click="handleButtonClick"
      :class="['flex items-center justify-between w-full px-3 py-2 mt-1 text-left bg-white border rounded-md shadow-sm focus:outline-none sm:text-sm', showBorder ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-violet-500 focus:border-violet-500']"
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
// Props & Emits
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
// UI状態管理
const isDropdownOpen = ref(false);
const searchQuery = ref('');

// 入力状態管理
const isModified = ref(false);

// ========================================
// DOM参照
// ========================================
const searchInput = ref(null);
const dropdownRef = ref(null);

// ========================================
// 算出プロパティ
// ========================================
// エラー時の赤枠表示制御
const showBorder = computed(() => {
  return props.hasError && !isModified.value;
});

const selectedSection = computed(() => props.sections.find((s) => s.id === props.modelValue));

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
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleEscKey);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleEscKey);
});

// ========================================
// ウォッチャー
// ========================================
// hasErrorがtrueになったら（新しいバリデーションエラー）、isModifiedをリセット
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
// ボタンクリック時の処理
const handleButtonClick = async () => {
  isModified.value = true;
  emit('modified');
  toggleDropdown();
};

// ドロップダウンの開閉
const toggleDropdown = async () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  if (isDropdownOpen.value) {
    await nextTick();
    searchInput.value?.focus();
  } else {
    searchQuery.value = '';
  }
};

// セクション選択
const selectSection = (section) => {
  isModified.value = true;
  emit('modified');
  emit('update:modelValue', section.id);
  isDropdownOpen.value = false;
  searchQuery.value = '';
};

// クリック外検知
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false;
    searchQuery.value = '';
  }
};

// ESCキー検知
const handleEscKey = (event) => {
  if (event.key === 'Escape' && isDropdownOpen.value) {
    isDropdownOpen.value = false;
    searchQuery.value = '';
  }
};
</script>
