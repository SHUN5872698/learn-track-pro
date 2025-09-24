## 相互リンク

[学習記録API](https://www.notion.so/API-2689d86c12e880ca9766e9fe6075d01d?pvs=21) 

.gemini/docs/apis/endpoint-docs/学習記録API.md

---

## RESTful エンドポイント

```bash
GET    /api/learning-sessions                     # 学習記録一覧
POST   /api/learning-sessions                     # 学習記録作成
GET    /api/learning-sessions/{id}                # 学習記録詳細
PUT    /api/learning-sessions/{id}                # 学習記録更新
DELETE /api/learning-sessions/{id}                # 学習記録削除
GET    /api/sections/{id}/learning-sessions       # セクション別学習記録
GET    /api/learning-sessions/statistics          # 学習統計情報

```

---

## 1. 学習記録一覧取得

- **Method**: GET
- **URL**: `/api/learning-sessions`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Query Parameters（オプション）**:

| Parameter | Type | Description |
| --- | --- | --- |
| section_id | integer | セクションIDでフィルタ |
| learning_content_id | integer | 学習内容IDでフィルタ |
| date_from | date | 開始日（YYYY-MM-DD） |
| date_to | date | 終了日（YYYY-MM-DD） |
| limit | integer | 取得件数（デフォルト: 20） |

**Mock Response 200**:

```json
[
    {
        "id": 1,
        "user_id": 1,
        "section_id": 21,
        "started_at": "2024-08-18T09:00:00.000000Z",
        "ended_at": "2024-08-18T11:00:00.000000Z",
        "duration_minutes": 120,
        "notes": "Vue.jsの基本概念について学習。リアクティブシステムの仕組みを理解。",
        "created_at": "2024-08-18T09:00:00.000000Z",
        "updated_at": "2024-08-18T11:00:00.000000Z",
        "section": {
            "id": 21,
            "title": "Vue.jsの基本",
            "learning_content": {
                "id": 2,
                "title": "Vue.js 3 実践ガイド",
                "technology": {
                    "id": 2,
                    "name": "Vue.js"
                }
            }
        }
    },
    {
        "id": 2,
        "user_id": 1,
        "section_id": 22,
        "started_at": "2024-08-19T08:30:00.000000Z",
        "ended_at": "2024-08-19T10:00:00.000000Z",
        "duration_minutes": 90,
        "notes": "Composition APIの基本的な使い方を習得。",
        "created_at": "2024-08-19T08:30:00.000000Z",
        "updated_at": "2024-08-19T10:00:00.000000Z",
        "section": {
            "id": 22,
            "title": "Composition API",
            "learning_content": {
                "id": 2,
                "title": "Vue.js 3 実践ガイド",
                "technology": {
                    "id": 2,
                    "name": "Vue.js"
                }
            }
        }
    }
]

```

---

## 2. 学習記録作成

- **Method**: POST
- **URL**: `/api/learning-sessions`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Request Body (JSON)**:

```json
{
    "section_id": 30,
    "started_at": "2025-09-08T15:00:00",
    "ended_at": "2025-09-08T17:00:00",
    "duration_minutes": 120,
    "notes": "カスタムディレクティブの実装方法を学習"
}

```

**Mock Response 201**:

```json
{
    "id": 4,
    "user_id": 1,
    "section_id": 30,
    "started_at": "2025-09-08T15:00:00.000000Z",
    "ended_at": "2025-09-08T17:00:00.000000Z",
    "duration_minutes": 120,
    "notes": "カスタムディレクティブの実装方法を学習",
    "created_at": "2025-09-08T17:00:00.000000Z",
    "updated_at": "2025-09-08T17:00:00.000000Z",
    "section": {
        "id": 30,
        "title": "カスタムディレクティブ",
        "learning_content": {
            "id": 2,
            "title": "Vue.js 3 実践ガイド"
        }
    },
    "message": "学習記録を作成しました。"
}

```

**Mock Response 422**:

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "section_id": ["セクションIDは必須です。"],
        "started_at": ["開始時刻は必須です。"],
        "ended_at": ["終了時刻は必須です。"],
        "duration_minutes": ["学習時間は必須です。"]
    }
}

```

---

## 3. 学習記録詳細取得

- **Method**: GET
- **URL**: `/api/learning-sessions/{id}`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Mock Response 200**:

```json
{
    "id": 1,
    "user_id": 1,
    "section_id": 21,
    "started_at": "2024-08-18T09:00:00.000000Z",
    "ended_at": "2024-08-18T11:00:00.000000Z",
    "duration_minutes": 120,
    "notes": "Vue.jsの基本概念について学習。リアクティブシステムの仕組みを理解。",
    "created_at": "2024-08-18T09:00:00.000000Z",
    "updated_at": "2024-08-18T11:00:00.000000Z",
    "section": {
        "id": 21,
        "title": "Vue.jsの基本",
        "order": 1,
        "status": "completed",
        "learning_content": {
            "id": 2,
            "title": "Vue.js 3 実践ガイド",
            "technology": {
                "id": 2,
                "name": "Vue.js",
                "icon": "/src/assets/icons/technologies/vue-icon.png"
            }
        }
    }
}

