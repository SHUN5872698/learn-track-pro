## 相互リンク

[開発環境](https://www.notion.so/2799d86c12e88026afd5e70d2b8dfd8b?pvs=21) 

.gemini/docs/apis/endpoint-docs/学習内容管理API.md

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

**Mock Response 200**:**（全件取得の例・一部抜粋）**:

```json
{
    "data": [
        {
            "id": 1,
            "user_id": 1,
            "technology_id": 1,
            "title": "Laravel完全マスター",
            "description": "Laravelの基礎から応用まで、実践的なWebアプリケーション開発を学習",
            "total_sections": 20,
            "completed_sections": 20,
            "status": "completed",
            "completed_at": "2024-08-24T15:00:00.000000Z",
            "created_at": "2025-09-13T03:30:46.000000Z",
            "updated_at": "2025-09-13T03:30:46.000000Z",
            "technology": {
                "id": 1,
                "name": "Laravel",
                "icon": "http://localhost:8000/assets/icons/technologies/laravel-icon.png",
                "category": {
                    "id": 1,
                    "name": "Programming"
                }
            },
            "sections": [
                {
                    "id": 1,
                    "learning_content_id": 1,
                    "title": "イントロダクション",
                    "order": 1,
                    "status": "completed",
                    "created_at": "2025-09-13T03:53:19.000000Z",
                    "updated_at": "2025-09-13T03:53:19.000000Z"
                },
                {
                    "id": 2,
                    "learning_content_id": 1,
                    "title": "環境構築",
                    "order": 2,
                    "status": "completed",
                    "created_at": "2025-09-13T03:53:19.000000Z",
                    "updated_at": "2025-09-13T03:53:19.000000Z"
                },
                {
                    "id": 3,
                    "learning_content_id": 1,
                    "title": "ルーティング",
                    "order": 3,
                    "status": "completed",
                    "created_at": "2025-09-13T03:53:19.000000Z",
                    "updated_at": "2025-09-13T03:53:19.000000Z"
                },
                {
                    "id": 4,
                    "learning_content_id": 1,
                    "title": "コントローラー",
                    "order": 4,
                    "status": "completed",
                    "created_at": "2025-09-13T03:53:19.000000Z",
                    "updated_at": "2025-09-13T03:53:19.000000Z"
                },
                {
                    "id": 5,
                    "learning_content_id": 1,
                    "title": "ビュー",
                    "order": 5,
                    "status": "completed",
                    "created_at": "2025-09-13T03:53:19.000000Z",
                    "updated_at": "2025-09-13T03:53:19.000000Z"
                },
                {
                    "id": 6,
                    "learning_content_id": 1,
                    "title": "データベース設計",
                    "order": 6,
                    "status": "completed",
                    "created_at": "2025-09-13T03:53:19.000000Z",
                    "updated_at": "2025-09-13T03:53:19.000000Z"
                },
                {
                    "id": 7,
                    "learning_content_id": 1,
                    "title": "Eloquent ORM",
                    "order": 7,
                    "status": "completed",
                    "created_at": "2025-09-13T03:53:19.000000Z",
                    "updated_at": "2025-09-13T03:53:19.000000Z"
                },
                {
                    "id": 8,
                    "learning_content_id": 1,
                    "title": "フォーム処理",
                    "order": 8,
                    "status": "completed",
                    "created_at": "2025-09-13T03:53:19.000000Z",
                    "updated_at": "2025-09-13T03:53:19.000000Z"
                },
                {
                    "id": 9,
                    "learning_content_id": 1,
                    "title": "認証システム",
                    "order": 9,
                    "status": "completed",
                    "created_at": "2025-09-13T03:53:19.000000Z",
                    "updated_at": "2025-09-13T03:53:19.000000Z"
                },
                {
                    "id": 10,
                    "learning_content_id": 1,
                    "title": "ミドルウェア",
                    "order": 10,
                    "status": "completed",
                    "created_at": "2025-09-13T03:53:19.000000Z",
                    "updated_at": "2025-09-13T03:53:19.000000Z"
                },
                {
                    "id": 11,
                    "learning_content_id": 1,
                    "title": "API開発",
                    "order": 11,
                    "status": "completed",
                    "created_at": "2025-09-13T03:53:19.000000Z",
                    "updated_at": "2025-09-13T03:53:19.000000Z"
                },
                {
                    "id": 12,
                    "learning_content_id": 1,
                    "title": "テスト",
                    "order": 12,
                    "status": "completed",
                    "created_at": "2025-09-13T03:53:19.000000Z",
                    "updated_at": "2025-09-13T03:53:19.000000Z"
                },
                {
                    "id": 13,
                    "learning_content_id": 1,
                    "title": "キューとジョブ",
                    "order": 13,
                    "status": "completed",
                    "created_at": "2025-09-13T03:53:19.000000Z",
                    "updated_at": "2025-09-13T03:53:19.000000Z"
                },
                {
                    "id": 14,
                    "learning_content_id": 1,
                    "title": "イベントとリスナー",
                    "order": 14,
                    "status": "completed",
                    "created_at": "2025-09-13T03:53:19.000000Z",
                    "updated_at": "2025-09-13T03:53:19.000000Z"
                },
                {
                    "id": 15,
                    "learning_content_id": 1,
                    "title": "通知システム",
                    "order": 15,
                    "status": "completed",
                    "created_at": "2025-09-13T03:53:19.000000Z",
                    "updated_at": "2025-09-13T03:53:19.000000Z"
                },
                {
                    "id": 16,
                    "learning_content_id": 1,
                    "title": "ファイルストレージ",
                    "order": 16,
                    "status": "completed",
                    "created_at": "2025-09-13T03:53:19.000000Z",
                    "updated_at": "2025-09-13T03:53:19.000000Z"
                },
                {
                    "id": 17,
                    "learning_content_id": 1,
                    "title": "キャッシュ",
                    "order": 17,
                    "status": "completed",
                    "created_at": "2025-09-13T03:53:19.000000Z",
                    "updated_at": "2025-09-13T03:53:19.000000Z"
                },
                {
                    "id": 18,
                    "learning_content_id": 1,
                    "title": "パフォーマンス最適化",
                    "order": 18,
                    "status": "completed",
                    "created_at": "2025-09-13T03:53:19.000000Z",
                    "updated_at": "2025-09-13T03:53:19.000000Z"
                },
                {
                    "id": 19,
                    "learning_content_id": 1,
                    "title": "セキュリティ",
                    "order": 19,
                    "status": "completed",
                    "created_at": "2025-09-13T03:53:19.000000Z",
                    "updated_at": "2025-09-13T03:53:19.000000Z"
                },
                {
                    "id": 20,
                    "learning_content_id": 1,
                    "title": "デプロイ",
                    "order": 20,
                    "status": "completed",
                    "created_at": "2025-09-13T03:53:19.000000Z",
                    "updated_at": "2025-09-13T03:53:19.000000Z"
                }
            ]
        }
    ],
    "links": {
        "first": "http://localhost:8000/api/learning-contents?page=1",
        "last": "http://localhost:8000/api/learning-contents?page=1",
        "prev": null,
        "next": null
    },
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 1,
        "links": [
            {
                "url": null,
                "label": "&laquo; 前へ",
                "active": false
            },
            {
                "url": "http://localhost:8000/api/learning-contents?page=1",
                "label": "1",
                "active": true
            },
            {
                "url": null,
                "label": "次へ &raquo;",
                "active": false
            }
        ],
        "path": "http://localhost:8000/api/learning-contents",
        "per_page": 15,
        "to": 6,
        "total": 6
    }
}
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
    "description": "RESTful APIの設計から実装まで",
    "sections": [
        {
            "title": "環境構築"
        },
        {
            "title": "ルーティング設定"
        },
        {
            "title": "認証機能実装"
        }
    ],
    "startImmediately": false
}
```

**Mock Response 201**:

```json
{
    "data": {
        "id": 1008,
        "user_id": 1,
        "technology_id": 1,
        "title": "Laravel REST API開発",
        "description": "RESTful APIの設計から実装まで",
        "total_sections": 3,
        "completed_sections": 0,
        "status": "not_started",
        "completed_at": null,
        "created_at": "2025-09-25 13:40:50",
        "updated_at": "2025-09-25 13:40:50",
        "technology": {
            "id": 1,
            "name": "Laravel",
            "icon": "http://localhost:8000/assets/icons/technologies/laravel-icon.png",
            "category": {
                "id": 1,
                "name": "Programming"
            }
        },
        "sections": [
            {
                "id": 113,
                "learning_content_id": 1008,
                "title": "環境構築",
                "order": 1,
                "status": "not_started",
                "created_at": "2025-09-25 13:40:50",
                "updated_at": "2025-09-25 13:40:50"
            },
            {
                "id": 114,
                "learning_content_id": 1008,
                "title": "ルーティング設定",
                "order": 2,
                "status": "not_started",
                "created_at": "2025-09-25 13:40:50",
                "updated_at": "2025-09-25 13:40:50"
            },
            {
                "id": 115,
                "learning_content_id": 1008,
                "title": "認証機能実装",
                "order": 3,
                "status": "not_started",
                "created_at": "2025-09-25 13:40:50",
                "updated_at": "2025-09-25 13:40:50"
            }
        ]
    },
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
    "data": {
        "id": 2,
        "user_id": 1,
        "technology_id": 2,
        "title": "Vue.js 3 実践ガイド",
        "description": "Vue.js 3のComposition APIとTypeScriptを使ったモダンなフロントエンド開発",
        "total_sections": 15,
        "completed_sections": 9,
        "status": "in_progress",
        "completed_at": null,
        "created_at": "2025-09-13 12:30:46",
        "updated_at": "2025-09-13 12:30:46",
        "technology": {
            "id": 2,
            "name": "Vue.js",
            "icon": "http://localhost:8000/assets/icons/technologies/vue-icon.png",
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
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 22,
                "learning_content_id": 2,
                "title": "Composition API",
                "order": 2,
                "status": "completed",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 23,
                "learning_content_id": 2,
                "title": "Vue Router",
                "order": 3,
                "status": "completed",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 24,
                "learning_content_id": 2,
                "title": "Vuex/Pinia",
                "order": 4,
                "status": "completed",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 25,
                "learning_content_id": 2,
                "title": "コンポーネント設計",
                "order": 5,
                "status": "completed",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 26,
                "learning_content_id": 2,
                "title": "TypeScript統合",
                "order": 6,
                "status": "completed",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 27,
                "learning_content_id": 2,
                "title": "テスト戦略",
                "order": 7,
                "status": "completed",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 28,
                "learning_content_id": 2,
                "title": "パフォーマンス最適化",
                "order": 8,
                "status": "completed",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 29,
                "learning_content_id": 2,
                "title": "SSRとNuxt.js",
                "order": 9,
                "status": "completed",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 30,
                "learning_content_id": 2,
                "title": "カスタムディレクティブ",
                "order": 10,
                "status": "not_started",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 31,
                "learning_content_id": 2,
                "title": "プラグイン開発",
                "order": 11,
                "status": "not_started",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 32,
                "learning_content_id": 2,
                "title": "アニメーション",
                "order": 12,
                "status": "not_started",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 33,
                "learning_content_id": 2,
                "title": "国際化（i18n）",
                "order": 13,
                "status": "not_started",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 34,
                "learning_content_id": 2,
                "title": "PWA対応",
                "order": 14,
                "status": "not_started",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 35,
                "learning_content_id": 2,
                "title": "デプロイ戦略",
                "order": 15,
                "status": "not_started",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            }
        ]
    }
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
    "description": "Vue.js 3のComposition APIとTypeScriptを使ったモダンなフロントエンド開発（2025年版）",
    "status": "in_progress"
}
```

**Mock Response 200**:

```json
{
    "data": {
        "id": 1001,
        "user_id": 1,
        "technology_id": 2,
        "title": "Vue.js 3 実践ガイド（改訂版）",
        "description": "Vue.js 3のComposition APIとTypeScriptを使ったモダンなフロントエンド開発（2025年版）",
        "total_sections": 3,
        "completed_sections": 0,
        "status": "in_progress",
        "completed_at": null,
        "created_at": "2025-09-25 13:13:42",
        "updated_at": "2025-09-25 14:21:02",
        "technology": {
            "id": 2,
            "name": "Vue.js",
            "icon": "http://localhost:8000/assets/icons/technologies/vue-icon.png",
            "category": {
                "id": 1,
                "name": "Programming"
            }
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
    "data": {
        "id": 5,
        "user_id": 1,
        "technology_id": 4,
        "title": "PHP8.5の内容確認",
        "description": "PHP8.5で実装されるRFCの確認",
        "total_sections": 10,
        "completed_sections": 10,
        "status": "completed",
        "completed_at": "2025-09-25 14:45:34",
        "created_at": "2025-09-13 12:30:46",
        "updated_at": "2025-09-25 14:45:34",
        "technology": {
            "id": 4,
            "name": "PHP",
            "icon": "http://localhost:8000/assets/icons/technologies/php-icon.png",
            "category": {
                "id": 1,
                "name": "Programming"
            }
        }
    },
    "message": "学習内容を完了しました。"
}
```

---

## 7. 学習内容再開

- **Method**: PUT
- **URL**: `/api/learning-contents/{id}/reopen`

**Mock Response 200（例: id=1の場合）**:

```json
{
    "data": {
        "id": 1,
        "user_id": 1,
        "technology_id": 1,
        "title": "Laravel完全マスター",
        "description": "Laravelの基礎から応用まで、実践的なWebアプリケーション開発を学習",
        "total_sections": 20,
        "completed_sections": 20,
        "status": "in_progress",
        "completed_at": null,
        "created_at": "2025-09-13 12:30:46",
        "updated_at": "2025-09-25 14:52:25",
        "technology": {
            "id": 1,
            "name": "Laravel",
            "icon": "http://localhost:8000/assets/icons/technologies/laravel-icon.png",
            "category": {
                "id": 1,
                "name": "Programming"
            }
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
