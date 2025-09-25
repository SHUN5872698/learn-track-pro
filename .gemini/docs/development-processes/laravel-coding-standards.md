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

### APIレスポンス統一ルール

#### レスポンスフォーマット規約
1. **Fortify認証系・User系**: dataラップなし
   ```json
   // 例: GET /api/user
   {
     "id": 1,
     "name": "山田太郎",
     "email": "yamada@example.com"
   }
   ```
   - 備考: `/fortify/register`はAcceptヘッダーにより挙動が変化
     - `Accept: application/json` → 201（空ボディ）
     - `Accept: text/html` → 302リダイレクト

2. **Resource使用API（CRUD系）**: 自動dataラップ
   ```json
   // 例: GET /api/learning-contents/1
   {
     "data": {
       "id": 1,
       "title": "Laravel入門",
       "sections": [...]
     }
   }
   ```
   - 対象: LearningContent, LearningSession, Section等
   - Laravel Resourceの標準機能を活用

3. **Resource未使用API**: 手動dataラップ（必要に応じて）
   ```php
   return response()->json([
       'data' => $result,
       'message' => '処理が完了しました'
   ]);
   ```

4. **統計・集計API**: dataラップなし（生配列）
   ```json
   // 例: GET /api/statistics/monthly
   [
     {"month": "2025-01", "total_minutes": 1200},
     {"month": "2025-02", "total_minutes": 1500}
   ]
   ```
   - シンプルなデータ構造を維持

5. **削除API**: メッセージのみ
   ```json
   // 例: DELETE /api/learning-contents/1
   {
     "message": "学習内容を削除しました。"
   }
   ```
   - HTTPステータスコード: 200または204

#### フロントエンド側の処理例
```javascript
// Resource系（dataラップあり）
const content = response.data.data;

// 統計系（dataラップなし）
const statistics = response.data;

// 削除系（メッセージのみ）
const { message } = response.data;
toast.success(message);

// エラー処理
if (response.data.errors) {
  // バリデーションエラー
  const errors = response.data.errors;
}
```

#### レスポンス実装例
```php
// コントローラーでの実装例
final class LearningContentsController extends Controller
{
    // Resource使用（自動dataラップ）
    public function show(LearningContent $learningContent): JsonResponse
    {
        return new LearningContentResource($learningContent);
    }
    
    // 統計API（dataラップなし）
    public function statistics(): JsonResponse
    {
        $data = $this->service->getStatistics();
        return response()->json($data);
    }
    
    // 削除API（メッセージのみ）
    public function destroy(LearningContent $learningContent): JsonResponse
    {
        $this->service->delete($learningContent);
        return response()->json([
            'message' => '学習内容を削除しました。'
        ]);
    }
}
```

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

## APIレスポンスチェックリスト

- [ ] Fortify/User系はdataラップなし
- [ ] CRUD系はResource使用で自動dataラップ
- [ ] 統計・集計系はdataラップなし（生配列）
- [ ] 削除系はメッセージのみ返却
- [ ] エラーレスポンスの形式統一
- [ ] HTTPステータスコードの適切な使用
- [ ] フロントエンド側の処理を考慮した設計
