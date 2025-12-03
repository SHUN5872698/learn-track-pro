## RESTful エンドポイント

```bash
GET    /api/learning-contents/{learningContentId}/sections                      # セクション一覧
POST   /api/sections                                             # セクション追加
PUT    /api/sections/{sectionId}                                        # セクション編集
PUT    /api/sections/{sectionId}/status                                 # ステータス変更
PUT    /api/learning-contents/{learningContentId}/sections/bulk  # セクション一括更新
DELETE /api/sections/{sectionId}                                        # セクション削除
```

---

## カスタムスクリプト

### Post-processor: 環境変数更新

**セクション一覧取得（GET）Post-processor**

```jsx
// セクション一覧取得成功時に環境変数を設定
const response = pm.response.json();

if (pm.response.code === 200) {
    const sections = response.data?.sections || response.data || response.sections || response;
    
    if (Array.isArray(sections) && sections.length > 0) {
        // 最初のセクションのIDを保存（編集・削除用）
        pm.environment.set('section_id', sections[0].id);
        console.log("✅ section_id 設定:", sections[0].id);
        
        // 各セクションのIDを個別に保存（一括更新用）
        sections.slice(0, 3).forEach((section, index) => {
            pm.environment.set(`section_id_${index + 1}`, section.id);
        });
        console.log("✅ section_id_1〜" + Math.min(sections.length, 3) + " 設定完了");
        
        // セクション数を保存
        pm.environment.set('total_sections', sections.length);
        console.log("✅ total_sections 設定:", sections.length);
        
        // 最大order番号を取得して次のorderを計算（作成用）
        const maxOrder = Math.max(...sections.map(s => s.order));
        pm.environment.set('next_section_order', maxOrder + 1);
        console.log("✅ next_section_order 設定:", maxOrder + 1);
    }
}
```

**セクション作成（POST /api/sections）**

```jsx
// セクション作成成功時にIDを更新
const response = pm.response.json();

if (pm.response.code === 201 && response.data && response.data.id) {
    pm.environment.set('section_id', response.data.id);
    console.log("✅ section_id 設定:", response.data.id);
    
    // total_sectionsを+1、next_section_orderを更新
    const currentTotal = parseInt(pm.environment.get('total_sections') || '0');
    pm.environment.set('total_sections', currentTotal + 1);
    pm.environment.set('next_section_order', response.data.order + 1);
    console.log("✅ total_sections 更新:", currentTotal + 1);
    console.log("✅ next_section_order 更新:", response.data.order + 1);
}
```

**セクション一括更新（PUT）Post-processor**

```jsx
// セクション一括更新成功時にsection_id_1〜3を削除
// 理由: 動的値を使用する場合、IDを再利用すると不整合が起きやすいため
if (pm.response.code === 200) {
    pm.environment.unset('section_id_1');
    pm.environment.unset('section_id_2');
    pm.environment.unset('section_id_3');
    console.log("🗑️ section_id_1〜3 削除（一括更新完了）");
}

```

**セクション削除（DELETE /api/sections/{section_id}）**

```jsx
// セクション削除成功時に環境変数を初期化
if (pm.response.code === 200 || pm.response.code === 204) {
    pm.environment.set('section_id', '');
    console.log("🗑️ section_id 初期化");
    
    // total_sectionsを-1
    const currentTotal = parseInt(pm.environment.get('total_sections') || '1');
    pm.environment.set('total_sections', Math.max(currentTotal - 1, 1));
    console.log("✅ total_sections 更新:", Math.max(currentTotal - 1, 1));
}
```

---

## 1. セクション一覧取得

