## 相互リンク

[**セクション管理API設計**](https://www.notion.so/API-2569d86c12e880b2a4e4e65977b0fe11?pvs=21) 

.gemini/docs/apis/endpoint-docs/セクション管理API.md

---

## RESTful エンドポイント

```bash
GET    /api/learning-contents/{id}/sections   # セクション一覧
POST   /api/learning-contents/{id}/sections   # セクション追加
PUT    /api/sections/{id}                     # セクション編集
DELETE /api/sections/{id}                     # セクション削除
PUT    /api/sections/{id}/status              # ステータス変更
PUT    /api/learning-contents/{id}/sections/bulk # セクション一括更新

```

---

## 1. セクション一覧取得

- **Method**: GET
- **URL**: `/api/learning-contents/{id}/sections`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Path Parameters**:

| Parameter | Type | Description |
| --- | --- | --- |
| id | integer | 学習内容ID |

**Mock Response 200（例: learning_content_id=2の場合）**:

```json
[
    {
        "id": 21,
        "learning_content_id": 2,
        "title": "Vue.jsの基本",
        "order": 1,
        "status": "completed",
        "created_at": "2023-11-15T00:00:00.000000Z",
        "updated_at": "2024-08-18T13:00:00.000000Z"
    },
    {
        "id": 22,
        "learning_content_id": 2,
        "title": "Composition API",
        "order": 2,
        "status": "completed",
        "created_at": "2023-11-15T00:00:00.000000Z",
        "updated_at": "2024-08-19T10:00:00.000000Z"
    },
    {
        "id": 23,
        "learning_content_id": 2,
        "title": "Vue Router",
        "order": 3,
        "status": "completed",
        "created_at": "2023-11-15T00:00:00.000000Z",
        "updated_at": "2024-08-20T14:30:00.000000Z"
    },
    {
        "id": 24,
        "learning_content_id": 2,
        "title": "Vuex/Pinia",
        "order": 4,
        "status": "completed",
        "created_at": "2023-11-15T00:00:00.000000Z",
        "updated_at": "2024-08-21T09:00:00.000000Z"
    },
    {
        "id": 25,
        "learning_content_id": 2,
        "title": "コンポーネント設計",
        "order": 5,
        "status": "completed",
        "created_at": "2023-11-15T00:00:00.000000Z",
        "updated_at": "2024-08-22T13:30:00.000000Z"
    },
    {
        "id": 26,
        "learning_content_id": 2,
        "title": "TypeScript統合",
        "order": 6,
        "status": "completed",
        "created_at": "2023-11-15T00:00:00.000000Z",
        "updated_at": "2024-08-23T10:00:00.000000Z"
    },
    {
        "id": 27,
        "learning_content_id": 2,
        "title": "テスト戦略",
        "order": 7,
        "status": "completed",
        "created_at": "2023-11-15T00:00:00.000000Z",
        "updated_at": "2024-08-24T14:00:00.000000Z"
    },
    {
        "id": 28,
        "learning_content_id": 2,
        "title": "パフォーマンス最適化",
        "order": 8,
        "status": "completed",
        "created_at": "2023-11-15T00:00:00.000000Z",
        "updated_at": "2024-08-25T11:00:00.000000Z"
    },
    {
        "id": 29,
        "learning_content_id": 2,
        "title": "SSRとNuxt.js",
        "order": 9,
        "status": "completed",
        "created_at": "2023-11-15T00:00:00.000000Z",
        "updated_at": "2024-08-26T09:30:00.000000Z"
    },
    {
        "id": 30,
        "learning_content_id": 2,
        "title": "カスタムディレクティブ",
        "order": 10,
        "status": "not_started",
        "created_at": "2023-11-15T00:00:00.000000Z",
        "updated_at": "2023-11-15T00:00:00.000000Z"
    },
    {
        "id": 31,
        "learning_content_id": 2,
        "title": "プラグイン開発",
        "order": 11,
        "status": "not_started",
        "created_at": "2023-11-15T00:00:00.000000Z",
        "updated_at": "2023-11-15T00:00:00.000000Z"
    },
    {
        "id": 32,
        "learning_content_id": 2,
        "title": "アニメーション",
        "order": 12,
        "status": "not_started",
        "created_at": "2023-11-15T00:00:00.000000Z",
        "updated_at": "2023-11-15T00:00:00.000000Z"
    },
    {
        "id": 33,
        "learning_content_id": 2,
        "title": "国際化（i18n）",
        "order": 13,
        "status": "not_started",
        "created_at": "2023-11-15T00:00:00.000000Z",
        "updated_at": "2023-11-15T00:00:00.000000Z"
    },
    {
        "id": 34,
        "learning_content_id": 2,
        "title": "PWA対応",
        "order": 14,
        "status": "not_started",
        "created_at": "2023-11-15T00:00:00.000000Z",
        "updated_at": "2023-11-15T00:00:00.000000Z"
    },
    {
        "id": 35,
        "learning_content_id": 2,
        "title": "デプロイ戦略",
        "order": 15,
        "status": "not_started",
        "created_at": "2023-11-15T00:00:00.000000Z",
        "updated_at": "2023-11-15T00:00:00.000000Z"
    }
]

```

**Mock Response 404**:

```json
{
    "message": "学習内容が見つかりません。"
}

```

---

## 2. セクション追加

- **Method**: POST
- **URL**: `/api/sections`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Request Body (JSON)**:

```json
{
    "learning_content_id": 2,
    "title": "Vue3の新機能",
    "order": 16
}

```

**Mock Response 201**:

```json
{
    "id": 130,
    "learning_content_id": 2,
    "title": "Vue3の新機能",
    "order": 16,
    "status": "not_started",
    "created_at": "2025-09-08T12:00:00.000000Z",
    "updated_at": "2025-09-08T12:00:00.000000Z",
    "message": "セクションを追加しました。"
}

```

**Mock Response 422**:

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "title": ["セクションタイトルは必須です。"],
        "learning_content_id": ["学習内容IDは必須です。"],
        "order": ["並び順は1以上の整数である必要があります。"]
    }
}

