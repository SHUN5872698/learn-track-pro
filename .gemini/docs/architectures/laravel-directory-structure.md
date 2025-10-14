## 基本方針

このプロジェクトの規模（MVP + 拡張機能）を考慮し、シンプルさと整理のバランスを重視した構造を採用します。

---

## 構造更新プロンプト

```markdown
.gemini/docs/architectures/Laravelディレクトリ構造.md

## 指示
1. 以下のコマンドを実行してください。
```
tree -L 5 --dirsfirst \
. \
-I 'node_modules|vendor|lang|*.png|*.jpg|*.jpeg|*.gif|*.svg|*.ico|*.webp|components|composables|layouts|utils|validators|views|debugbar|sessions|cache|framework/views|app.js|App.vue|bootstrap.js|router.js|favicon.ico|robots.txt|index.php|api|stores'
--prune
```
1. `## 現在のディレクトリ構造`を、treeコマンドの結果と突き合わせて更新してください。
2. 追加ファイルとディレクトリがない場合は報告してください。

### 注意点
- 更新する際はディレクトリの並び順は変更しないでください
- 新しく追加した項目には、必ずそのファイルやディレクトリの役割を簡潔にコメントとして追記してください
- 既存の項目もコメントが不足している場合は補足してください。ただし現在のコメントのように簡潔な内容を心がけてください
```
```

---

## 現在のディレクトリ構造

