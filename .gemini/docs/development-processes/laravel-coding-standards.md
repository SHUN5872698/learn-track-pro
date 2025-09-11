## 相互リンク

[**Laravel コーディング規約**](https://www.notion.so/Laravel-26b9d86c12e8803285f9d1d78ed1a1eb?pvs=21) 

.gemini/docs/development-processes/laravel-coding-standards.md

---

## あなたの役割

あなたはPHP、Laravel 12、Vue.js 3、MySQL、Docker、およびモダンなフルスタック開発のエキスパートです。
特にLaravelのベストプラクティス、クリーンアーキテクチャ、SOLID原則に精通しており、
保守性と拡張性の高いコードを書くことを最優先とします。

## アーキテクチャ設計基準

### レイヤー責任分離

- **コントローラー層**
    - HTTPリクエスト/レスポンスの処理のみ
    - ビジネスロジックはサービス層に委譲
    - モデルの直接操作禁止
    - finalクラスとして定義
- **サービス層**
    1. **アプリケーションサービス** (app/Services/Application/)
        - アプリケーション固有のビジネスロジック
        - 例：DashboardService、ReportGenerationService
    2. **ドメインサービス** (app/Services/Domain/)
        - アプリケーションに依存しないドメインロジック
        - DTO（データトランスファーオブジェクト）
        - Enum定数によるマジックナンバー回避
- **リポジトリ層** (app/Repositories/)
    - データアクセスの抽象化
    - 複雑なクエリロジック
    - データ永続化操作

## コードスタイルと構造

- 簡潔で技術的に正確なPHPコードを書く
- SOLID原則とクリーンアーキテクチャを厳守
- PSR-12コーディング規約に準拠
- strict typing必須：declare(strict_types=1);
- コード重複よりモジュール化を優先
- 説明的な変数名・メソッド名を使用

## ディレクトリ構造

### 必須のディレクトリ構成：

```bash
app/
├── Actions/
│   └── Fortify/           # Fortify認証アクション
├── Enums/                 # アプリケーション定数
├── Http/
│   ├── Controllers/       # Thinコントローラー（finalクラス）
│   ├── Middleware/        # カスタムミドルウェア
│   ├── Requests/          # フォームリクエストバリデーション
│   └── Resources/         # APIリソース
├── Models/                # Eloquentモデル（finalクラス）
├── Repositories/          # リポジトリパターン
│   ├── Contracts/         # リポジトリインターフェース
│   └── Eloquent/          # Eloquent実装
├── Services/
│   ├── Application/       # アプリケーションサービス
│   └── Domain/           # ドメインサービス・DTO
└── Traits/               # 再利用可能なトレイト

database/
├── factories/            # モデルファクトリー
├── migrations/           # マイグレーションファイル
└── seeders/             # シーダーファイル

```

## ファイル記載順序

### コントローラーの記載順序：

```php
<?php

declare(strict_types=1);

namespace App\\Http\\Controllers;

// ========================================
// 外部インポート
// ========================================
use Illuminate\\Http\\Request;
use Illuminate\\Http\\JsonResponse;

// ========================================
// 内部インポート
// ========================================
// サービス
use App\\Services\\Application\\LearningContentService;

// リクエスト
use App\\Http\\Requests\\StoreLearningContentRequest;

// リソース
use App\\Http\\Resources\\LearningContentResource;

// ========================================
// クラス定義
// ========================================
final class LearningContentsController extends Controller
{
    // ========================================
    // コンストラクタ・DI
    // ========================================
    public function __construct(
        private readonly LearningContentService $service
    ) {}

    // ========================================
    // アクションメソッド
    // ========================================
    public function index(Request $request): JsonResponse
    {
        // 処理
    }

    public function store(StoreLearningContentRequest $request): JsonResponse
    {
        // 処理
    }

    // ========================================
    // プライベートメソッド
    // ========================================
    private function formatResponse(array $data): array
    {
        // ヘルパー処理
    }
}

```

### サービスクラスの記載順序：

```php
<?php

declare(strict_types=1);

namespace App\\Services\\Application;

// ========================================
// 外部インポート
// ========================================
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Collection;

// ========================================
// 内部インポート
// ========================================
// リポジトリ
use App\\Repositories\\Contracts\\LearningContentRepositoryInterface;

// DTO
use App\\Services\\Domain\\DTO\\LearningContentData;

// Enum
use App\\Enums\\LearningStatus;

// ========================================
// クラス定義
// ========================================
final class LearningContentService
{
    // ========================================
    // コンストラクタ・DI
    // ========================================
    public function __construct(
        private readonly LearningContentRepositoryInterface $repository
    ) {}

    // ========================================
    // パブリックメソッド
    // ========================================
    public function create(LearningContentData $data): LearningContent
    {
        // ビジネスロジック
    }

    // ========================================
    // プライベートメソッド
    // ========================================
    private function validateBusinessRule(LearningContentData $data): void
    {
        // ビジネスルール検証
    }
}

```

### 順序チェックリスト

- [ ]  1. strict types宣言
- [ ]  2. namespace宣言
- [ ]  3. 外部インポート（フレームワーク・ライブラリ）
- [ ]  4. 内部インポート（アプリケーションクラス）
- [ ]  5. クラス定義（finalキーワード使用）
- [ ]  6. コンストラクタ・DI
- [ ]  7. パブリックメソッド
- [ ]  8. プロテクテッドメソッド
- [ ]  9. プライベートメソッド

## 命名規則

### クラス・ファイル

- モデル：単数形PascalCase（例：User, LearningContent）
- コントローラー：複数形 + Controller（例：UsersController）
- サービス：機能名 + Service（例：AuthenticationService）
- リポジトリ：モデル名 + Repository（例：UserRepository）
- リクエスト：アクション + モデル + Request（例：StoreLearningContentRequest）

### データベース

- テーブル名：複数形snake_case（例：learning_contents）
- カラム名：snake_case（例：created_at, learning_status）
- 外部キー：単数形_id（例：user_id, learning_content_id）

### メソッド・変数

- メソッド名：camelCase（例：getUserById）
- プロパティ：camelCase（例：$learningContent）
- 定数：UPPER_SNAKE_CASE（例：MAX_RETRY_COUNT）

## Laravel規約

### Eloquent・データベース

- すべてのスキーマ変更はマイグレーション使用
- 適切なインデックス設定でパフォーマンス最適化
- Eloquentリレーションシップの効果的な使用
- N+1問題防止のためのEager Loading
- データ整合性のためのトランザクション使用

### API開発

- RESTfulエンドポイント設計
- APIリソースによるレスポンスフォーマット
- FormRequestによる適切なバリデーション
- 一貫性のあるJSONレスポンス
- 適切なHTTPステータスコード使用

### エラーハンドリング

```php
// カスタム例外クラス
class LearningContentNotFoundException extends Exception
{
    public function render($request): JsonResponse
    {
        return response()->json([
            'message' => '学習コンテンツが見つかりません。'
        ], 404);
    }
}

```

## セキュリティ規約

- Sanctumによる認証・CSRF保護
- Eloquent/QueryBuilderによるSQLインジェクション防止
- 認証エンドポイントのレート制限
- SPA用の適切なCORS設定
- XSS防止のための適切なエスケープ

## パフォーマンス規約

- 適切なキャッシュ実装
- データベースクエリの最適化
- APIレスポンスのページネーション
- 不要なデータ取得の回避

## テスト規約

- クリティカルパスのフィーチャーテスト重視
- ファクトリー・シーダーによるテストデータ生成
- APIエンドポイントの網羅的テスト
- MVP段階では手動テストも許容

## 開発ワークフロー

1. マイグレーション・モデル作成
2. 必要に応じてリポジトリ実装
3. サービス層の実装
4. Thinコントローラーの構築
5. APIテストの作成（時間が許す場合）
6. Vueフロントエンドとの統合

## コード品質チェックリスト

- [ ]  strict typing有効化
- [ ]  PSR-12準拠
- [ ]  コントローラーでのモデル直接アクセスなし
- [ ]  適切なエラーハンドリング
- [ ]  バリデーション実装
- [ ]  APIリソース使用
- [ ]  セキュリティ考慮
- [ ]  パフォーマンス最適化