```

---

## 3. セクション編集

- **Method**: PUT
- **URL**: `/api/sections/{id}`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Path Parameters**:

| Parameter | Type | Description |
| --- | --- | --- |
| id | integer | セクションID |

**Request Body (JSON)**:

```json
{
    "title": "カスタムディレクティブ（応用編）",
    "order": 10
}

```

**Mock Response 200（例: id=30の場合）**:

```json
{
    "id": 30,
    "learning_content_id": 2,
    "title": "カスタムディレクティブ（応用編）",
    "order": 10,
    "status": "not_started",
    "created_at": "2023-11-15T00:00:00.000000Z",
    "updated_at": "2025-09-08T12:15:00.000000Z",
    "message": "セクションを更新しました。"
}

```

**Mock Response 404**:

```json
{
    "message": "セクションが見つかりません。"
}

```

**Mock Response 422**:

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "title": ["セクションタイトルは必須です。"],
        "order": ["並び順は1以上の整数である必要があります。"]
    }
}

```

---

## 4. セクション削除

- **Method**: DELETE
- **URL**: `/api/sections/{id}`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Path Parameters**:

| Parameter | Type | Description |
| --- | --- | --- |
| id | integer | セクションID |

**Mock Response 200**:

```json
{
    "message": "セクションを削除しました。"
}

```

**Mock Response 404**:

```json
{
    "message": "セクションが見つかりません。"
}

```

**Mock Response 422（学習記録が存在する場合）**:

```json
{
    "message": "学習記録が存在するセクションは削除できません。"
}

```

**Mock Response 422（最後のセクションを削除しようとした場合）- 新規追加**:

```json
{
    "message": "最後のセクションは削除できません。学習内容には最低1つのセクションが必要です。"
}

```

