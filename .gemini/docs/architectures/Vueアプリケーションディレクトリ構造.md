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
│   │   ├── LearningContentCreate.vue # 学習内容作成ページ
│   │   ├── LearningContentDetail.vue
│   │   ├── SectionStudyRecords.vue
│   │   └── StudySessionForm.vue
│   │
│   ├── NotFound.vue    # 404ページ
│   # ├── Reports.vue     # レポート画面（将来実装）
│
├── components/         # 再利用可能なコンポーネント
│   │
│   ├── learning/      # 学習管理関連コンポーネント
│   │   ├── LearningContentCard.vue # 学習コンテンツをカード形式で表示するコンポーネント
│   │   ├── StatsOverview.vue # 学習統計の概要を表示するコンポーネント
│   │   ├── StudyRecordDeleteModal.vue # 学習記録の削除確認モーダルコンポーネント
│   │   └── wizard/ # ウィザード関連コンポーネント
│   │       ├── SectionListEditor.vue # セクションリストエディタ
│   │       ├── TechnologySelector.vue # 学習内容作成ウィザードのステップ1で使用される技術選択コンポーネント
│   │       ├── WizardNavigation.vue # 学習内容作成ウィザードのナビゲーションボタンコンポーネント
│   │       └── WizardStepIndicator.vue # 学習内容作成ウィザードのステップ表示コンポーネント
│   │   # ├── SectionList.vue # セクションリスト（将来実装）
│
│   └── common/        # 汎用コンポーネント
│       ├── AppHeader.vue # アプリケーションのヘッダーコンポーネント
│       ├── AppSidebar.vue # アプリケーションのサイドバーコンポーネント
│       ├── DatePickerModal.vue # 日付選択モーダルコンポーネント
│       ├── DeleteConfirmModal.vue # 削除確認モーダルコンポーネント
│       ├── TimeInputModal.vue # 時間入力モーダルコンポーネント
│       └── UnsavedChangesModal.vue # 未保存の変更がある場合の確認モーダルコンポーネント
│       # └── LoadingSpinner.vue # ローディングスピナー（将来実装）
│
├── composables/       # 共有ロジック・状態管理
│   ├── useAuth.js # 認証関連のロジックと状態管理
│   ├── useLearningContentForm.js # 学習内容作成フォームのロジックと状態管理
│   ├── useLearningData.js # 学習データ（学習コンテンツ、セクション、学習記録など）の管理
│   ├── useWizardForm.js # ウィザードフォームのステップ管理とバリデーションロジック
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
