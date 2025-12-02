## RESTful エンドポイント

```bash
GET    /api/learning-sessions                                       # 学習記録一覧
POST   /api/learning-sessions                                       # 学習記録作成
GET    /api/learning-sessions/{learningSessionId}                                  # 学習記録詳細
PUT    /api/learning-sessions/{learningSessionId}                                  # 学習記録更新
DELETE /api/learning-sessions/{learningSessionId}                                  # 学習記録削除
GET    /api/sections/{sectionId}/sessions                           # セクション別学習記録
GET    /api/learning-contents/{learningContentId}/sessions          # 学習内容別学習記録
```

---

## カスタムスクリプト

### Post-processor: 環境変数更新

**学習記録作成（POST /api/learning-sessions）**

```jsx
const response = pm.response.json();

if (pm.response.code === 201 && response.data && response.data.id) {
    pm.environment.set('learning_session_id', response.data.id);
    console.log("✅ learning_session_id 設定:", response.data.id);
}
```

**学習記録削除（DELETE /api/learning-sessions/{learning_session_id}）**

```jsx
// 学習記録削除成功時に環境変数を初期化
if (pm.response.code === 200 || pm.response.code === 204) {
    pm.environment.unset('learning_session_id');
    console.log("🗑️ learning_session_id 初期化");
}
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

**Query Parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| section_id | integer | セクションIDでフィルタ |
| learning_content_id | integer | 学習内容IDでフィルタ |
- **Mock Response 200**:（例: learning_content_id=1,section_id=1の場合）
    
    ```json
    {
        "data": [
            {
                "id": 2,
                "user_id": 1,
                "learning_content_id": 1,
                "section_id": 1,
                "study_minutes": 90,
                "memo": "学習計画の立て方を確認",
                "mood_rating": 3,
                "session_type": "manual",
                "studied_at": "2025-06-02 14:15:00",
                "created_at": "2025-09-13 13:15:43",
                "updated_at": "2025-09-13 13:15:43",
                "learning_content": {
                    "id": 1,
                    "user_id": 1,
                    "technology_id": 1,
                    "title": "Laravel完全マスター",
                    "description": "Laravelの基礎から応用まで、実践的なWebアプリケーション開発を学習",
                    "total_sections": 20,
                    "completed_sections": 20,
                    "status": "completed",
                    "completed_at": "2024-08-25 00:00:00",
                    "created_at": "2025-09-13 12:30:46",
                    "updated_at": "2025-09-13 12:30:46"
                },
                "section": {
                    "id": 1,
                    "learning_content_id": 1,
                    "title": "イントロダクション",
                    "order": 1,
                    "status": "completed",
                    "created_at": "2025-09-13 12:53:19",
                    "updated_at": "2025-09-13 12:53:19"
                }
            },
            {
                "id": 1,
                "user_id": 1,
                "learning_content_id": 1,
                "section_id": 1,
                "study_minutes": 120,
                "memo": "Laravelの概要とフレームワークの特徴を理解",
                "mood_rating": 4,
                "session_type": "manual",
                "studied_at": "2025-06-01 09:30:00",
                "created_at": "2025-09-13 13:15:43",
                "updated_at": "2025-09-13 13:15:43",
                "learning_content": {
                    "id": 1,
                    "user_id": 1,
                    "technology_id": 1,
                    "title": "Laravel完全マスター",
                    "description": "Laravelの基礎から応用まで、実践的なWebアプリケーション開発を学習",
                    "total_sections": 20,
                    "completed_sections": 20,
                    "status": "completed",
                    "completed_at": "2024-08-25 00:00:00",
                    "created_at": "2025-09-13 12:30:46",
                    "updated_at": "2025-09-13 12:30:46"
                },
                "section": {
                    "id": 1,
                    "learning_content_id": 1,
                    "title": "イントロダクション",
                    "order": 1,
                    "status": "completed",
                    "created_at": "2025-09-13 12:53:19",
                    "updated_at": "2025-09-13 12:53:19"
                }
            }
        ]
    }
    ```
    
- **Mock Response 401**:権限なし
    
    ```json
    {
        "message": "Unauthenticated."
    }
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
- **Request Body:**
    
    ```json
    {
        "learning_content_id": 2,
        "section_id": 30,
        "study_minutes": 120,
        "memo": "Apidocで作成",
        "mood_rating": 4,
        "session_type": "manual",
        "studied_at": "2025-09-26 10:30"
    }
    ```
    