---

## 5. セクションステータス変更

- **Method**: PUT
- **URL**: `/api/sections/{id}/status`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Path Parameters**:

| Parameter | Type | Description |
| --- | --- | --- |
| id | integer | セクションID |

**Request Body (JSON)**:

```json
{
    "status": "in_progress"
}

```

**Status Values**:

- `not_started`: 未着手
- `in_progress`: 学習中
- `completed`: 完了

**Mock Response 200（例: id=30を学習中にする場合）**:

```json
{
    "id": 30,
    "learning_content_id": 2,
    "title": "カスタムディレクティブ",
    "order": 10,
    "status": "in_progress",
    "created_at": "2023-11-15T00:00:00.000000Z",
    "updated_at": "2025-09-08T12:30:00.000000Z",
    "message": "セクションのステータスを更新しました。"
}

```

**Mock Response 200（例: id=80を完了にする場合）**:

```json
{
    "id": 80,
    "learning_content_id": 4,
    "title": "セキュリティとベストプラクティス",
    "order": 10,
    "status": "completed",
    "created_at": "2025-09-10T09:00:00.000000Z",
    "updated_at": "2025-09-08T13:00:00.000000Z",
    "message": "セクションのステータスを更新しました。"
}

```

**Mock Response 404**:

```json
{
    "message": "セクションが見つかりません。"
}

```

**Mock Response 422**:

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "status": ["ステータスは not_started, in_progress, completed のいずれかである必要があります。"]
    }
}

```

---

## セクション一括更新

- **Method**: PUT
- **URL**: `/api/learning-contents/{id}/sections/bulk`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Request Body (JSON)**:

```json
{
  "sections": [
    {
      "id": 21,
      "title": "環境構築（更新）",
      "order": 1
    },
    {
      "id": 22,
      "title": "認証機能実装",
      "order": 2
    },
    {
      "id": null,
      "title": "テスト実装",
      "order": 3
    },
    {
      "id": null,
      "title": "デプロイ",
      "order": 4
    }
  ],
  "deleted_section_ids": [23, 24]
}

```

**Mock Response 200**:

```json
{
  "sections": [
    {
      "id": 21,
      "learning_content_id": 2,
      "title": "環境構築（更新）",
      "order": 1,
      "status": "completed",
      "created_at": "2023-11-15T00:00:00.000000Z",
      "updated_at": "2025-09-08T12:00:00.000000Z"
    },
    {
      "id": 22,
      "learning_content_id": 2,
      "title": "認証機能実装",
      "order": 2,
      "status": "in_progress",
      "created_at": "2023-11-15T00:00:00.000000Z",
      "updated_at": "2025-09-08T12:00:00.000000Z"
    },
    {
      "id": 134,
      "learning_content_id": 2,
      "title": "テスト実装",
      "order": 3,
      "status": "not_started",
      "created_at": "2025-09-08T12:00:00.000000Z",
      "updated_at": "2025-09-08T12:00:00.000000Z"
    },
    {
      "id": 135,
      "learning_content_id": 2,
      "title": "デプロイ",
      "order": 4,
      "status": "not_started",
      "created_at": "2025-09-08T12:00:00.000000Z",
      "updated_at": "2025-09-08T12:00:00.000000Z"
    }
  ],
  "deleted_count": 2,
  "message": "セクションを更新しました。"
}

```

## 備考

- セクションの`order`は同一学習内容内で一意である必要があります
- セクションを削除する際、関連する学習記録が存在する場合は削除できません
- ステータスを`completed`に変更すると、自動的に現在のタイムスタンプが記録されます
- セクションの順番を変更する場合、他のセクションの`order`も自動的に調整される場合があります
- 学習内容には最低1つのセクションが必須です（最後のセクションは削除不可）
- セクション削除時、該当学習内容のtotal_sectionsが自動的に1減少します
- セクション追加時、該当学習内容のtotal_sectionsが自動的に1増加します