- **Method**: GET
- **URL**: `/api/learning-contents/{learningContentId}/sections`

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
- **Mock Response 200（例: learning_content_id=2の場合）**:
    
    ```json
    {
        "data": [
            {
                "id": 21,
                "learning_content_id": 2,
                "title": "Vue.jsの基本",
                "order": 1,
                "status": "completed",
                "completed_at": "2024-01-14 18:00:00",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 22,
                "learning_content_id": 2,
                "title": "Composition API",
                "order": 2,
                "status": "completed",
                "completed_at": "2024-01-14 18:00:00",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 23,
                "learning_content_id": 2,
                "title": "Vue Router",
                "order": 3,
                "status": "completed",
                "completed_at": "2024-01-14 18:00:00",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 24,
                "learning_content_id": 2,
                "title": "Vuex/Pinia",
                "order": 4,
                "status": "completed",
                "completed_at": "2024-01-14 18:00:00",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 25,
                "learning_content_id": 2,
                "title": "コンポーネント設計",
                "order": 5,
                "status": "completed",
                "completed_at": "2024-01-14 18:00:00",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 26,
                "learning_content_id": 2,
                "title": "TypeScript統合",
                "order": 6,
                "status": "completed",
                "completed_at": "2024-01-14 18:00:00",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 27,
                "learning_content_id": 2,
                "title": "テスト戦略",
                "order": 7,
                "status": "completed",
                "completed_at": "2024-01-14 18:00:00",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 28,
                "learning_content_id": 2,
                "title": "パフォーマンス最適化",
                "order": 8,
                "status": "completed",
                "completed_at": "2024-01-14 18:00:00",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 29,
                "learning_content_id": 2,
                "title": "SSRとNuxt.js",
                "order": 9,
                "status": "completed",
                "completed_at": "2024-01-14 18:00:00",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 30,
                "learning_content_id": 2,
                "title": "カスタムディレクティブ",
                "order": 10,
                "status": "not_started",
                "completed_at": null,
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 31,
                "learning_content_id": 2,
                "title": "プラグイン開発",
                "order": 11,
                "status": "not_started",
                "completed_at": null,
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 32,
                "learning_content_id": 2,
                "title": "アニメーション",
                "order": 12,
                "status": "not_started",
                "completed_at": null,
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 33,
                "learning_content_id": 2,
                "title": "国際化（i18n）",
                "order": 13,
                "status": "not_started",
                "completed_at": null,
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 34,
                "learning_content_id": 2,
                "title": "PWA対応",
                "order": 14,
                "status": "not_started",
                "completed_at": null,
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 35,
                "learning_content_id": 2,
                "title": "デプロイ戦略",
                "order": 15,
                "status": "not_started",
                "completed_at": null,
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            }
        ]
    }
    ```
    

**Mock Response 200（パラメータ指定なし）:**HTMLが返却

**Mock Response 401**:権限なし

**Mock Response 403**:アクセス禁止

**Mock Response 404:**レコードが存在しない

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
- **Request Body (JSON)**:
    
    ```json
    {
        "learning_content_id": 2,
        "title": "Apidocで作成",
        "order": 16
    }
    ```
    
- **Mock Response 201**:
    
    ```json
    {
        "data": {
            "status": "not_started",
            "learning_content_id": 2,
            "title": "Apidocで作成",
            "order": 16,
            "updated_at": "2025-09-26 11:12:54",
            "created_at": "2025-09-26 11:12:54",
            "id": 92
        },
        "message": "セクションを追加しました。"
    }
    ```
    

**Mock Response 401**:権限なし

**Mock Response 403**:アクセス禁止

**Mock Response 404:**レコードが存在しない

- **Mock Response 422**:バリデーションエラー
    
    ```json
    {
        "message": "学習コンテンツは必須項目です。 (その他、2エラーあり)",
        "errors": {
            "learning_content_id": [
                "学習コンテンツは必須項目です。"
            ],
            "title": [
                "タイトルは必須項目です。"
            ],
            "order": [
                "orderは必須項目です。"
            ]
        }
    }
    ```
    

**Mock Response 500**:orderの重複

---

## 3. セクション編集

- **Method**: PUT
- **URL**: `/api/sections/{sectionId}`

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
- **Request Body (JSON)**:
    
    ```json
    {
        "title": "Apidocで更新",
        "order": 17
    }
    ```
    
