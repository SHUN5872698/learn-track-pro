## treeコマンド

```bash
tree -L 3 --dirsfirst .gemini/docs/ -I 'テンプレート'
```

## カテゴリ構成

`.gemini/docs/`

```bash
.gemini/docs/
├── apis/                   # API仕様、エンドポイント、リクエスト/レスポンス例
├── architectures/          # システム設計、コンポーネント図、ディレクトリ構造
├── cookbooks/              # プロジェクト固有の開発手順やレシピ
├── databases/              # データベーススキーマ、ER図、マイグレーション戦略
├── decisions/              # 設計上の意思決定の記録 (ADR)
├── designs/                # UI/UXデザイン、基本設計、画面フロー
├── development-processes/  # 開発ワークフロー、コーディング規約
├── infrastructures/        # デプロイ、サーバー設定、Docker、CI/CD
├── project-infos/          # プロジェクトロードマップ、要件定義、ドキュメント構造
├── securities/             # セキュリティ設計、認証・認可の安全管理
├── tasks/                  # プロジェクト固有の具体的なタスクリスト
└── tests/                  # テスト戦略、テスト項目書
```

### NotionDB独自カテゴリ

```bash
├── Other/                   # Notion AI活用のためのコンテキストドキュメント
└── Prompt/                  # プロンプトとレスポンスの作成履歴
```

---

## apis

```bash
.gemini/docs/apis/
├── api-docs/                     # OpenAPI仕様書（YAML）
│   ├── auth-user-api.yaml
│   ├── learning-contents-api.yaml
│   ├── learning-sessions-api.yaml
│   ├── master-data-api.yaml
│   ├── reports-api.yaml
│   └── sections-api.yaml
│
└── endpoint-docs/                # エンドポイント詳細ドキュメント（Markdown）
    ├── README.md                 # エンドポイント一覧・概要
    ├── auth-user-api.md          # 認証・ユーザー管理API
    ├── learning-contents-api.md  # 学習内容管理API
    ├── learning-sessions-api.md  # 学習セッションAPI
    ├── master-data-api.md        # マスターデータAPI
    ├── reports-api.md            # レポート・統計API
    └── sections-api.md           # セクション管理API
```

---

## architectures

```bash
.gemini/docs/architectures/
├── api-error-handling-specification.md         # APIエラーハンドリング仕様
├── laravel-directory-structure.md              # Laravelディレクトリ構造詳細
├── logout-lifecycle-cleanup-implementation.md  # ログアウト/クリーンアップ処理設計
└── vue-application-directory-structure.md      # Vue.jsアプリディレクトリ構造詳細
```

---

## databases

```bash
.gemini/docs/databases/
└── database-schema-definition.md # データベーススキーマ定義書
```

---

## decisions

```bash
.gemini/docs/decisions/
├── lessons-learned.md            # 開発からの学び・教訓
└── responsive-design-strategy.md # レスポンシブデザイン戦略
```

---

## designs

```bash
.gemini/docs/designs/
└── basic-design-and-screen-flow.md # 基本設計および画面遷移図
```

---

## development-processes

```bash
.gemini/docs/development-processes/
├── application-logic-understanding/  # アプリケーションロジック理解用資料
│   ├── 01-auth-user-logic.md         # 認証・ユーザー管理ロジック
│   ├── 02-master-data-logic.md       # マスターデータロジック
│   ├── 03-learning-content-logic.md  # 学習内容ロジック
│   ├── 04-section-logic.md           # セクションロジック
│   ├── 05-learning-session-logic.md  # 学習セッションロジック
│   ├── 06-report-statistics-logic.md # レポート・統計ロジック
│   └── README.md                     # 概要
├── console-log-handling.md           # コンソールログの取り扱い方針
├── laravel-coding-standards.md       # Laravelコーディング規約
└── vue-coding-standards.md           # Vue.jsコーディング規約
```

---

## project-infos

```bash
.gemini/docs/project-infos/
├── discussion-summary.md            # 議論要点まとめ
├── document-structure.md            # ドキュメント構成（本書）
├── feature-expansion-roadmap.md     # 機能拡張ロードマップ
└── requirements-specification.md    # 要件定義書
```

---

## tasks

```bash
.gemini/docs/tasks/
└── preparation-task-list.md # 開発準備・初期タスクリスト
```

---

## securities

```bash
.gemini/docs/securities/
└── docker-mysql-security-design.md # Docker環境におけるMySQLセキュリティ設計
```

---

## tests

```bash
.gemini/docs/tests/
├── manual/                                # 手動テスト手順書・詳細
│   ├── README.md                          # 概要
│   ├── authentication-manual-tests.md     # 認証機能手動テスト
│   ├── learning-content-manual-tests.md   # 学習内容管理手動テスト
│   ├── learning-session-manual-tests.md   # 学習記録手動テスト
│   └── reports-manual-tests.md            # レポート・統計手動テスト
├── units/                                 # ユニットテスト
│   └── avatar-upload-unit-test.md         # プロフィール画像アップロードユニットテスト
└── api-error-handling-manual-test-list.md # APIエラーハンドリング手動テスト一覧
```

---
