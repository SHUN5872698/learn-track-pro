## 概要

LearnTrack ProのレスポンシブWebデザイン実装方針を定義するドキュメント。Phase 2（レスポンシブ対応）で確定した技術判断を記録し、今後の開発で一貫性を保つための指針とする

**策定日**: 2025-10-22

**対象**: Vue 3 + TailwindCSS

**関連**:[**Vue.js コーディング規約**](https://www.notion.so/Vue-js-26b9d86c12e880719990cf73d40cc720?pvs=21) 

---

## 基本方針

### デプロイ優先・完璧主義を避ける

- **2サイズ戦略**: モバイル（〜767px）とデスクトップ（768px〜）の2段階のみ
- **タブレット専用調整なし**: デスクトップレイアウトを適用
- **工数対効果を重視**: デプロイを最優先、問題があれば個別対応

### モバイルファーストアプローチ

```css
/* デフォルト（プレフィックスなし）= モバイル（〜767px） */
.card {
  @apply flex-col space-y-4;
}

/* md:以上 = デスクトップ（768px〜） */
@screen md {
  .card {
    @apply flex-row space-x-6;
  }
}
```

---

## ブレークポイント戦略

### 使用するプレフィックス

**1. `md:` (768px) - メイン境界**

- 全画面で使用
- モバイル ↔ デスクトップの切り替え境界
- 最も重要なブレークポイント

**2. `lg:` (1024px) - 例外的に使用**

- **768px-1023px**で4カラム表示を避け、可読性を確保する場合のみ
- **使用例**:
    - **Reports.vue**の統計カード: `md:grid-cols-2 lg:grid-cols-4`
    - **Reports.vue**のグラフセクション: `lg:grid-cols-5`
    - **Dashboard.vue**のカードグリッド: `md:grid-cols-2 lg:grid-cols-3`

### 使用禁止のプレフィックス

**1. `sm:` (640px) - 使用禁止**

- 理由: 2サイズ戦略に反する
- 640px-767pxの中途半端な範囲を作らない

**2. `xl:` (1280px) - 使用禁止**

- 理由: 工数対効果が低い
- 必要性が出たらPhase 4以降で検討

### 実装例

```html
<!-- ✅ 正しい: md:をメイン境界として使用 -->
<div class="flex-col md:flex-row">
<div class="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
<div class="text-xl md:text-2xl">

<!-- ❌ 間違い: sm:は使用禁止 -->
<div class="hidden sm:block">
<div class="text-sm sm:text-base">

<!-- ❌ 間違い: xl:は使用禁止 -->
<div class="max-w-4xl xl:max-w-7xl">
```

---

## @applyクラス一覧

**定義場所**: `resources/css/app.css`

### 優先度：高

**.auth-header**

```css
@apply mt-6 text-3xl font-bold text-center text-transparent bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text;
```

- 使用箇所: 認証関連の全ページのタイトル
- 適用ファイル: Login.vue,PasswordReset.vue,PasswordResetConfirm.vue,Register.vue

**.section-header**

```css
@apply mb-2 text-xl font-bold text-slate-800 md:text-2xl;
```

- 使用箇所: ログイン後の全ページのタイトル
- 適用ファイル: DashboardLayout.vue, LearningContentDetail.vue, Profile.vue 他

**.section-subtext**

```css
@apply text-xs font-medium text-slate-600 md:text-sm;
```

- 使用箇所: ログイン後の全ページのサブテキスト
- 適用ファイル: フォーム画面全般

**.section-subheader**

```css
@apply text-base font-bold text-slate-800 md:text-lg;
```

- 使用箇所: ログイン後の特定のセクション見出し
- 適用ファイル: Reports.vue

**.error-container**

```css
@apply p-4 mb-6 text-sm text-red-800 bg-red-100 border-l-4 border-red-500 rounded-md md:text-base;
```

- 使用箇所: Vue側/API側エラー
- 適用ファイル: フォーム画面全般

### 優先度：中

**.form-label**

```css
@apply block text-sm font-medium text-slate-700;
```

- 使用箇所: 全フォームのラベル

**.form-input-base**

```css
@apply block w-full px-3 py-2 mt-1 text-sm placeholder-gray-400 border rounded-md shadow-sm appearance-none focus:outline-none;
```

- 使用箇所: 全フォームの入力フィールド（基本スタイル）

**.form-input-normal**

```css
@apply border-gray-300 focus:border-violet-500 focus:ring-violet-500;
```

- 使用箇所: 全フォームの入力フィールド（通常状態）

**.form-input-error**

```css
@apply border-red-500 focus:border-red-500 focus:ring-red-500;
```

- 使用箇所: 全フォームの入力フィールド（エラー状態）

**.text-counter**

```css
@apply mt-1 text-xs text-gray-500;
```

- 使用箇所: textarea使用箇所（文字数カウンター）

**.text-counter-over**

```css
@apply font-medium text-red-500;
```

- 使用箇所: textarea使用箇所（文字数オーバー）

---

## レイアウトファイルの余白統一

### 統一ルール

- **モバイル余白**: 16px (`p-4`)
- **デスクトップ余白**: 32px (`md:p-8`)
- **モバイル最大幅**: 448px (`max-w-md`)
- **デスクトップ最大幅**: 各レイアウトの特性に応じて設定

### レイアウト別仕様

**DashboardLayout.vue**

```
<div class="max-w-md p-4 md:max-w-7xl md:p-8">
```

- デスクトップ最大幅: 1280px (`max-w-7xl`)
- 用途: ダッシュボード画面全般

**DetailLayout.vue**

```
<div class="max-w-md p-4 md:max-w-4xl md:p-8">
```

- デスクトップ最大幅: 896px (`max-w-4xl`)
- 用途: 詳細画面（LearningContentDetail.vue、Profile.vue 他）

**MultiCardDetailLayout.vue**

```
<div class="max-w-md p-4 md:max-w-4xl md:p-8">
```

- デスクトップ最大幅: 896px (`max-w-4xl`)
- 用途: 複数カード詳細画面

**DefaultLayout.vue**

```
<div class="px-4 md:px-8">
```

- 内側余白のみ（最大幅なし）

**例外: AuthLayout.vue**

- 変更なし（認証画面は別扱い）

---

## アクションボタン配置パターン

### 標準パターン（DetailLayoutを使用する画面）

```
<template #actions>
  <div class="flex flex-col w-full space-y-2 md:flex-row md:space-y-0 md:space-x-2 md:w-auto">
    <BaseButton class="w-full md:w-auto">ボタン</BaseButton>
  </div>
</template>
```

- モバイル: 縦積み、フル幅
- デスクトップ: 横並び、コンテンツ幅

### 左右配置パターン（フォーム画面）

```
<div class="flex flex-col pt-6 space-y-2 border-t md:flex-row md:justify-between md:space-y-0">
  <BaseButton variant="secondary" size="md" class="w-full md:w-auto">キャンセル</BaseButton>
  <BaseButton type="submit" variant="primary" size="md" class="w-full md:w-auto">保存</BaseButton>
</div>
```

- モバイル: 縦積み、フル幅
- デスクトップ: 横並び、左右配置（`md:justify-between`）
- キャンセルボタン左、保存/更新ボタン右

---

## タッチ操作への配慮

### ボタンのタップエリア

- **最低サイズ**: 44×44px確保
- **実装方法**:
    - `py-2`で高さ確保
    - `size="md"`プロパティ使用（BaseButton.vue）

### その他の配慮

- ホバー効果に依存しない設計
- スワイプ/スクロール領域を明確に
- フォーム入力フィールドは十分な高さを確保

---

## コンポーネント別実装パターン

### ナビゲーション

**ハンバーガーメニュー**

```
<!-- モバイルのみ表示 -->
<button class="block md:hidden">

<!-- デスクトップのみ表示 -->
<nav class="hidden md:block">
```

### カード

**グリッドレイアウト**

```
<!-- 基本パターン: モバイル1カラム、デスクトップ2カラム -->
<div class="grid grid-cols-1 gap-6 md:grid-cols-2">

<!-- 3カラムパターン: モバイル1、タブレット2、デスクトップ3 -->
<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

<!-- 4カラムパターン（例外的）: 可読性確保のため段階的 -->
<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
```

### フォーム

**入力フィールド**

```
<input
  :class="[
    'form-input-base',
    errors.field ? 'form-input-error' : 'form-input-normal'
  ]"
/>
```

**日付フォーマット**

```jsx
// モバイル: 短縮形式
const formattedDateShort = computed(() => {
  return dayjs(date.value).format('YYYY/M/D');
});

// デスクトップ: 完全形式
const formattedDateFull = computed(() => {
  return dayjs(date.value).format('YYYY年M月D日');
});
```

---

## 実装時の注意点

### 1. ブレークポイント統一

- TailwindCSSのデフォルトブレークポイントを使用
- `sm:` (640px) は使用しない
- `md:` (768px) をメイン境界として使用
- `lg:` (1024px) を例外的に使用（Reports.vue、Dashboard.vue）

### 2. 既存実装の特例

**Profile.vueのユーザー名**

```
<p class="text-xl font-bold text-slate-900">
```

- `@apply`不使用
- 理由: 文字サイズが根本的に異なるため（`section-header`より大きい）

### 3. 許容した軽微な問題

**SectionStudyRecords.vue**

- 375px幅でのボタンテキスト段落落ち（「記録を編集」「記録を削除」）
- 影響範囲が限定的（最小デバイスサイズのみ）
- 機能に支障なし

---

## 検証方法

### 推奨ツール

**Chrome DevTools（モバイルエミュレーション）**

- モバイル: 375×667px（iPhone SE基準）
- デスクトップ: 1280×800px
- タブレット: 768×1024px（確認のみ、調整なし）

**Playwright MCP（スクリーンショット撮影）**

[Playwright MCP活用プロンプト](https://www.notion.so/Playwright-MCP-2809d86c12e88042bc4ce592287e1c46?pvs=21) 

- 自動化された視覚的検証
- 複数画面の一括撮影

⚠️**中盤以降、スクリーンショット以外の活用ケースがなくなったため、Chrome DevToolsによる手動撮影に切り替え**

### チェック項目

- [ ]  `sm:`プレフィックスが残っていないか（`grep -r "sm:" resources/js/`）
- [ ]  モバイル（375px）で全要素が適切に表示される
- [ ]  デスクトップ（1280px）で既存レイアウトが維持される
- [ ]  ブレークポイント境界（767px ↔ 768px）で切り替わりが正常
- [ ]  `@apply`クラスが適切に適用されている

---

## 関連ドキュメント

- [**Vue.js コーディング規約**](https://www.notion.so/Vue-js-26b9d86c12e880719990cf73d40cc720?pvs=21)  - レスポンシブデザイン統合版
- [レスポンシブ対応](https://www.notion.so/28e9d86c12e880f88022ee69a4511e2f?pvs=21)  - 実装タスク詳細
- [機能拡張ロードマップ](https://www.notion.so/2499d86c12e880b9ba25d1cc7e8d71f3?pvs=21)  - Phase全体の計画
- [Playwright MCP活用プロンプト](https://www.notion.so/Playwright-MCP-2809d86c12e88042bc4ce592287e1c46?pvs=21)  - 検証自動化

---
