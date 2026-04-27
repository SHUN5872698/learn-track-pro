# コードレビュー チェックリスト

このチェックリストは `SKILL.md` のStep 2で参照するために使用する。
対象ファイルの種別に応じたセクションを適用すること。

---

## Laravel チェックリスト

### アーキテクチャ・レイヤー責任分離

- [ ] Controllerでビジネスロジックを直接実装していないか（🟡 Warning）
- [ ] Controllerは `final class` として定義されているか（🟡 Warning）
- [ ] ModelはEloquentリレーションシップ・スコープのみを持ち、ビジネスロジックを含んでいないか（🟡 Warning）
- [ ] Modelは `final class` として定義されているか（🟡 Warning）
- [ ] サービス層が適切なディレクトリに配置されているか（`app/Services/Application/` または `app/Services/Domain/`）（🟡 Warning）
- [ ] リポジトリパターンを使用する場合、インターフェイスが定義されているか（🟢 Suggestion）
- [ ] `DB::table()` を使った複雑なクエリがControllerに直接記述されていないか（🟢 Suggestion）
  - ※ リポジトリパターン未導入のプロジェクトではWarningではなくSuggestionとして扱う

### コードスタイル・構造

- [ ] `declare(strict_types=1);` が宣言されているか（🟡 Warning）
- [ ] PSR-12コーディング規約に準拠しているか（🟡 Warning）
- [ ] ファイル記載順序が規約通りか（strict_types → namespace → 外部import → 内部import → クラス定義）（🟡 Warning）
- [ ] `use` のグループ分け（外部/内部）と順序が正しいか（🟢 Suggestion）
- [ ] 説明的な変数名・メソッド名を使用しているか（🟢 Suggestion）

### 命名規則

- [ ] クラス名がPascalCaseか（🟡 Warning）
- [ ] コントローラー名が単数形 + `Controller` 形式か（例: `UserController`）（🟡 Warning）
- [ ] サービス名が機能名 + `Service` 形式か（例: `AuthenticationService`）（🟡 Warning）
- [ ] メソッド名がcamelCaseか（🟡 Warning）
- [ ] DBテーブル名が複数形snake_caseか（🟡 Warning）
- [ ] 外部キーが `単数形_id` 形式か（🟡 Warning）

### Eloquent・データベース

- [ ] スキーマ変更がマイグレーションで実施されているか（🟡 Warning）
- [ ] N+1問題が発生しないようにEager Loadingが使用されているか（🟡 Warning）
- [ ] 適切なインデックスが設定されているか（🟢 Suggestion）
- [ ] データ整合性のためトランザクションが適切に使用されているか（🟡 Warning）

### API開発

- [ ] RESTfulエンドポイント設計にしたがっているか（🟡 Warning）
- [ ] APIリソース（`Http/Resources`）でレスポンスをフォーマットしているか（🟡 Warning）
- [ ] FormRequestでバリデーションを実装しているか（🟡 Warning）
- [ ] 適切なHTTPステータスコードを返しているか（🟡 Warning）

### エラーハンドリング

- [ ] 適切な例外クラスを定義・使用しているか（🟡 Warning）
- [ ] レスポンスに一貫性のあるJSONフォーマットを使用しているか（🟡 Warning）

---

## Vue.js チェックリスト

### コードスタイル・構造（Vue.js）

- [ ] `<script setup>` 構文を使用しているか（Options API禁止）（🔴 Critical）
- [ ] TypeScriptを使用していないか（.jsのみ使用、.ts禁止）（🔴 Critical）
- [ ] `<script setup>` 内の記載順序が規約通りか（🟡 Warning）
  - 外部インポート → 内部インポート → ユーティリティ関数 → 初期設定 → 状態管理 → 算出プロパティ → ライフサイクル → メソッド
- [ ] セクションコメント（`// ========================================`）で適切に区切られているか（🟢 Suggestion）
- [ ] インデントがスペース2個か（🟡 Warning）

### 命名規則（Vue.js）

- [ ] コンポーネントファイル名がPascalCaseか（例: `AuthWizard.vue`）（🟡 Warning）
- [ ] ディレクトリ名がkebab-caseか（例: `auth-wizard/`）（🟡 Warning）
- [ ] Composablesが `use` プレフィックス + camelCaseか（例: `useAuthState.js`）（🟡 Warning）
- [ ] ブール値変数が `is/has/can` 接頭辞を使用しているか（🟢 Suggestion）
- [ ] ルートの `name` プロパティがkebab-caseか（例: `learning-detail`）（🟡 Warning）

### 状態管理・データ操作

- [ ] `const` を基本とし、再代入が必要な場合のみ `let` を使用しているか（🟡 Warning）
- [ ] 単一の値は `ref`、複数フィールドのフォームは `reactive` を使用しているか（🟡 Warning）
- [ ] コンポーザブル化すべき条件（Create/Edit両方で使う、複雑なバリデーション等）に該当するか確認したか（🟡 Warning）
- [ ] Piniaストアの責務が適切に分離されているか（🟢 Suggestion）

### バリデーション実装

- [ ] バリデーターが個別関数として適切に分離されているか（例: `validateSectionId`）（🟡 Warning）
- [ ] バリデーター関数の戻り値が `{ isValid: boolean, message: string }` 形式か（🟡 Warning）
- [ ] 文字列マッチングでエラーを振り分けるアンチパターンを避けているか（🟡 Warning）

### UI・スタイリング

- [ ] TailwindCSSユーティリティクラスのみを使用しているか（カスタムCSSクラス禁止）（🔴 Critical）
- [ ] Bootstrapライクなクラス（`btn-primary`等）を使用していないか（🔴 Critical）
- [ ] モバイルファーストのレスポンシブデザインを実装しているか（🟡 Warning）
- [ ] 禁止ブレークポイント（`sm:` / `xl:`）を使用していないか（🟡 Warning）
- [ ] プロジェクトカラーパレット（violet-600、emerald-600、slate系）に準拠しているか（🟢 Suggestion）

---

## 共通チェックリスト

### セキュリティ

- [ ] SQLインジェクションのリスクがないか（Eloquent/QueryBuilderを使用しているか）（🔴 Critical）
- [ ] 認証・認可が適切に実装されているか（Sanctum等）（🔴 Critical）
- [ ] XSS防止のための適切なエスケープがされているか（🔴 Critical）
- [ ] 機密情報（APIキー・パスワード等）がコードにハードコードされていないか（🔴 Critical）
- [ ] CORS設定が適切か（SPA向け）（🟡 Warning）
- [ ] 認証エンドポイントにレート制限があるか（🟡 Warning）

### パフォーマンス

- [ ] 不要なデータ取得（過剰なカラム取得等）がないか（🟡 Warning）
- [ ] APIレスポンスにページネーションが実装されているか（データ量が多い場合）（🟡 Warning）
- [ ] 適切なキャッシュが実装されているか（必要な場合）（🟢 Suggestion）

### 可読性・保守性

- [ ] コードの重複がないか（DRY原則）（🟡 Warning）
- [ ] 複雑なロジックに適切なコメントがあるか（🟢 Suggestion）
- [ ] 未使用のインポート・変数・コードがないか（🟢 Suggestion）
