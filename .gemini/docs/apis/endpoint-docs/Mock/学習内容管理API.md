## 相互リンク

[Mock](https://www.notion.so/Mock-2799d86c12e88000bdc2fd60cc1a62f7?pvs=21) 

.gemini/docs/apis/endpoint-docs/Mock/学習内容管理API.md

---

## RESTful エンドポイント

```bash
GET    /api/learning-contents                 # 学習内容一覧
POST   /api/learning-contents                 # 学習内容作成
GET    /api/learning-contents/{id}            # 学習内容詳細
PUT    /api/learning-contents/{id}            # 学習内容編集
DELETE /api/learning-contents/{id}            # 学習内容削除
PUT    /api/learning-contents/{id}/complete   # 完了にする
PUT    /api/learning-contents/{id}/reopen     # 学習を再開

```

---

## 1. 学習内容一覧取得

- **Method**: GET
- **URL**: `/api/learning-contents`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Query Parameters（オプション）**:

| Parameter | Type | Description |
| --- | --- | --- |
| status | string | ステータスでフィルタリング |
| technology_id | integer | 技術分野でのフィルタ |
| sort | string | updated_at, created_at, title (デフォルト: updated_at) |
| order | string | asc, desc (デフォルト: desc) |
| page | integer | ページ番号 |
| per_page | integer | 1ページあたりの件数 |

**Mock Response 200**:

```json
[
    {
        "id": 1,
        "user_id": 1,
        "technology_id": 1,
        "title": "Laravel完全マスター",
        "description": "Laravelの基礎から応用まで、実践的なWebアプリケーション開発を学習",
        "total_sections": 20,
        "completed_sections": 20,
        "status": "completed",
        "completed_at": "2024-08-25T00:00:00.000000Z",
        "created_at": "2023-12-01T00:00:00.000000Z",
        "updated_at": "2024-08-25T00:00:00.000000Z",
        "technology": {
            "id": 1,
            "name": "Laravel",
            "icon": "/src/assets/icons/technologies/laravel-icon.png",
            "category": {
                "id": 1,
                "name": "Programming"
            }
        }
    },
    {
        "id": 2,
        "user_id": 1,
        "technology_id": 2,
        "title": "Vue.js 3 実践ガイド",
        "description": "Vue.js 3のComposition APIとTypeScriptを使ったモダンなフロントエンド開発",
        "total_sections": 15,
        "completed_sections": 9,
        "status": "in_progress",
        "completed_at": null,
        "created_at": "2023-11-15T00:00:00.000000Z",
        "updated_at": "2024-01-14T18:00:00.000000Z",
        "technology": {
            "id": 2,
            "name": "Vue.js",
            "icon": "/src/assets/icons/technologies/vue-icon.png",
            "category": {
                "id": 1,
                "name": "Programming"
            }
        }
    },
    {
        "id": 3,
        "user_id": 1,
        "technology_id": 3,
        "title": "React基礎からNext.jsまで",
        "description": "Reactの基礎概念からNext.jsを使った本格的なWebアプリケーション開発まで",
        "total_sections": 10,
        "completed_sections": 6,
        "status": "in_progress",
        "completed_at": null,
        "created_at": "2024-01-05T00:00:00.000000Z",
        "updated_at": "2024-01-10T09:00:00.000000Z",
        "technology": {
            "id": 3,
            "name": "React",
            "icon": "/src/assets/icons/technologies/react-icon.png",
            "category": {
                "id": 1,
                "name": "Programming"
            }
        }
    },
    {
        "id": 4,
        "user_id": 1,
        "technology_id": 18,
        "title": "Dockerの基礎学習",
        "description": "コンテナ化の基礎とDockerの再確認",
        "total_sections": 10,
        "completed_sections": 9,
        "status": "in_progress",
        "completed_at": null,
        "created_at": "2024-01-10T00:00:00.000000Z",
        "updated_at": "2024-01-10T09:00:00.000000Z",
        "technology": {
            "id": 18,
            "name": "Docker",
            "icon": "/src/assets/icons/technologies/docker-icon.png",
            "category": {
                "id": 2,
                "name": "Infrastructure"
            }
        }
    },
    {
        "id": 5,
        "user_id": 1,
        "technology_id": 4,
        "title": "PHP8.5の内容確認",
        "description": "PHP8.5で実装されるRFCの確認",
        "total_sections": 10,
        "completed_sections": 10,
        "status": "in_progress",
        "completed_at": null,
        "created_at": "2024-01-10T00:00:00.000000Z",
        "updated_at": "2024-01-10T09:00:00.000000Z",
        "technology": {
            "id": 4,
            "name": "PHP",
            "icon": "/src/assets/icons/technologies/php-icon.png",
            "category": {
                "id": 1,
                "name": "Programming"
            }
        }
    }
]

```

---

## 2. 学習内容作成

- **Method**: POST
- **URL**: `/api/learning-contents`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Request Body (JSON)**:

```json
{
    "technology_id": 1,
    "title": "Laravel REST API開発",
    "description": "RESTful APIの設計から実装まで、実践的なスキルを習得",
    "sections": [
        {
            "title": "環境構築",
            "order": 1
        },
        {
            "title": "ルーティング設定",
            "order": 2
        },
        {
            "title": "認証機能実装",
            "order": 3
        }
    ]
}

```

**Mock Response 201**:

```json
{
    "id": 6,
    "user_id": 1,
    "technology_id": 1,
    "title": "Laravel REST API開発",
    "description": "RESTful APIの設計から実装まで、実践的なスキルを習得",
    "total_sections": 3,
    "completed_sections": 0,
    "status": "not_started",
    "completed_at": null,
    "created_at": "2025-09-08T10:00:00.000000Z",
    "updated_at": "2025-09-08T10:00:00.000000Z",
    "technology": {
        "id": 1,
        "name": "Laravel",
        "icon": "/src/assets/icons/technologies/laravel-icon.png",
        "category": {
            "id": 1,
            "name": "Programming"
        }
    },
    "sections": [
        {
            "id": 131,
            "learning_content_id": 6,
            "title": "環境構築",
            "order": 1,
            "status": "not_started",
            "created_at": "2025-09-08T10:00:00.000000Z",
            "updated_at": "2025-09-08T10:00:00.000000Z"
        },
        {
            "id": 132,
            "learning_content_id": 6,
            "title": "ルーティング設定",
            "order": 2,
            "status": "not_started",
            "created_at": "2025-09-08T10:00:00.000000Z",
            "updated_at": "2025-09-08T10:00:00.000000Z"
        },
        {
            "id": 133,
            "learning_content_id": 6,
            "title": "認証機能実装",
            "order": 3,
            "status": "not_started",
            "created_at": "2025-09-08T10:00:00.000000Z",
            "updated_at": "2025-09-08T10:00:00.000000Z"
        }
    ],
    "message": "学習内容を作成しました。"
}

```

---

## 3. 学習内容詳細取得

- **Method**: GET
- **URL**: `/api/learning-contents/{id}`

**Mock Response 200（例: id=2の場合）**:

```json
{
    "id": 2,
    "user_id": 1,
    "technology_id": 2,
    "title": "Vue.js 3 実践ガイド",
    "description": "Vue.js 3のComposition APIとTypeScriptを使ったモダンなフロントエンド開発",
    "total_sections": 15,
    "completed_sections": 9,
    "status": "in_progress",
    "completed_at": null,
    "created_at": "2023-11-15T00:00:00.000000Z",
    "updated_at": "2024-01-14T18:00:00.000000Z",
    "technology": {
        "id": 2,
        "name": "Vue.js",
        "icon": "/src/assets/icons/technologies/vue-icon.png",
        "category": {
            "id": 1,
            "name": "Programming"
        }
    },
    "sections": [
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
}

```

---

## 4. 学習内容編集

- **Method**: PUT
- **URL**: `/api/learning-contents/{id}`

**Request Body (JSON)**:

```json
{
    "technology_id": 2,
    "title": "Vue.js 3 実践ガイド（改訂版）",
    "description": "Vue.js 3のComposition APIとTypeScriptを使ったモダンなフロントエンド開発（2025年版）"
}

```

**Mock Response 200**:

```json
{
    "id": 2,
    "user_id": 1,
    "technology_id": 2,
    "title": "Vue.js 3 実践ガイド（改訂版）",
    "description": "Vue.js 3のComposition APIとTypeScriptを使ったモダンなフロントエンド開発（2025年版）",
    "total_sections": 15,
    "completed_sections": 9,
    "status": "in_progress",
    "completed_at": null,
    "created_at": "2023-11-15T00:00:00.000000Z",
    "updated_at": "2025-09-08T11:00:00.000000Z",
    "technology": {
        "id": 2,
        "name": "Vue.js",
        "icon": "/src/assets/icons/technologies/vue-icon.png",
        "category": {
            "id": 1,
            "name": "Programming"
        }
    },
    "message": "学習内容を更新しました。"
}

```

---

## 5. 学習内容削除

- **Method**: DELETE
- **URL**: `/api/learning-contents/{id}`

**Mock Response 200**:

```json
{
    "message": "学習内容を削除しました。"
}

```

---

## 6. 学習内容完了

- **Method**: PUT
- **URL**: `/api/learning-contents/{id}/complete`

**Mock Response 200（例: id=5の場合）**:

```json
{
    "id": 5,
    "user_id": 1,
    "technology_id": 4,
    "title": "PHP8.5の内容確認",
    "description": "PHP8.5で実装されるRFCの確認",
    "total_sections": 10,
    "completed_sections": 10,
    "status": "completed",
    "completed_at": "2025-09-08T11:30:00.000000Z",
    "created_at": "2024-01-10T00:00:00.000000Z",
    "updated_at": "2025-09-08T11:30:00.000000Z",
    "technology": {
        "id": 4,
        "name": "PHP",
        "icon": "/src/assets/icons/technologies/php-icon.png",
        "category": {
            "id": 1,
            "name": "Programming"
        }
    },
    "message": "学習内容を完了しました。"
}
```

**エラーレスポンスなし**（UIで制御されているため）

---

## 7. 学習内容再開

- **Method**: PUT
- **URL**: `/api/learning-contents/{id}/reopen`

**Mock Response 200（例: id=1の場合）**:

```json
{
    "id": 1,
    "user_id": 1,
    "technology_id": 1,
    "title": "Laravel完全マスター",
    "description": "Laravelの基礎から応用まで、実践的なWebアプリケーション開発を学習",
    "total_sections": 20,
    "completed_sections": 20,
    "status": "in_progress",
    "completed_at": null,
    "created_at": "2023-12-01T00:00:00.000000Z",
    "updated_at": "2025-09-08T11:45:00.000000Z",
    "technology": {
        "id": 1,
        "name": "Laravel",
        "icon": "/src/assets/icons/technologies/laravel-icon.png",
        "category": {
            "id": 1,
            "name": "Programming"
        }
    },
    "message": "学習を再開しました。"
}
```

**Mock Response 422**:

```json
{
    "message": "完了していない学習内容は再開できません。"
}

```

---