```

**Mock Response 404**:

```json
{
    "message": "学習記録が見つかりません。"
}

```

---

## 4. 学習記録更新

- **Method**: PUT
- **URL**: `/api/learning-sessions/{id}`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Request Body (JSON)**:

```json
{
    "started_at": "2024-08-18T09:00:00",
    "ended_at": "2024-08-18T11:30:00",
    "duration_minutes": 150,
    "notes": "Vue.jsの基本概念について学習。リアクティブシステムの仕組みを理解。v-modelディレクティブの動作原理も把握。"
}

```

**Mock Response 200**:

```json
{
    "id": 1,
    "user_id": 1,
    "section_id": 21,
    "started_at": "2024-08-18T09:00:00.000000Z",
    "ended_at": "2024-08-18T11:30:00.000000Z",
    "duration_minutes": 150,
    "notes": "Vue.jsの基本概念について学習。リアクティブシステムの仕組みを理解。v-modelディレクティブの動作原理も把握。",
    "created_at": "2024-08-18T09:00:00.000000Z",
    "updated_at": "2025-09-08T15:30:00.000000Z",
    "message": "学習記録を更新しました。"
}

```

**Mock Response 422**:

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "started_at": ["開始時刻は必須です。"],
        "ended_at": ["終了時刻は開始時刻より後である必要があります。"]
    }
}

```

---

## 5. 学習記録削除

- **Method**: DELETE
- **URL**: `/api/learning-sessions/{id}`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Mock Response 200**:

```json
{
    "message": "学習記録を削除しました。"
}

```

**Mock Response 404**:

```json
{
    "message": "学習記録が見つかりません。"
}

```

---

## 6. セクション別学習記録

- **Method**: GET
- **URL**: `/api/sections/{id}/learning-sessions`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Mock Response 200**:

```json
[
    {
        "id": 1,
        "user_id": 1,
        "section_id": 21,
        "started_at": "2024-08-18T09:00:00.000000Z",
        "ended_at": "2024-08-18T11:00:00.000000Z",
        "duration_minutes": 120,
        "notes": "Vue.jsの基本概念について学習。リアクティブシステムの仕組みを理解。",
        "created_at": "2024-08-18T09:00:00.000000Z",
        "updated_at": "2024-08-18T11:00:00.000000Z"
    },
    {
        "id": 5,
        "user_id": 1,
        "section_id": 21,
        "started_at": "2024-08-18T13:00:00.000000Z",
        "ended_at": "2024-08-18T14:30:00.000000Z",
        "duration_minutes": 90,
        "notes": "復習：コンポーネントの基本構造とprops/emitの使い方",
        "created_at": "2024-08-18T13:00:00.000000Z",
        "updated_at": "2024-08-18T14:30:00.000000Z"
    }
]

```

---

## 7. 学習統計情報

- **Method**: GET
- **URL**: `/api/learning-sessions/statistics`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Query Parameters（オプション）**:

| Parameter | Type | Description |
| --- | --- | --- |
| period | string | today, week, month, year, all（デフォルト: month） |

**Mock Response 200**:

```json
{
    "total_study_time_minutes": 1250,
    "total_sessions": 42,
    "completed_sections": 29,
    "active_days": 15,
    "average_session_minutes": 30,
    "daily_statistics": [
        {
            "date": "2025-09-01",
            "study_minutes": 120,
            "sessions_count": 3
        },
        {
            "date": "2025-09-02",
            "study_minutes": 90,
            "sessions_count": 2
        },
        {
            "date": "2025-09-03",
            "study_minutes": 0,
            "sessions_count": 0
        },
        {
            "date": "2025-09-04",
            "study_minutes": 150,
            "sessions_count": 4
        },
        {
            "date": "2025-09-05",
            "study_minutes": 60,
            "sessions_count": 1
        },
        {
            "date": "2025-09-06",
            "study_minutes": 180,
            "sessions_count": 3
        },
        {
            "date": "2025-09-07",
            "study_minutes": 0,
            "sessions_count": 0
        },
        {
            "date": "2025-09-08",
            "study_minutes": 120,
            "sessions_count": 2
        }
    ],
    "technology_breakdown": [
        {
            "technology_id": 2,
            "technology_name": "Vue.js",
            "study_minutes": 450,
            "sessions_count": 15
        },
        {
            "technology_id": 1,
            "technology_name": "Laravel",
            "study_minutes": 380,
            "sessions_count": 12
        },
        {
            "technology_id": 3,
            "technology_name": "React",
            "study_minutes": 240,
            "sessions_count": 8
        },
        {
            "technology_id": 18,
            "technology_name": "Docker",
            "study_minutes": 180,
            "sessions_count": 7
        }
    ]
}

```

---

## 備考

- 学習記録は必ずセクションに紐づきます
- 学習時間（duration_minutes）は開始時刻と終了時刻から自動計算されます
- 学習記録の削除時、関連するセクションと学習内容の統計情報が自動的に更新されます