- **Response 201:**
    
    ```json
    {
        "data": {
            "id": 139,
            "user_id": 1,
            "learning_content_id": 2,
            "section_id": 30,
            "study_minutes": 120,
            "memo": "Apidocで作成",
            "mood_rating": 4,
            "session_type": "manual",
            "studied_at": "2025-09-26 10:30:00",
            "created_at": "2025-09-26 22:35:56",
            "updated_at": "2025-09-26 22:35:56"
        },
        "message": "学習記録を作成しました。"
    }
    ```
    

**Mock Response 401**:権限なし

**Mock Response 403**:アクセス禁止

- **Response 422:**パラメータエラー
    
    ```json
    {
        "message": "学習コンテンツは必須項目です。 (その他、4エラーあり)",
        "errors": {
            "learning_content_id": [
                "学習コンテンツは必須項目です。"
            ],
            "section_id": [
                "セクションは必須項目です。"
            ],
            "study_minutes": [
                "学習時間は必須項目です。"
            ],
            "session_type": [
                "記録方法は必須項目です。"
            ],
            "studied_at": [
                "学習日は必須項目です。"
            ]
        }
    }
    ```
    
    ```json
    {
        "message": "学習時間は24時間未満で入力してください。 (その他、1エラーあり)",
        "errors": {
            "study_minutes": [
                "学習時間は24時間未満で入力してください。"
            ],
            "mood_rating": [
                "調子は、5以下の数値である必要があります。"
            ]
        }
    }
    ```
    

---

## 3. 学習記録詳細取得

- **Method**: GET
- **URL**: `/api/learning-sessions/{learningSessionId}`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |
- **Response 200:**（例: id=139の場合）
    
    ```json
    {
        "data": {
            "id": 139,
            "user_id": 1,
            "learning_content_id": 2,
            "section_id": 30,
            "study_minutes": 120,
            "memo": "Apidocで作成",
            "mood_rating": 4,
            "session_type": "manual",
            "studied_at": "2025-09-26 00:00:00",
            "created_at": "2025-09-26 22:08:05",
            "updated_at": "2025-09-26 22:08:05",
            "learning_content": {
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
                    "icon": "http://localhost:8000/assets/icons/technologies/vue-icon.png"
                }
            },
            "section": {
                "id": 30,
                "learning_content_id": 2,
                "title": "カスタムディレクティブ",
                "order": 10,
                "status": "not_started",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            }
        }
    }
    ```
    

**Response 301:**パラメータ未定義

**Mock Response 401**:権限なし

**Response 403:**アクセス禁止

- **Response 404:**レコードが存在しない
    
    ```json
    **// 一部**
    {
        "message": "No query results for model [App\\Models\\LearningSession] 9999",
        "exception": "Symfony\\Component\\HttpKernel\\Exception\\NotFoundHttpException",
        "file": "/var/www/html/vendor/laravel/framework/src/Illuminate/Foundation/Exceptions/Handler.php",
        "line": 669,
        "trace": [
            {
                "file": "/var/www/html/vendor/laravel/framework/src/Illuminate/Foundation/Exceptions/Handler.php",
                "line": 617,
                "function": "prepareException",
                "class": "Illuminate\\Foundation\\Exceptions\\Handler",
                "type": "->"
            }
        ]
    }
    ```
    

---

## 4. 学習記録更新

- **Method**: PUT
- **URL**: `/api/learning-sessions/{learningSessionId}`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |
- **Request Body:**
    
    ```json
    {
        "study_minutes": 150,
        "memo": "Apidocで更新",
        "mood_rating": 5,
        "studied_at": "2025-09-26 14:00"
    }
    ```
    