- **Mock Response 200（例: id=94の場合）**:
    
    ```json
    {
        "data": {
            "id": 94,
            "learning_content_id": 2,
            "title": "Apidocで更新",
            "order": 17,
            "status": "not_started",
            "completed_at": null,
            "created_at": "2025-09-26 11:21:26",
            "updated_at": "2025-09-26 11:29:26",
            "learning_content": {
                "id": 2,
                "user_id": 1,
                "technology_id": 2,
                "title": "Vue.js 3 実践ガイド",
                "description": "Vue.js 3のComposition APIとTypeScriptを使ったモダンなフロントエンド開発",
                "total_sections": 17,
                "completed_sections": 9,
                "status": "in_progress",
                "completed_at": null,
                "created_at": "2025-09-13 12:30:46",
                "updated_at": "2025-09-26 11:21:26"
            }
        },
        "message": "セクションを更新しました。"
    }
    ```
    

**Mock Response 301（パラメータ指定なし）:**HTMLが返却

**Mock Response 401**:権限なし

**Mock Response 403**:アクセス禁止

**Mock Response 404:**レコードが存在しない

- **Mock Response 422**:バリデーションエラー
    
    ```json
    {
        "message": "タイトルは必須項目です。 (その他、1エラーあり)",
        "errors": {
            "title": [
                "タイトルは必須項目です。"
            ],
            "order": [
                "orderは必須項目です。"
            ]
        }
    }
    ```
    

**Mock Response 500**:orderの重複

---

## 4. セクションステータス変更

- **Method**: PUT
- **URL**: `/api/sections/{sectionId}/status`

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
- **Request Body (JSON)**:
    
    ```json
    {
        "status": "in_progress"
    }
    
    ```
    
    **Status Values**:
    
    - `not_started`: 未着手
    - `in_progress`: 学習中
    - `completed`: 完了
- **Mock Response 200（例: id=94を学習中にする場合）**:
    
    ```json
    {
        "data": {
            "id": 94,
            "learning_content_id": 2,
            "title": "Vue3の新機能",
            "order": 16,
            "status": "in_progress",
            "completed_at": null,
            "created_at": "2025-09-26 11:58:03",
            "updated_at": "2025-09-26 13:02:01",
            "learning_content": {
                "id": 2,
                "user_id": 1,
                "technology_id": 2,
                "title": "Vue.js 3 実践ガイド",
                "description": "Vue.js 3のComposition APIとTypeScriptを使ったモダンなフロントエンド開発",
                "total_sections": 17,
                "completed_sections": 9,
                "status": "in_progress",
                "completed_at": null,
                "created_at": "2025-09-13 12:30:46",
                "updated_at": "2025-09-26 11:58:03"
            }
        },
        "message": "ステータスを更新しました。"
    }
    ```
    
- **Mock Response 200（例: id=94を完了にする場合）**:
    
    ```json
    {
        "data": {
            "id": 94,
            "learning_content_id": 2,
            "title": "Vue3の新機能",
            "order": 16,
            "status": "completed",
            "completed_at": "2025-09-26 13:05:28",
            "created_at": "2025-09-26 11:58:03",
            "updated_at": "2025-09-26 13:05:28",
            "learning_content": {
                "id": 2,
                "user_id": 1,
                "technology_id": 2,
                "title": "Vue.js 3 実践ガイド",
                "description": "Vue.js 3のComposition APIとTypeScriptを使ったモダンなフロントエンド開発",
                "total_sections": 17,
                "completed_sections": 10,
                "status": "in_progress",
                "completed_at": null,
                "created_at": "2025-09-13 12:30:46",
                "updated_at": "2025-09-26 13:04:44"
            }
        },
        "message": "ステータスを更新しました。"
    }
    ```
    

**Mock Response 401**:権限なし

**Mock Response 403**:アクセス禁止

**Mock Response 404:**レコードが存在しない

**Mock Response 405（パラメータ指定なし）:**

**Mock Response 422**:バリデーションエラー

---

## 5. セクション一括更新

- **Method**: PUT
- **URL**: `/api/learning-contents/{learningContentId}/sections/bulk`

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

**Request Body (JSON)**:

- 更新のみ
    
    ```json
    {
        "sections": [
            {
                "id": 21,
                "title": "Vue.jsの基本（更新）",
                "order": 2
            },
            {
                "id": 22,
                "title": "Composition API（更新）",
                "order": 1
            }
        ]
    }
    ```
    
