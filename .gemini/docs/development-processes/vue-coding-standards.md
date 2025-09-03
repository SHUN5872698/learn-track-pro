# Vue.js コーディング規約

## あなたの役割
あなたはJavaScript、Vue 3、TailwindCSSのエキスパートです。

## コードスタイルと構造
- 簡潔で技術的に正確なJavaScriptコードを書く
- Composition API使用、Options API禁止
- コード重複よりモジュール化を優先
- 説明的な変数名（isLoading、hasError、canDelete等）
- ファイル構造：export → composables → helpers → static
- インデント：スペース2個

## 命名規則

### ディレクトリ・ファイル
- ディレクトリ：kebab-case（例：auth-wizard/）
- コンポーネント：PascalCase（例：AuthWizard.vue、DeleteConfirmModal.vue）
- Composables：camelCase（例：useAuthState.js）
- ユーティリティ：camelCase（例：formatDate.js）

### 変数・関数
- 関数名：camelCase（例：handleDelete）
- 定数オブジェクト：UPPER_SNAKE_CASE
- ブール値：is/has/can接頭辞使用

### Vue Router
- **ルートのnameプロパティ：kebab-case（例：learning-detail、profile-edit）**
- **コンポーネントのインポート：ファイル上部で事前インポート**

```javascript
// router.js の例
import Home from './views/Home.vue';
import LearningDetail from './views/learning/LearningDetail.vue';
import ProfileEdit from './views/profile/ProfileEdit.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/learning/:id',
    name: 'learning-detail',
    component: LearningDetail
  },
  {
    path: '/profile/edit',
    name: 'profile-edit',
    component: ProfileEdit
  }
];
```

## JavaScript規約
- アロー関数を優先使用
- constを基本とし、必要時のみlet使用
- 単純な条件文は省略記法使用
- テンプレートリテラル使用

## Vue 3ベストプラクティス
- `<script setup>`構文使用
- ref、reactive、computed適切に使い分け
- provide/inject適切に活用
- カスタムcomposables作成

## UI・スタイリング

### 基本ルール
- TailwindCSSユーティリティクラスのみ使用
- カスタムCSSクラス定義禁止
- Bootstrapライクなクラス（btn-primary等）使用禁止
- モバイルファーストアプローチ
- レスポンシブデザイン必須

### カラーパレット
- **メインカラー**
  - violet-600, violet-700（プライマリ）
  - emerald-600, emerald-700（セカンダリ）
  - slate系（テキスト・背景）
  - red-600（削除・警告）

- **技術識別色**
  - red系：Laravel
  - emerald系：Vue.js
  - blue系：React

### デザイン原則
- 角丸：rounded-2xl, rounded-xl（大きめ）
- 影：shadow-xl, shadow-lg
- 透明感：bg-white/70, backdrop-blur-md
- グラデーション：bg-gradient-to-r
- アニメーション：transition-all duration-200

### コンポーネントスタイル例
```javascript
// ボタン（プライマリ）
"bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-xl px-4 py-2 shadow-lg hover:shadow-xl"

// カード
"bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-6"

// モーダル背景
"bg-black/30 backdrop-blur-sm"