```bash
./
├── app/                                          # アプリケーションのコアコード
│   ├── Actions/                                  # Fortify認証アクションやその他のアプリケーション固有のアクション
│   │   └── Fortify/                              # Laravel Fortifyの認証関連アクション
│   │       ├── CreateNewUser.php                 # 新規ユーザー作成ロジック
│   │       ├── PasswordValidationRules.php       # パスワードバリデーションルールを定義するトレイト
│   │       ├── ResetUserPassword.php             # ユーザーパスワードリセットロジック
│   │       ├── UpdateUserPassword.php            # ユーザーパスワード更新ロジック
│   │       └── UpdateUserProfileInformation.php  # ユーザープロフィール情報更新ロジック
│   │
│   ├── Http/                                     # HTTPリクエストを処理するコントローラー、ミドルウェア、リクエストクラス
│   │   ├── Controllers/                          # アプリケーションのビジネスロジックをサービス層に委譲するThinコントローラー
│   │   │   ├── CategoryController.php            # カテゴリー関連のHTTPリクエストを処理
│   │   │   ├── Controller.php                    # 全てのコントローラーの基底クラス
│   │   │   ├── LearningContentController.php     # 学習コンテンツ関連のHTTPリクエストを処理
│   │   │   ├── LearningSessionController.php     # 学習セッション関連のHTTPリクエストを処理
│   │   │   ├── SectionController.php             # セクション関連のHTTPリクエストを処理
│   │   │   ├── TechnologyController.php          # 技術関連のHTTPリクエストを処理
│   │   │   └── UserController.php                # ユーザー関連のHTTPリクエストを処理
│   │   ├── Requests/                             # フォームリクエストのバリデーションルールを定義
│   │   │   ├── User/                             # ユーザー関連のリクエスト
│   │   │   │   └── ProfileRequest.php            # プロフィール更新時のバリデーション
│   │   │   ├── BulkUpdateSectionsRequest.php     # セクション一括更新時のバリデーション
│   │   │   ├── StoreLearningContentRequest.php   # 学習コンテンツ作成時のバリデーション
│   │   │   ├── StoreLearningSessionRequest.php   # 学習セッション作成時のバリデーション
│   │   │   ├── StoreSectionRequest.php           # セクション作成時のバリデーション
│   │   │   ├── UpdateLearningContentRequest.php  # 学習コンテンツ更新時のバリデーション
│   │   │   ├── UpdateLearningSessionRequest.php  # 学習セッション更新時のバリデーション
│   │   │   ├── UpdateSectionRequest.php          # セクション更新時のバリデーション
│   │   │   └── UpdateSectionStatusRequest.php    # セクションステータス更新時のバリデーション
│   │   └── Resources/                            # APIレスポンスのデータ変換と整形
│   │       ├── CategoryResource.php              # カテゴリーデータのリソース変換
│   │       ├── LearningContentResource.php       # 学習コンテンツデータのリソース変換
│   │       ├── LearningSessionResource.php       # 学習セッションデータのリソース変換
│   │       ├── SectionResource.php               # セクションデータのリソース変換
│   │       └── TechnologyResource.php            # 技術データのリソース変換
│   │
│   ├── Models/                                   # データベーステーブルと対話するためのEloquentモデル
│   │   ├── Category.php                          # カテゴリーモデル
│   │   ├── LearningContent.php                   # 学習コンテンツモデル
│   │   ├── LearningSession.php                   # 学習セッションモデル
│   │   ├── Section.php                           # セクションモデル
│   │   ├── Technology.php                        # 技術モデル
│   │   └── User.php                              # ユーザーモデル
│   │
│   ├── Policies/                                 # モデルの認可ロジックを定義
│   │   ├── LearningContentPolicy.php             # 学習コンテンツの認可ポリシー
│   │   └── LearningSessionPolicy.php             # 学習セッションの認可ポリシー
│   │
│   └── Providers/                                # サービスコンテナへのサービス登録やイベント登録を行うサービスプロバイダ
│       ├── AppServiceProvider.php                # アプリケーション全体のサービスプロバイダ
│       ├── AuthServiceProvider.php               # 認証・認可サービスプロバイダ
│       └── FortifyServiceProvider.php            # Fortify関連のサービスプロバイダ
│
├── bootstrap/                                    # フレームワークのブートストラップ処理
│   ├── app.php                                   # アプリケーションインスタンスの生成と設定
│   └── providers.php                             # アプリケーションで利用するサービスプロバイダのリスト
│
├── config/                                       # アプリケーションの各種設定ファイル
│   ├── app.php                                   # アプリケーションの基本設定
│   ├── auth.php                                  # 認証ガードやユーザープロバイダの設定
│   ├── cache.php                                 # キャッシュストアの設定
│   ├── cors.php                                  # CORS (Cross-Origin Resource Sharing) の設定
│   ├── database.php                              # データベース接続設定
│   ├── filesystems.php                           # ファイルシステムディスクの設定
│   ├── fortify.php                               # Laravel Fortifyの認証機能設定
│   ├── logging.php                               # ロギング設定
│   ├── mail.php                                  # メール送信設定
│   ├── queue.php                                 # キュー接続設定
│   ├── sanctum.php                               # Laravel SanctumのAPI認証設定
│   ├── services.php                              # 外部サービス（Mailgun, AWSなど）の認証情報
│   └── session.php                               # セッション設定
│
├── database/                                     # データベース関連ファイル
│   ├── factories/                                # テストデータ生成のためのモデルファクトリー
│   │   └── UserFactory.php                       # ユーザーモデルのファクトリー
│   │
│   ├── migrations/                                                      # データベーススキーマの変更を管理するマイグレーションファイル
│   │   ├── 0001_01_01_000000_create_users_table.php                     # ユーザーテーブル作成マイグレーション
│   │   ├── 0001_01_01_000001_create_cache_table.php                     # キャッシュテーブル作成マイグレーション
│   │   ├── 0001_01_01_000002_create_jobs_table.php                      # ジョブテーブル作成マイグレーション
│   │   ├── 2025_09_11_152308_add_two_factor_columns_to_users_table.php  # ユーザーテーブルに二要素認証カラムを追加
│   │   ├── 2025_09_11_161032_create_personal_access_tokens_table.php    # パーソナルアクセストークンテーブル作成マイグレーション
│   │   ├── 2025_09_12_101352_create_categories_table.php                # カテゴリーテーブル作成マイグレーション
│   │   ├── 2025_09_12_101354_create_technologies_table.php              # 技術テーブル作成マイグレーション
│   │   ├── 2025_09_12_101355_create_learning_contents_table.php         # 学習コンテンツテーブル作成マイグレーション
│   │   ├── 2025_09_12_101358_create_sections_table.php                  # セクションテーブル作成マイグレーション
│   │   └── 2025_09_12_112014_create_learning_sessions_table.php         # 学習セッションテーブル作成マイグレーション
│   │
│   ├── seeders/                                  # データベースに初期データやテストデータを投入するシーダー
│   │   ├── CategorySeeder.php                    # カテゴリーデータのシーダー
│   │   ├── DatabaseSeeder.php                    # 全てのシーダーを呼び出すメインシーダー
│   │   ├── LearningContentSeeder.php             # 学習コンテンツデータのシーダー
│   │   ├── LearningSessionSeeder.php             # 学習セッションデータのシーダー
│   │   ├── SectionSeeder.php                     # セクションデータのシーダー
│   │   ├── TechnologySeeder.php                  # 技術データのシーダー
│   │   └── UserSeeder.php                        # ユーザーデータのシーダー
│   └── database.sqlite                           # SQLiteデータベースファイル
│
├── public/                                       # 公開アセット
│   ├── hot                                       # Vite開発サーバーのホットリロードファイル
│   └── storage -> /var/www/html/storage/app/public # シンボリックリンクで公開されるストレージ
│
├── resources/                                    # フロントエンドのアセットやビューファイル
│   ├── css/                                      # CSSスタイルシート
│   │   └── app.css                               # アプリケーションのメインCSSファイル
│   │
│   └── js/                                       # JavaScriptファイル ※詳細は別ドキュメントに記載
│       └── plugins/                              # Vueプラグイン
│           └── axios.js                          # Axiosのカスタム設定とインターセプター
│
├── routes/                                       # アプリケーションのルーティング定義
│   ├── api.php                                   # APIルート定義
│   ├── console.php                               # Artisanコマンドラインルート定義
│   └── web.php                                   # Webルート定義
│
├── storage/                                      # アプリケーションが生成するファイル（ログ、キャッシュなど）
│   └── logs/                                     # アプリケーションのログファイル
│       └── laravel.log                           # Laravelのメインログファイル
│
├── tests/                                        # アプリケーションの自動テスト
│   ├── Feature/                                  # アプリケーションの機能テスト
│   │   └── ExampleTest.php                       # 機能テストの例
│   │
│   ├── Unit/                                     # アプリケーションのユニットテスト
│   │   └── ExampleTest.php                       # ユニットテストの例
│   │
│   └── TestCase.php                              # テストケースの基底クラス
│
├── artisan                                       # Laravel Artisan CLIの実行スクリプト
├── composer.json                                 # Composerのプロジェクト設定ファイル
├── composer.lock                                 # Composerの依存関係ロックファイル
├── package-lock.json                             # npmの依存関係ロックファイル
├── package.json                                  # npmのプロジェクト設定ファイル
├── phpunit.xml                                   # PHPUnitのテスト設定ファイル
├── postcss.config.js                             # PostCSSの設定ファイル
├── README.md                                     # プロジェクトの概要と説明
├── tailwind.config.js                            # Tailwind CSSの設定ファイル
└── vite.config.js                                # Viteの設定ファイル
```

---