- 一括
    
    ```json
    {
        "sections": [
            {
                "id": 21,
                "title": "Vue.jsの基本（更新）",
                "order": 2
            },
            {
                "id": 22,
                "title": "Composition API（更新）",
                "order": 1
            },
            {
                "id": null,
                "title": "テスト実装",
                "order": 17
            },
            {
                "id": null,
                "title": "デプロイ",
                "order": 18
            }
        ],
        "deleted_section_ids": [
            23,
            24
        ]
    }
    ```
    
- バリデーションエラー
    
    ```json
    {
        "sections": [],
        "deleted_section_ids": [
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30,
            31,
            32,
            33,
            34,
            35,
            94
        ]
    }
    ```
    
- **Mock Response 200**:更新のみ
    
    ```json
    {
        "data": [
            {
                "id": 22,
                "learning_content_id": 2,
                "title": "Composition API（更新）",
                "order": 1,
                "status": "completed",
                "completed_at": "2024-01-14 18:00:00",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-26 13:54:48"
            },
            {
                "id": 21,
                "learning_content_id": 2,
                "title": "Vue.jsの基本（更新）",
                "order": 2,
                "status": "completed",
                "completed_at": "2024-01-14 18:00:00",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-26 13:54:48"
            },
            {
                "id": 23,
                "learning_content_id": 2,
                "title": "Vue Router",
                "order": 3,
                "status": "completed",
                "completed_at": "2024-01-14 18:00:00",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 24,
                "learning_content_id": 2,
                "title": "Vuex/Pinia",
                "order": 4,
                "status": "completed",
                "completed_at": "2024-01-14 18:00:00",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 25,
                "learning_content_id": 2,
                "title": "コンポーネント設計",
                "order": 5,
                "status": "completed",
                "completed_at": "2024-01-14 18:00:00",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 26,
                "learning_content_id": 2,
                "title": "TypeScript統合",
                "order": 6,
                "status": "completed",
                "completed_at": "2024-01-14 18:00:00",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 27,
                "learning_content_id": 2,
                "title": "テスト戦略",
                "order": 7,
                "status": "completed",
                "completed_at": "2024-01-14 18:00:00",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 28,
                "learning_content_id": 2,
                "title": "パフォーマンス最適化",
                "order": 8,
                "status": "completed",
                "completed_at": "2024-01-14 18:00:00",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 29,
                "learning_content_id": 2,
                "title": "SSRとNuxt.js",
                "order": 9,
                "status": "completed",
                "completed_at": "2024-01-14 18:00:00",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 30,
                "learning_content_id": 2,
                "title": "カスタムディレクティブ",
                "order": 10,
                "status": "not_started",
                "completed_at": null,
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 31,
                "learning_content_id": 2,
                "title": "プラグイン開発",
                "order": 11,
                "status": "not_started",
                "completed_at": null,
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 32,
                "learning_content_id": 2,
                "title": "アニメーション",
                "order": 12,
                "status": "not_started",
                "completed_at": null,
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 33,
                "learning_content_id": 2,
                "title": "国際化（i18n）",
                "order": 13,
                "status": "not_started",
                "completed_at": null,
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 34,
                "learning_content_id": 2,
                "title": "PWA対応",
                "order": 14,
                "status": "not_started",
                "completed_at": null,
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 35,
                "learning_content_id": 2,
                "title": "デプロイ戦略",
                "order": 15,
                "status": "not_started",
                "completed_at": null,
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 94,
                "learning_content_id": 2,
                "title": "Vue3の新機能",
                "order": 16,
                "status": "in_progress",
                "completed_at": null,
                "created_at": "2025-09-26 11:58:03",
                "updated_at": "2025-09-26 13:14:30"
            }
        ],
        "message": "セクションを更新しました。"
    }
    ```
    
