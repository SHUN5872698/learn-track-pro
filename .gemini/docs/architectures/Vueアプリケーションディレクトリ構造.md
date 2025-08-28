## 相互リンク

[Vueアプリケーションディレクトリ構造](https://www.notion.so/Vue-25a9d86c12e8805483b2e52ec251ff87?pvs=21)

.gemini/docs/architectures/Vueアプリケーションディレクトリ構造.md

---

## 基本方針

このプロジェクトの規模（MVP + 拡張機能）を考慮し、シンプルさと整理のバランスを重視した構造を採用します。

---

## 推奨ディレクトリ構造

```bash
src/
├── views/              # ルーティング対象のページ
│   ├── auth/          # 認証関連ページ
│   │   ├── Login.vue
│   │   ├── PasswordReset.vue
│   │   └── Register.vue
│   │
│   ├── Dashboard.vue   # メインダッシュボード
│   ├── learning/      # 学習管理関連ページ
│   │   ├── LearningContentDetail.vue
│   │   ├── SectionStudyRecords.vue
│   │   └── StudySessionForm.vue
│   │
│   ├── NotFound.vue    # 404ページ
│   # ├── Reports.vue     # レポート画面（将来実装）
│
├── components/         # 再利用可能なコンポーネント
│   ├── auth/          # 認証関連コンポーネント
│   │   # 認証関連フォームはviews/authに直接実装
│   │   # ├── LoginForm.vue
│   │   # ├── RegisterForm.vue
│   │   # └── PasswordResetForm.vue
│   │
│   ├── learning/      # 学習管理関連コンポーネント
│   │   ├── LearningContentCard.vue
│   │   ├── StatsOverview.vue
│   │   └── StudyRecordDeleteModal.vue
│   │   # ├── SectionList.vue # セクションリスト（将来実装）
│
│   └── common/        # 汎用コンポーネント
│       ├── AppHeader.vue
│       ├── AppSidebar.vue
│       ├── DatePickerModal.vue
│       ├── DeleteConfirmModal.vue
│       ├── TimeInputModal.vue
│       └── UnsavedChangesModal.vue
│       # └── LoadingSpinner.vue # ローディングスピナー（将来実装）
│
├── composables/       # 共有ロジック・状態管理
│   ├── useAuth.js
│   ├── useLearningData.js
│   # ├── useValidation.js # バリデーションロジック（将来実装）
│   # └── useLocalStorage.js # ローカルストレージ操作（将来実装）
│
├── layouts/           # レイアウトコンポーネント
│   ├── DefaultLayout.vue   # 認証後のレイアウト
│   └── AuthLayout.vue      # 認証画面用レイアウト
│
├── utils/             # ユーティリティ関数
│   # 現在は空ですが、将来的に共通関数を配置
│   # ├── formatDate.js # 日付フォーマット（将来実装）
│   # └── validationRules.js # バリデーションルール（将来実装）
│
├── assets/            # 静的アセット
│   ├── vue.svg
│   # └── styles/ # スタイルファイル（将来的に配置）
│   #     └── main.css
│
├── router.js          # ルーティング設定
├── App.vue           # ルートコンポーネント
└── main.js          # エントリーポイント
```

---

## なぜこの構造が良いか

1. **直感的な配置**
    - ページは`views/`
    - 部品は`components/`
    - ロジックは`composables/`
2. **適度な整理**
    - 認証関連：`views/auth/`と`components/auth/`
    - 学習関連：`components/learning/`
    - 機能ごとにまとまっているが、過度に複雑ではない
3. **現実的な規模感**
    - `features/`のような深い階層は避ける
    - MVPの規模に適している
    - 将来の拡張も可能

---

## 各ディレクトリの役割

## /views

- ルーターで直接アクセスされるページコンポーネント
- 各ページはレイアウトとコンポーネントを組み合わせる

## /components

- 再利用可能なUIコンポーネント
- 機能別にサブフォルダで整理（auth, learning, common）

## /composables

- Vue 3 Composition APIを使った共有ロジック
- 状態管理、API通信、バリデーションなど

## /layouts

- ページ全体のレイアウトを定義
- ヘッダー、サイドバー、フッターの配置
