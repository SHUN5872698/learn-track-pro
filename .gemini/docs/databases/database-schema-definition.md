## users テーブル

ユーザー情報を管理するテーブルです。

| データ型 | カラム名 | 属性 | 説明 |
| --- | --- | --- | --- |
| bigint | `id` | PRIMARY KEY | ユーザーID (主キー) |
| string | `name` | NOT NULL | ユーザー名 |
| string | `avatar` | NULLABLE | プロフィール画像 |
| string | `email` | NOT NULL, UNIQUE | メールアドレス (ユニーク) |
| timestamp | `email_verified_at` | NULLABLE | メール認証日時 |
| string | `password` | NOT NULL | パスワード (ハッシュ化済み) |
| string | `remember_token` | NULLABLE | ログイン状態維持のためのトークン |
| timestamp | `created_at` | NOT NULL | レコード作成日時 |
| timestamp | `updated_at` | NOT NULL | レコード最終更新日時 |

---

## categories テーブル

技術カテゴリーを管理するテーブルです。マスターデータとして事前にSeederで投入されます（プログラミング言語、開発環境・ツール、その他）。

| データ型 | カラム名 | 属性 | 説明 |
| --- | --- | --- | --- |
| bigint | `id` | PRIMARY KEY | カテゴリーID (主キー) |
| string | `name` | NOT NULL | カテゴリー名 |
| string | `icon` | NOT NULL | カテゴリーのアイコン |
| text | `description` | NULLABLE | カテゴリーの説明 |
| timestamp | `created_at` | NOT NULL | レコード作成日時 |
| timestamp | `updated_at` | NOT NULL | レコード最終更新日時 |

### 初期データ

- Programming: プログラミング言語、フレームワーク、ライブラリ
- Infrastructure: サーバー、ネットワーク、クラウド、コンテナ技術
- Service: Webサービス、開発ツール、生産性向上ツール
    - AWSやAzureなどはこれに含める
- Development: 設計、開発手法、プロジェクト管理、実践的な開発
- AI: AI、機械学習、LLM、プロンプトエンジニアリング
- Other: ビジネススキル、マインドセット、その他の学習

---

## technologies テーブル

学習内容で利用される技術情報を管理するテーブルです。Seederで初期データを投入し、ユーザーは選択のみ可能です。

| データ型 | カラム名 | 属性 | 説明 |
| --- | --- | --- | --- |
| bigint | `id` | PRIMARY KEY | 技術ID (主キー) |
| bigint | `category_id` | FOREIGN KEY | カテゴリーID (categories.idを参照) |
| string | `name` | NOT NULL | 技術名 |
| string | `icon` | NOT NULL | 技術のアイコン |
| timestamp | `created_at` | NOT NULL | レコード作成日時 |
| timestamp | `updated_at` | NOT NULL | レコード最終更新日時 |

**外部キー制約:**

- `technologies.category_id` は `categories.id` を参照します。

---

## learning_contents テーブル

学習内容そのものの情報を管理するテーブルです。

| データ型 | カラム名 | 属性 | 説明 |
| --- | --- | --- | --- |
| bigint | `id` | PRIMARY KEY | 学習内容ID (主キー) |
| bigint | `user_id` | FOREIGN KEY | 学習内容を作成したユーザーのID (users.idを参照) |
| bigint | `technology_id` | FOREIGN KEY | 使用されている技術のID (technologies.idを参照) |
| string | `title` | NOT NULL | コンテンツのタイトル |
| text | `description` | NULLABLE | コンテンツの詳細な説明 |
| int | `total_sections` | DEFAULT 0 | コンテンツの総セクション数
- 最低1つ必須だが、アプリケーション側で制御 |
| int | `completed_sections` | DEFAULT 0 | 完了したセクション数 |
| enum | `status` | DEFAULT 'not_started' | 学習状態 |
| timestamp | `completed_at` | NULLABLE | 完了日時 |
| timestamp | `created_at` | NOT NULL | レコード作成日時 |
| timestamp | `updated_at` | NOT NULL | レコード最終更新日時 |

### ステータス値の説明:

- **not_started**: 未着手（初期状態）
- **in_progress**: 学習中（学習記録が1回以上ある状態）
- **completed**: 完了（ユーザーが明示的に完了マークした状態）