- **Response 200:**
    
    ```json
    {
        "id": 1,
        "user_id": 1,
        "learning_content_id": 2,
        "section_id": 21,
        "study_minutes": 150,
        "memo": "Vue.jsの基本概念について学習。リアクティブシステムの仕組みを理解。v-modelディレクティブの動作原理も把握。",
        "mood_rating": 5,
        "session_type": "manual",
        "studied_at": "2024-08-18 09:00:00",
        "created_at": "2024-08-18 09:00:00",
        "updated_at": "2025-09-26 15:30:00",
        "message": "学習記録を更新しました。"
    }
    
    ```
    

**Response 301:**パラメータ未定義

**Mock Response 401**:権限なし

**Mock Response 403**:アクセス禁止

- **Response 422:**パラメータエラー
    
    ```json
    {
        "message": "学習時間には、整数を指定してください。 (その他、2エラーあり)",
        "errors": {
            "study_minutes": [
                "学習時間には、整数を指定してください。",
                "学習時間は1分以上で入力してください。"
            ],
            "studied_at": [
                "学習日は、正しい日付ではありません。"
            ]
        }
    }
    ```
    
    ```json
    {
        "message": "学習時間は24時間未満で入力してください。 (その他、1エラーあり)",
        "errors": {
            "study_minutes": [
                "学習時間は24時間未満で入力してください。"
            ],
            "mood_rating": [
                "調子は、5以下の数値である必要があります。"
            ]
        }
    }
    ```
    

---

## 5. 学習記録削除

- **Method**: DELETE
- **URL**: `/api/learning-sessions/{learningSessionId}`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |
- **Mock Response 200**:
    
    ```json
    {
        "message": "学習記録を削除しました。"
    }
    
    ```
    
- **Response 301:**パラメータ未定義
    
    ```json
    <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
    <html><head>
    <title>301 Moved Permanently</title>
    </head><body>
    <h1>Moved Permanently</h1>
    <p>The document has moved <a href="http://localhost:8000/api/learning-sessions">here</a>.</p>
    <hr>
    <address>Apache/2.4.57 (Debian) Server at localhost Port 8000</address>
    </body></html>
    
    ```
    

**Mock Response 401**:権限なし

- **Mock Response 403**:アクセス禁止
    
    ```json
    // 省略
    {
        "message": "This action is unauthorized.",
        "exception": "Symfony\\Component\\HttpKernel\\Exception\\AccessDeniedHttpException",
        "file": "/var/www/html/vendor/laravel/framework/src/Illuminate/Foundation/Exceptions/Handler.php",
        "line": 673,
        "trace": [
            {
                "file": "/var/www/html/vendor/laravel/framework/src/Illuminate/Foundation/Exceptions/Handler.php",
                "line": 617,
                "function": "prepareException",
                "class": "Illuminate\\Foundation\\Exceptions\\Handler",
                "type": "->"
            }
        ]
    }
    ```
    
- **Mock Response 404**:レコードが存在しない
    
    ```json
    // 省略
    {
        "message": "No query results for model [App\\Models\\LearningSession] 140",
        "exception": "Symfony\\Component\\HttpKernel\\Exception\\NotFoundHttpException",
        "file": "/var/www/html/vendor/laravel/framework/src/Illuminate/Foundation/Exceptions/Handler.php",
        "line": 669,
        "trace": [
            {
                "file": "/var/www/html/vendor/laravel/framework/src/Illuminate/Foundation/Exceptions/Handler.php",
                "line": 617,
                "function": "prepareException",
                "class": "Illuminate\\Foundation\\Exceptions\\Handler",
                "type": "->"
            }
        ]
    }
    ```
    

---

## 6. セクション別学習記録

- **Method**: GET
- **URL**: `/api/sections/{sectionId}/sessions`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Path Parameters**:

| Parameter | Type | Description |
| --- | --- | --- |
| sectionId | integer | セクションID |
- **Mock Response 200**:（例: sectionId=2の場合）
    
    ```json
    {
        "data": [
            {
                "id": 5,
                "user_id": 1,
                "learning_content_id": 1,
                "section_id": 2,
                "study_minutes": 75,
                "memo": ".envファイルの設定確認",
                "mood_rating": 5,
                "session_type": "manual",
                "studied_at": "2025-06-05 11:45:00",
                "created_at": "2025-09-13 13:15:43",
                "updated_at": "2025-09-13 13:15:43"
            },
            {
                "id": 4,
                "user_id": 1,
                "learning_content_id": 1,
                "section_id": 2,
                "study_minutes": 150,
                "memo": "Laravelプロジェクトの作成完了",
                "mood_rating": 4,
                "session_type": "manual",
                "studied_at": "2025-06-04 16:30:00",
                "created_at": "2025-09-13 13:15:43",
                "updated_at": "2025-09-13 13:15:43"
            },
            {
                "id": 3,
                "user_id": 1,
                "learning_content_id": 1,
                "section_id": 2,
                "study_minutes": 180,
                "memo": "Composerのインストールと設定",
                "mood_rating": 2,
                "session_type": "manual",
                "studied_at": "2025-06-03 10:00:00",
                "created_at": "2025-09-13 13:15:43",
                "updated_at": "2025-09-13 13:15:43"
            }
        ],
        "links": {
            "first": "http://localhost:8000/api/sections/2/sessions?page=1",
            "last": "http://localhost:8000/api/sections/2/sessions?page=1",
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
                    "url": "http://localhost:8000/api/sections/2/sessions?page=1",
                    "label": "1",
                    "active": true
                },
                {
                    "url": null,
                    "label": "次へ &raquo;",
                    "active": false
                }
            ],
            "path": "http://localhost:8000/api/sections/2/sessions",
            "per_page": 20,
            "to": 3,
            "total": 3
        }
    }
    ```
    
- **Mock Response 200**:パラメータ未定義
    
    ```json
    <!DOCTYPE html>
    <html lang="ja">
    
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="csrf-token" content="2hLjRtR64E613jWvj25PWO2paOIMu4ZJm6YLzXfL">
      <title>LearnTrack Pro</title>
      <script type="module" src="http://0.0.0.0:5173/@vite/client"></script>
      <link rel="stylesheet" href="http://0.0.0.0:5173/resources/css/app.css" />
      <script type="module" src="http://0.0.0.0:5173/resources/js/app.js"></script>
    </head>
    
    <body>
      <div id="app"></div>
    </body>
    
    </html>
    ```
    

**Mock Response 401**:権限なし

**Mock Response 403**:アクセス禁止

**Mock Response 404**:レコードが存在しない

---

## 7. 学習内容別学習記録

- **Method**: GET
- **URL**: `/api/learning-contents/{learningContentId}/sessions`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Path Parameters**:

| Parameter | Type | Description |
| --- | --- | --- |
| learningContentId | integer | 学習記録ID |
- **Mock Response 200**:
    
    ```json
    {
        "data": [
            {
                "id": 139,
                "user_id": 1,
                "learning_content_id": 2,
                "section_id": 30,
                "study_minutes": 150,
                "memo": "Apidocで更新",
                "mood_rating": 5,
                "session_type": "manual",
                "studied_at": "2025-09-26 14:00:00",
                "created_at": "2025-09-26 22:08:05",
                "updated_at": "2025-09-26 22:54:36",
                "section": {
                    "id": 30,
                    "learning_content_id": 2,
                    "title": "カスタムディレクティブ",
                    "order": 10,
                    "status": "not_started",
                    "created_at": "2025-09-13 12:53:19",
                    "updated_at": "2025-09-13 12:53:19"
                }
            },
            {
                "id": 73,
                "user_id": 1,
                "learning_content_id": 2,
                "section_id": 29,
                "study_minutes": 240,
                "memo": "Nuxt.js入門",
                "mood_rating": 5,
                "session_type": "manual",
                "studied_at": "2024-08-26 09:30:00",
                "created_at": "2025-09-13 13:15:43",
                "updated_at": "2025-09-13 13:15:43",
                "section": {
                    "id": 29,
                    "learning_content_id": 2,
                    "title": "SSRとNuxt.js",
                    "order": 9,
                    "status": "completed",
                    "created_at": "2025-09-13 12:53:19",
                    "updated_at": "2025-09-13 12:53:19"
                }
            },
            {
                "id": 72,
                "user_id": 1,
                "learning_content_id": 2,
                "section_id": 28,
                "study_minutes": 120,
                "memo": "バンドル最適化",
                "mood_rating": 4,
                "session_type": "manual",
                "studied_at": "2024-08-25 11:00:00",
                "created_at": "2025-09-13 13:15:43",
                "updated_at": "2025-09-13 13:15:43",
                "section": {
                    "id": 28,
                    "learning_content_id": 2,
                    "title": "パフォーマンス最適化",
                    "order": 8,
                    "status": "completed",
                    "created_at": "2025-09-13 12:53:19",
                    "updated_at": "2025-09-13 12:53:19"
                }
            },
            {
                "id": 71,
                "user_id": 1,
                "learning_content_id": 2,
                "section_id": 27,
                "study_minutes": 150,
                "memo": "Vitestでのテスト",
                "mood_rating": 4,
                "session_type": "manual",
                "studied_at": "2024-08-24 14:00:00",
                "created_at": "2025-09-13 13:15:43",
                "updated_at": "2025-09-13 13:15:43",
                "section": {
                    "id": 27,
                    "learning_content_id": 2,
                    "title": "テスト戦略",
                    "order": 7,
                    "status": "completed",
                    "created_at": "2025-09-13 12:53:19",
                    "updated_at": "2025-09-13 12:53:19"
                }
            },
            {
                "id": 70,
                "user_id": 1,
                "learning_content_id": 2,
                "section_id": 26,
                "study_minutes": 210,
                "memo": "TypeScript導入",
                "mood_rating": 3,
                "session_type": "manual",
                "studied_at": "2024-08-23 10:00:00",
                "created_at": "2025-09-13 13:15:43",
                "updated_at": "2025-09-13 13:15:43",
                "section": {
                    "id": 26,
                    "learning_content_id": 2,
                    "title": "TypeScript統合",
                    "order": 6,
                    "status": "completed",
                    "created_at": "2025-09-13 12:53:19",
                    "updated_at": "2025-09-13 12:53:19"
                }
            },
            {
                "id": 69,
                "user_id": 1,
                "learning_content_id": 2,
                "section_id": 25,
                "study_minutes": 180,
                "memo": "コンポーネント設計パターン",
                "mood_rating": 5,
                "session_type": "manual",
                "studied_at": "2024-08-22 13:30:00",
                "created_at": "2025-09-13 13:15:43",
                "updated_at": "2025-09-13 13:15:43",
                "section": {
                    "id": 25,
                    "learning_content_id": 2,
                    "title": "コンポーネント設計",
                    "order": 5,
                    "status": "completed",
                    "created_at": "2025-09-13 12:53:19",
                    "updated_at": "2025-09-13 12:53:19"
                }
            },
            {
                "id": 68,
                "user_id": 1,
                "learning_content_id": 2,
                "section_id": 24,
                "study_minutes": 120,
                "memo": "Piniaの状態管理",
                "mood_rating": 4,
                "session_type": "manual",
                "studied_at": "2024-08-21 09:00:00",
                "created_at": "2025-09-13 13:15:43",
                "updated_at": "2025-09-13 13:15:43",
                "section": {
                    "id": 24,
                    "learning_content_id": 2,
                    "title": "Vuex/Pinia",
                    "order": 4,
                    "status": "completed",
                    "created_at": "2025-09-13 12:53:19",
                    "updated_at": "2025-09-13 12:53:19"
                }
            },
            {
                "id": 67,
                "user_id": 1,
                "learning_content_id": 2,
                "section_id": 23,
                "study_minutes": 90,
                "memo": "Vue Routerの設定",
                "mood_rating": 3,
                "session_type": "manual",
                "studied_at": "2024-08-20 14:30:00",
                "created_at": "2025-09-13 13:15:43",
                "updated_at": "2025-09-13 13:15:43",
                "section": {
                    "id": 23,
                    "learning_content_id": 2,
                    "title": "Vue Router",
                    "order": 3,
                    "status": "completed",
                    "created_at": "2025-09-13 12:53:19",
                    "updated_at": "2025-09-13 12:53:19"
                }
            },
            {
                "id": 66,
                "user_id": 1,
                "learning_content_id": 2,
                "section_id": 22,
                "study_minutes": 150,
                "memo": "Composition APIの基礎",
                "mood_rating": 5,
                "session_type": "manual",
                "studied_at": "2024-08-19 10:00:00",
                "created_at": "2025-09-13 13:15:43",
                "updated_at": "2025-09-13 13:15:43",
                "section": {
                    "id": 22,
                    "learning_content_id": 2,
                    "title": "Composition API",
                    "order": 2,
                    "status": "completed",
                    "created_at": "2025-09-13 12:53:19",
                    "updated_at": "2025-09-13 12:53:19"
                }
            },
            {
                "id": 65,
                "user_id": 1,
                "learning_content_id": 2,
                "section_id": 21,
                "study_minutes": 120,
                "memo": "Vueの基本構文",
                "mood_rating": 4,
                "session_type": "manual",
                "studied_at": "2024-08-18 13:00:00",
                "created_at": "2025-09-13 13:15:43",
                "updated_at": "2025-09-13 13:15:43",
                "section": {
                    "id": 21,
                    "learning_content_id": 2,
                    "title": "Vue.jsの基本",
                    "order": 1,
                    "status": "completed",
                    "created_at": "2025-09-13 12:53:19",
                    "updated_at": "2025-09-13 12:53:19"
                }
            }
        ],
        "links": {
            "first": "http://localhost:8000/api/learning-contents/2/sessions?page=1",
            "last": "http://localhost:8000/api/learning-contents/2/sessions?page=1",
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
                    "url": "http://localhost:8000/api/learning-contents/2/sessions?page=1",
                    "label": "1",
                    "active": true
                },
                {
                    "url": null,
                    "label": "次へ &raquo;",
                    "active": false
                }
            ],
            "path": "http://localhost:8000/api/learning-contents/2/sessions",
            "per_page": 20,
            "to": 10,
            "total": 10
        }
    }
    ```
    
