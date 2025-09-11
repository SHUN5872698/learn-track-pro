<template>
  <div class="animate-fade-in">
    <!-- セクションのドラッグ＆ドロップリスト -->
    <draggable :list="localSections" item-key="id" handle=".drag-handle" :animation="300" ghost-class="sortable-ghost" drag-class="sortable-drag" chosen-class="sortable-chosen" @start="isDragging = true" @end="handleDragEnd" class="space-y-4">
      <template #item="{ element: section, index }">
        <div class="flex items-center space-x-2">
          <!-- ドラッグハンドル -->
          <div class="p-2 transition-colors rounded cursor-move drag-handle hover:bg-gray-100">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
            </svg>
          </div>
          <span class="font-semibold text-slate-600">{{ index + 1 }}.</span>
          <!-- セクションタイトル入力フィールド -->
          <input
            type="text"
            :value="section.title"
            @input="sectionTitleModified(index, $event.target.value)"
            placeholder="セクションのタイトル"
            class="flex-grow px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm"
            :class="[showSectionBorder(index) ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-violet-500 focus:ring-violet-500']"
          />
          <!-- セクション削除ボタン -->
          <!-- セクションが1つしかない場合は削除不可 -->
          <BaseButton @click="removeSection(index)" variant="icon-danger" size="md" shape="circle" :icon-only="true" :disabled="localSections.length <= 1" :tooltip="localSections.length <= 1 ? '最低1つのセクションが必要です' : ''" :tooltip-variant="localSections.length <= 1 ? 'danger' : 'default'">
            ✕
          </BaseButton>
        </div>
      </template>
    </draggable>

    <div class="pl-16 mt-6">
      <!-- セクション追加ボタン -->
      <button type="button" @click="addSection" class="flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-200 transform shadow-md bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl hover:shadow-lg hover:scale-105">
        <PlusIcon class="w-5 h-5 mr-1" />セクションを追加
      </button>

      <!-- セクション追加のヒント -->
      <p v-if="showHint" class="flex items-center mt-3 text-sm text-slate-500">
        <LightBulbIcon class="w-5 h-5 mr-2 text-yellow-500" />
        セクションは後からでも追加できます。
      </p>
    </div>
  </div>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { ref, watch, reactive } from 'vue';
import { PlusIcon, LightBulbIcon } from '@heroicons/vue/24/solid';

// ========================================
// 内部インポート
// ========================================
import draggable from 'vuedraggable';
import BaseButton from '../../common/BaseButton.vue';

// プロパティ定義
const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
  originalSections: {
    type: Array,
    default: () => [],
  },
  showHint: {
    type: Boolean,
    default: false,
  },
  hasError: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'request-delete']);

const localSections = ref(JSON.parse(JSON.stringify(props.modelValue)));
const isDragging = ref(false);

// 各セクションの入力状態を管理
const sectionsModified = reactive({});

// 枠線表示の制御（インデックスごと）
const showSectionBorder = (index) => {
  // セクションが空で、かつまだ修正されていない場合に赤枠を表示
  const section = localSections.value[index];
  const isEmpty = !section || !section.title || section.title.trim() === '';
  return props.hasError && isEmpty && !sectionsModified[index];
};

// hasErrorプロップの変更を監視してリセット
watch(
  () => props.hasError,
  (newVal) => {
    if (newVal) {
      // エラーが新しくセットされたら修正状態をリセット
      Object.keys(sectionsModified).forEach((key) => {
        sectionsModified[key] = false;
      });
    }
  }
);

// 親コンポーネントからのmodelValueの変更を監視
watch(
  () => props.modelValue,
  (newValue) => {
    localSections.value = JSON.parse(JSON.stringify(newValue));
  },
  { deep: true }
);

// ========================================
// イベントハンドラ
// ========================================
// セクションのタイトルを更新
const sectionTitleModified = (index, title) => {
  const newSections = [...localSections.value];
  newSections[index].title = title;
  emit('update:modelValue', newSections);
  sectionsModified[index] = true; // 変更フラグを立てる
};

const updateSectionOrder = () => {
  const updatedSections = localSections.value.map((section, i) => ({
    ...section,
    order: i + 1,
  }));
  emit('update:modelValue', updatedSections);
};

const addSection = () => {
  const newSection = { id: `new_${Date.now()}`, title: '', order: localSections.value.length + 1 };
  const newSections = [...localSections.value, newSection];
  emit('update:modelValue', newSections);
};

const handleDragEnd = () => {
  isDragging.value = false;
  updateSectionOrder();
};

const removeSection = (index) => {
  const section = localSections.value[index];
  const isOriginal = props.originalSections.some((orig) => orig.id === section.id);

  if (props.isEditMode && isOriginal) {
    emit('request-delete', index);
  } else {
    localSections.value.splice(index, 1);
    emit('update:modelValue', localSections.value);
    updateSectionOrder();
  }
};
</script>