### 外部キー制約:

- `learning_contents.user_id` は `users.id` を参照します。
- `learning_contents.technology_id` は `technologies.id` を参照します。

### 制約事項:

- **total_sections は必ず1以上である必要があります**（学習内容作成時に最低1つのセクションが必須）
- MySQLバージョンの互換性を考慮し、DEFAULT値を0としてアプリケーション層で制御
- Laravel側でのバリデーション: `'total_sections' => 'required|integer|min:1'`
- Vue.js側でも作成・編集時に最低1セクションの入力を必須とする

### 補足:

- コンテンツの総セクション数と完了したセクション数はパフォーマンス最適化のためカウンター方式で管理
- セクションの追加・削除時には`total_sections`を自動更新
- セクション完了時には`completed_sections`を自動更新

---

## sections テーブル

学習内容内のセクション情報を管理するテーブルです。

| データ型 | カラム名 | 属性 | 説明 |
| --- | --- | --- | --- |
| bigint | `id` | PRIMARY KEY | セクションID (主キー) |
| bigint | `learning_content_id` | FOREIGN KEY | 所属する学習内容のID (learning_contents.idを参照) |
| string | `title` | NOT NULL | セクションのタイトル |
| int | `order` | NOT NULL | セクションの並び順 |
| enum | `status` | DEFAULT 'not_started' | セクションのステータス ('not_started', 'in_progress', 'completed') |
| timestamp | `completed_at` | NULLABLE | 完了日時 |
| timestamp | `created_at` | NOT NULL | レコード作成日時 |
| timestamp | `updated_at` | NOT NULL | レコード最終更新日時 |

**ステータス値の説明:**

- **not_started**: 未着手（初期状態）
- **in_progress**: 学習中（学習記録が1回以上ある状態）
- **completed**: 完了（ユーザーが明示的に完了マークした状態）

**外部キー制約:**

- `sections.learning_content_id` は `learning_contents.id` を参照します。

---

## learning_sessions テーブル

ユーザーの学習セッション（学習記録）を管理するテーブルです。

| データ型 | カラム名 | 属性 | 説明 |
| --- | --- | --- | --- |
| bigint | `id` | PRIMARY KEY | 学習セッションID (主キー) |
| bigint | `user_id` | FOREIGN KEY | セッションを作成したユーザーのID (users.idを参照) |
| bigint | `learning_content_id` | FOREIGN KEY | 関連する学習内容のID (learning_contents.idを参照) |
| bigint | `section_id` | FOREIGN KEY, NOT NULL | 学習したセクションのID (sections.idを参照、必須) |
| int | `study_minutes` | NOT NULL | 学習時間（分） |
| text | `memo` | NULLABLE | セッションのメモ |
| int | `mood_rating` | NULLABLE | 調子評価（1-5段階） |
| enum | `session_type` | DEFAULT 'manual' | セッションのタイプ ('manual', 'stopwatch') |
| timestamp | `studied_at` | NOT NULL | 学習日時 |
| timestamp | `created_at` | NOT NULL | レコード作成日時 |
| timestamp | `updated_at` | NOT NULL | レコード最終更新日時 |

**セッションタイプの説明:**

- **manual**: 手動入力（時間を手入力で記録）
- **stopwatch**: ストップウォッチ（自動計測で記録）※条件付き実装

**外部キー制約:**

- `learning_sessions.user_id` は `users.id` を参照します。
- `learning_sessions.learning_content_id` は `learning_contents.id` を参照します。
- `learning_sessions.section_id` は `sections.id` を参照します。

---

## ビジネスルール

### セクション必須化ルール

1. **学習内容作成時のセクション必須化**
    - すべての学習内容は最低1つのセクションを持つ必要があります
    - 新規作成時、デフォルトで1つのセクションが自動作成されます
    - セクション数が0になる削除操作は禁止されます
2. **学習記録のセクション紐付け必須化**
    - すべての学習記録（learning_sessions）は必ず特定のセクションに紐づきます
    - セクションなしの学習記録は作成できません
3. **進捗率計算の保証**
    - `total_sections` が常に1以上であることにより、進捗率計算での0除算エラーを防止
    - 進捗率 = `completed_sections` / `total_sections` × 100

---