- **Mock Response 200**:パラメータ未定義
    
    ```json
    <!DOCTYPE html>
    <html lang="ja">
    
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="csrf-token" content="2hLjRtR64E613jWvj25PWO2paOIMu4ZJm6YLzXfL">
      <title>LearnTrack Pro</title>
      <script type="module" src="http://0.0.0.0:5173/@vite/client"></script><link rel="stylesheet" href="http://0.0.0.0:5173/resources/css/app.css" /><script type="module" src="http://0.0.0.0:5173/resources/js/app.js"></script></head>
    
    <body>
      <div id="app"></div>
    </body>
    
    </html>
    
    ```
    

**Mock Response 401**:権限なし

**Mock Response 403**:アクセス禁止

**Mock Response 404**:レコードが存在しない

---

## 備考

### データベースフィールド

- `study_minutes`: 学習時間（分）- 1～1440の範囲
- `memo`: 学習メモ（最大1000文字、NULL許可）
- `mood_rating`: 調子評価（1～5の範囲、NULL許可）
- `session_type`: 記録タイプ（'manual' または 'stopwatch'）
- `studied_at`: 学習日時
- `learning_content_id`: 学習内容ID（必須）
- `section_id`: セクションID（必須）

### 重要な仕様

- 学習記録は必ずセクションに紐づきます
- `learning_content_id`と`section_id`の両方が必須です
- 削除時、関連するセクションと学習内容の統計情報が自動的に更新されます
- ページネーション対応（デフォルト20件/ページ）

---
