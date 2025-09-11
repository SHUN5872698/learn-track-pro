<template>
  <component :is="componentType" :to="to" :type="type" :class="buttonClasses" :disabled="disabled" @click="$emit('click', $event)" ref="rootElement">
    <component :is="leftIcon" v-if="leftIcon && !iconOnly" class="w-5 h-5" />
    <component :is="leftIcon" v-if="leftIcon && iconOnly" class="w-5 h-5" />
    <span v-if="$slots.default && !iconOnly" :class="{ 'ml-2': leftIcon, 'mr-2': rightIcon }">
      <slot></slot>
    </span>
    <slot v-if="iconOnly"></slot>
    <component :is="rightIcon" v-if="rightIcon && !iconOnly" class="w-5 h-5" />

    <!-- ツールチップ -->
    <span v-if="tooltip" :class="tooltipClasses">
      {{ tooltip }}
    </span>
  </component>
</template>

<script setup>
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
  // ボタンの視覚的なスタイルを定義
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'info', 'danger', 'ghost', 'icon', 'icon-danger', 'icon-primary'].includes(value),
  },
  // ボタンの大きさを定義
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  // ボタンの幅を親要素いっぱいに広げるか
  fullWidth: {
    type: Boolean,
    default: false,
  },
  // ボタンを無効化するか
  disabled: {
    type: Boolean,
    default: false,
  },
  // ボタンの左側に表示するアイコンコンポーネント
  leftIcon: {
    type: [Object, Function],
    default: null,
  },
  // ボタンの右側に表示するアイコンコンポーネント
  rightIcon: {
    type: [Object, Function],
    default: null,
  },
  // HTMLのbutton要素のtype属性を指定
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value),
  },
  // クリック時に遷移するパス
  to: {
    type: String,
    default: null,
  },
  // テキストなしでアイコンのみを表示するか
  iconOnly: {
    type: Boolean,
    default: false,
  },
  // ホバー時に表示するツールチップのテキスト
  tooltip: {
    type: String,
    default: '',
  },
  // ボタンの角丸スタイルを定義
  shape: {
    type: String,
    default: 'rounded',
    validator: (value) => ['rounded', 'circle'].includes(value),
  },
  // ツールチップの視覚的なスタイルを定義
  tooltipVariant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'danger'].includes(value),
  },
});

defineEmits(['click']);

// ルート要素への参照を作成
const rootElement = ref(null);

// toプロパティの有無でRouterLinkとbuttonを動的に切り替える
const componentType = computed(() => (props.to ? RouterLink : 'button'));

// 全てのボタンに共通する基本スタイルを定義
const baseClasses = 'font-medium transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center';

// variantプロパティに基づいて異なるビジュアルスタイルを適用
const variantClasses = computed(() => ({
  primary: 'bg-gradient-to-r from-violet-600 to-violet-700 text-white hover:from-violet-700 hover:to-violet-800 hover:shadow-xl hover:scale-105 shadow-lg',
  secondary: 'bg-white/80 backdrop-blur-sm border border-slate-200/50 text-slate-700 hover:bg-gray-50 hover:shadow-lg hover:border-slate-300 active:bg-gray-100 shadow-md',
  info: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-105 shadow-lg',
  danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:scale-105 shadow-lg',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
  icon: 'text-slate-400 hover:text-slate-600 hover:bg-slate-200',
  'icon-danger': 'text-red-500 hover:bg-red-100',
  'icon-primary': 'text-violet-600 hover:bg-violet-100',
}));

// sizeプロパティとiconOnlyの有無に基づいて異なるパディングとフォントサイズを適用
const sizeClasses = computed(() => {
  if (props.iconOnly) {
    return {
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-3',
    };
  }
  return {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
});

// shapeプロパティに基づいて角丸スタイルを適用
const shapeClasses = computed(() => {
  if (props.shape === 'circle') return 'rounded-full';
  return 'rounded-xl';
});

// tooltipVariantプロパティに基づいてツールチップの背景色を適用
const tooltipClasses = computed(() => {
  const base = 'absolute px-2 py-1 mb-2 text-xs text-white transition-opacity duration-200 -translate-x-1/2 rounded-md opacity-0 pointer-events-none bottom-full left-1/2 group-hover:opacity-100 whitespace-nowrap z-10';
  if (props.tooltipVariant === 'danger') {
    return `${base} bg-red-700`;
  }
  return `${base} bg-slate-700`;
});

// 全てのクラス定義を結合し、最終的なボタンのスタイルを決定
const buttonClasses = computed(() => [baseClasses, variantClasses.value[props.variant], sizeClasses.value[props.size], shapeClasses.value, { 'w-full': props.fullWidth, 'relative group': props.tooltip }]);

// 親コンポーネントにルートDOM要素を公開
defineExpose({
  rootElement,
});
</script>

<!--
ボタンバリアントの使い分けガイド:
primary: 保存、更新、作成などのデータ確定アクション（濃い紫）
secondary: キャンセル、戻るなどの補助アクション（白/グレー）
danger: 削除、破棄などの破壊的アクション（赤）
ghost: 目立たせたくない補助的アクション（透明）
icon: アイコンボタン
icon-danger: 削除アイコンボタン
icon-primary: 保存、更新、作成アイコンボタン
-->
