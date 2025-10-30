<template>
  <!-- 技術選択ドロップダウンコンポーネントのラッパー -->
  <div class="relative" ref="dropdownRef">
    <label class="form-label">技術<span class="pl-1 text-red-500">*</span></label>

    <!-- セレクトボックス風の表示ボタン -->
    <button type="button" @click="toggleDropdown" :class="['flex items-center justify-between w-full px-3 py-2 mt-1 text-left bg-white border rounded-md shadow-sm focus:outline-none text-sm', hasError ? 'form-input-error' : 'form-input-normal']">
      <span :class="selectedTechnology ? 'text-slate-900' : 'text-gray-400 text-sm md:text-base'">
        {{ selectedTechnology ? selectedTechnology.name : '技術を選択してください' }}
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
            <input ref="searchInput" v-model="searchQuery" type="text" placeholder="技術名で検索..." class="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-violet-500" @click.stop />
          </div>
        </div>

        <!-- 選択肢リスト -->
        <div class="overflow-y-auto max-h-60">
          <!-- フィルタリングされた技術のリストをレンダリング -->
          <button v-for="tech in filteredTechnologies" :key="tech.id" type="button" @click="selectTechnology(tech)" class="flex items-center w-full px-3 py-2 text-left transition-colors hover:bg-violet-50" :class="{ 'bg-violet-100': modelValue === tech.id }">
            <span class="flex-1">{{ tech.name }}</span>
            <CheckIcon v-if="modelValue === tech.id" class="w-4 h-4 text-violet-600" />
          </button>

          <!-- 検索結果がない場合のメッセージ -->
          <div v-if="searchQuery && filteredTechnologies.length === 0" class="px-3 py-8 text-center">
            <p class="text-sm text-gray-500">「{{ searchQuery }}」に一致する技術が見つかりません</p>
          </div>

          <!-- 検索クエリがない場合のメッセージ -->
          <div v-if="!searchQuery && filteredTechnologies.length === 0" class="px-3 py-8 text-center">
            <p class="text-sm text-gray-500">技術を検索してください</p>
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
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { ChevronDownIcon, CheckIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/solid';

// ========================================
// Props & Emits
// ========================================
const props = defineProps({
  modelValue: Number,
  technologies: Array,
  hasError: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

// ========================================
// 状態管理
// ========================================
// UI状態
const isDropdownOpen = ref(false);
const searchQuery = ref('');

// ========================================
// DOM参照
// ========================================
const searchInput = ref(null);
const dropdownRef = ref(null);

// ========================================
// 算出プロパティ
// ========================================
// 選択中の技術
const selectedTechnology = computed(() => props.technologies.find((t) => t.id === props.modelValue));

// 検索フィルタリング
const filteredTechnologies = computed(() => {
  if (!searchQuery.value) {
    return props.technologies;
  }
  const query = searchQuery.value.toLowerCase();
  return props.technologies.filter((tech) => tech.name.toLowerCase().includes(query));
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
// メソッド
// ========================================
// イベントハンドラ
// ドロップダウンの開閉制御
const toggleDropdown = async () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  if (isDropdownOpen.value) {
    await nextTick();
    searchInput.value?.focus();
  } else {
    searchQuery.value = '';
  }
};

// 技術選択
const selectTechnology = (tech) => {
  emit('update:modelValue', tech.id);
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
