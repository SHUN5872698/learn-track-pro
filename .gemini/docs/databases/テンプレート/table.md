### テーブル定義書

#### 1. `users` テーブル (既存)

ユーザー情報を管理するテーブルです。Fortifyによって認証機能が提供されており、各Todoは特定のユーザーに紐付けられます。

| カラム名            | データ型          | 属性                 | 説明                               |
| :------------------ | :---------------- | :------------------- | :--------------------------------- |
| `id`                | `BIGINT UNSIGNED` | `PRIMARY KEY`, `AUTO_INCREMENT` | ユーザーID (主キー)                |
| `name`              | `VARCHAR(255)`    | `NOT NULL`           | ユーザー名                         |
| `email`             | `VARCHAR(255)`    | `NOT NULL`, `UNIQUE` | メールアドレス (ユニーク)          |
| `email_verified_at` | `TIMESTAMP`       | `NULLABLE`           | メール認証日時                     |
| `password`          | `VARCHAR(255)`    | `NOT NULL`           | パスワード (ハッシュ化済み)        |
| `remember_token`    | `VARCHAR(100)`    | `NULLABLE`           | ログイン状態維持のためのトークン     |
| `created_at`        | `TIMESTAMP`       | `NULLABLE`           | レコード作成日時                   |
| `updated_at`        | `TIMESTAMP`       | `NULLABLE`           | レコード最終更新日時               |

#### 2. `tasks` テーブル (新規)

各ユーザーが作成するTodoアイテムを管理するテーブルです。

| カラム名        | データ型          | 属性                 | 説明                               |
| :-------------- | :---------------- | :------------------- | :--------------------------------- |
| `id`            | `BIGINT UNSIGNED` | `PRIMARY KEY`, `AUTO_INCREMENT` | Task ID (主キー)                   |
| `user_id`       | `BIGINT UNSIGNED` | `NOT NULL`, `FOREIGN KEY` | Taskを作成したユーザーのID (`users.id`を参照) |
| `title`         | `VARCHAR(255)`    | `NOT NULL`           | Taskのタイトル                     |
| `description`   | `TEXT`            | `NULLABLE`           | Taskの詳細な説明                   |
| `completed`     | `BOOLEAN`         | `NOT NULL`, `DEFAULT 0` | Taskの完了状態 (0: 未完了, 1: 完了) |
| `created_at`    | `TIMESTAMP`       | `NULLABLE`           | レコード作成日時                   |
| `updated_at`    | `TIMESTAMP`       | `NULLABLE`           | レコード最終更新日時               |

**外部キー制約:**
- `tasks.user_id` は `users.id` を参照します。
- 関連付け: `ON DELETE CASCADE` (ユーザーが削除された場合、そのユーザーのTaskも全て削除されます)