- **Mock Response 200**:一括更新
    
    ```json
    {
        "data": [
            {
                "id": 22,
                "learning_content_id": 2,
                "title": "Composition API（更新）",
                "order": 1,
                "status": "completed",
                "completed_at": "2024-01-14 18:00:00",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-26 14:03:34"
            },
            {
                "id": 21,
                "learning_content_id": 2,
                "title": "Vue.jsの基本（更新）",
                "order": 2,
                "status": "completed",
                "completed_at": "2024-01-14 18:00:00",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-26 14:03:34"
            },
            {
                "id": 25,
                "learning_content_id": 2,
                "title": "コンポーネント設計",
                "order": 5,
                "status": "completed",
                "completed_at": "2024-01-14 18:00:00",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 26,
                "learning_content_id": 2,
                "title": "TypeScript統合",
                "order": 6,
                "status": "completed",
                "completed_at": "2024-01-14 18:00:00",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 27,
                "learning_content_id": 2,
                "title": "テスト戦略",
                "order": 7,
                "status": "completed",
                "completed_at": "2024-01-14 18:00:00",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 28,
                "learning_content_id": 2,
                "title": "パフォーマンス最適化",
                "order": 8,
                "status": "completed",
                "completed_at": "2024-01-14 18:00:00",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 29,
                "learning_content_id": 2,
                "title": "SSRとNuxt.js",
                "order": 9,
                "status": "completed",
                "completed_at": "2024-01-14 18:00:00",
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 30,
                "learning_content_id": 2,
                "title": "カスタムディレクティブ",
                "order": 10,
                "status": "not_started",
                "completed_at": null,
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 31,
                "learning_content_id": 2,
                "title": "プラグイン開発",
                "order": 11,
                "status": "not_started",
                "completed_at": null,
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 32,
                "learning_content_id": 2,
                "title": "アニメーション",
                "order": 12,
                "status": "not_started",
                "completed_at": null,
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 33,
                "learning_content_id": 2,
                "title": "国際化（i18n）",
                "order": 13,
                "status": "not_started",
                "completed_at": null,
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 34,
                "learning_content_id": 2,
                "title": "PWA対応",
                "order": 14,
                "status": "not_started",
                "completed_at": null,
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 35,
                "learning_content_id": 2,
                "title": "デプロイ戦略",
                "order": 15,
                "status": "not_started",
                "completed_at": null,
                "created_at": "2025-09-13 12:53:19",
                "updated_at": "2025-09-13 12:53:19"
            },
            {
                "id": 94,
                "learning_content_id": 2,
                "title": "Vue3の新機能",
                "order": 16,
                "status": "in_progress",
                "completed_at": null,
                "created_at": "2025-09-26 11:58:03",
                "updated_at": "2025-09-26 13:14:30"
            },
            {
                "id": 97,
                "learning_content_id": 2,
                "title": "テスト実装",
                "order": 17,
                "status": "not_started",
                "completed_at": null,
                "created_at": "2025-09-26 14:03:34",
                "updated_at": "2025-09-26 14:03:34"
            },
            {
                "id": 98,
                "learning_content_id": 2,
                "title": "デプロイ",
                "order": 18,
                "status": "not_started",
                "completed_at": null,
                "created_at": "2025-09-26 14:03:34",
                "updated_at": "2025-09-26 14:03:34"
            }
        ],
        "message": "セクションを更新しました。"
    }
    ```
    

**Mock Response 401**:権限なし

**Mock Response 403**:アクセス禁止

**Mock Response 404:**レコードが存在しない

**Mock Response 405（パラメータ指定なし）:**

**Mock Response 422**:バリデーションエラー

---

## 6. セクション削除

- **Method**: DELETE
- **URL**: `/api/sections/{sectionId}`

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
- **Mock Response 200**:
    
    ```json
    {
        "message": "セクションを削除しました。"
    }
    
    ```
    

**Mock Response 301（パラメータ指定なし）:**HTMLが返却

**Mock Response 401**:権限なし

**Mock Response 403**:アクセス禁止

**Mock Response 404:**レコードが存在しない

- **Mock Response 422**:最後のセクション
    
    ```json
    {
        "message": "最低1つのセクションが必要です。"
    }
    ```
    

---

## 備考

- セクションの`order`は同一学習内容内で一意である必要があります
- セクションを削除する際、関連する学習記録が存在する場合は削除できません
- ステータスを`completed`に変更すると、自動的に現在のタイムスタンプが記録されます
- セクションの順番を変更する場合、他のセクションの`order`も自動的に調整される場合があります
- 学習内容には最低1つのセクションが必須です（最後のセクションは削除不可）
- セクション削除時、該当学習内容のtotal_sectionsが自動的に1減少します
- セクション追加時、該当学習内容のtotal_sectionsが自動的に1増加します

---
