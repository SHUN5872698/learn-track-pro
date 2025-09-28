## 相互リンク

[レポート・統計API](https://www.notion.so/API-2689d86c12e880bca3fde6b9f76c0ad1?pvs=21) 

.gemini/docs/apis/endpoint-docs/Dev/レポート・統計API.md

---

## RESTful エンドポイント

```bash
GET    /api/learning-sessions/statistics/summary                    # 統計サマリー
GET    /api/learning-sessions/statistics/monthly                    # 月別統計
GET    /api/learning-sessions/statistics/by-technology              # 技術別統計
GET    /api/learning-sessions/statistics/daily                      # 日別統計
GET    /api/learning-sessions/statistics/latest-by-content          # 学習内容別最新記録取得
GET    /api/learning-contents/{learningContentId}/statistics/daily  # 学習内容別日別統計取得
```

---

## 1. 統計サマリー

**Method:** GET

**URL:** `/api/learning-sessions/statistics/summary`

Headers:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |
- **Response 200:**
    
    ```json
    // total_study_minutesはinteger**型**として定義されているかを確認する
    {
        "total_study_minutes": 18120,
        "completed_courses_count": 1,
        "average_study_time_per_day": 191,
        "consecutive_study_days": 0
    }
    ```
    

**Mock Response 401**:権限なし

---

## 2. 月別統計

**Method:** GET

**URL:** `/api/learning-sessions/statistics/monthly`

**Headers:**

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Query Parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| months | integer | 取得する月数（デフォルト: 6） |
- **Response 200:**（例: months=6の場合）
    
    ```json
    [
        {
            "month": "2025-06",
            "total_minutes": "3595"
        },
        {
            "month": "2025-07",
            "total_minutes": "3600"
        },
        {
            "month": "2025-08",
            "total_minutes": "2525"
        },
        {
            "month": "2025-09",
            "total_minutes": "6210"
        }
    ]
    ```
    
- **Response 200:**（例: months=0の場合）
    
    ```json
    [
        {
            "month": "2025-06",
            "total_minutes": "3595"
        },
        {
            "month": "2025-07",
            "total_minutes": "3600"
        },
        {
            "month": "2025-08",
            "total_minutes": "2525"
        },
        {
            "month": "2025-09",
            "total_minutes": "6210"
        }
    ]
    ```
    

**Mock Response 401**:権限なし

---

## 3. 技術別統計

**Method:** GET

**URL:** `/api/learning-sessions/statistics/by-technology`

**Headers:**

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |
- **Response 200:**
    
    ```json
    [
        {
            "technology_name": "Laravel",
            "total_minutes": "9135"
        },
        {
            "technology_name": "Docker",
            "total_minutes": "5940"
        },
        {
            "technology_name": "Vue.js",
            "total_minutes": "1530"
        },
        {
            "technology_name": "React",
            "total_minutes": "960"
        },
        {
            "technology_name": "PHP",
            "total_minutes": "705"
        }
    ]
    ```
    

**Mock Response 401**:権限なし

---

## 4. 日別統計

**Method:** GET

**URL:** `/api/learning-sessions/statistics/daily`

**Headers:**

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Query Parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| days | integer | 取得する日数（デフォルト: 30） |
- **Response 200:**（例: days=30の場合）
    
    ```json
    [
        {
            "date": "2025-08-28",
            "total_minutes": "210"
        },
        {
            "date": "2025-08-29",
            "total_minutes": "30"
        },
        {
            "date": "2025-08-30",
            "total_minutes": "45"
        },
        {
            "date": "2025-08-31",
            "total_minutes": "90"
        },
        {
            "date": "2025-09-01",
            "total_minutes": "390"
        },
        {
            "date": "2025-09-02",
            "total_minutes": "165"
        },
        {
            "date": "2025-09-03",
            "total_minutes": "420"
        },
        {
            "date": "2025-09-04",
            "total_minutes": "255"
        },
        {
            "date": "2025-09-05",
            "total_minutes": "45"
        },
        {
            "date": "2025-09-06",
            "total_minutes": "450"
        },
        {
            "date": "2025-09-07",
            "total_minutes": "180"
        },
        {
            "date": "2025-09-08",
            "total_minutes": "330"
        },
        {
            "date": "2025-09-09",
            "total_minutes": "330"
        },
        {
            "date": "2025-09-10",
            "total_minutes": "420"
        },
        {
            "date": "2025-09-11",
            "total_minutes": "420"
        },
        {
            "date": "2025-09-12",
            "total_minutes": "390"
        },
        {
            "date": "2025-09-13",
            "total_minutes": "370"
        },
        {
            "date": "2025-09-14",
            "total_minutes": "210"
        },
        {
            "date": "2025-09-15",
            "total_minutes": "380"
        },
        {
            "date": "2025-09-16",
            "total_minutes": "360"
        },
        {
            "date": "2025-09-17",
            "total_minutes": "135"
        },
        {
            "date": "2025-09-18",
            "total_minutes": "300"
        },
        {
            "date": "2025-09-19",
            "total_minutes": "150"
        },
        {
            "date": "2025-09-20",
            "total_minutes": "270"
        },
        {
            "date": "2025-09-21",
            "total_minutes": "90"
        },
        {
            "date": "2025-09-26",
            "total_minutes": "150"
        }
    ]
    ```
    
- **Response 200:**（例: days=0の場合）
    
    ```json
    []
    ```
    

**Mock Response 401**:権限なし

---

## 5. 学習内容別最新記録取得

**Method:** GET

**URL:** `/api/learning-sessions/statistics/latest-by-content`

**Headers:**

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |
- **Response 200:**
    
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
                    "updated_at": "2025-09-13 12:30:46"
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
            },
            {
                "id": 131,
                "user_id": 1,
                "learning_content_id": 4,
                "section_id": 80,
                "study_minutes": 90,
                "memo": "イメージスキャン",
                "mood_rating": 4,
                "session_type": "manual",
                "studied_at": "2025-09-21 10:00:00",
                "created_at": "2025-09-13 13:15:43",
                "updated_at": "2025-09-13 13:15:43",
                "learning_content": {
                    "id": 4,
                    "user_id": 1,
                    "technology_id": 18,
                    "title": "Dockerの基礎学習",
                    "description": "コンテナ化の基礎とDockerの再確認",
                    "total_sections": 10,
                    "completed_sections": 9,
                    "status": "in_progress",
                    "completed_at": null,
                    "created_at": "2025-09-13 12:30:46",
                    "updated_at": "2025-09-13 12:30:46"
                },
                "section": {
                    "id": 80,
                    "learning_content_id": 4,
                    "title": "セキュリティとベストプラクティス",
                    "order": 10,
                    "status": "in_progress",
                    "created_at": "2025-09-13 12:53:19",
                    "updated_at": "2025-09-13 12:53:19"
                }
            },
            {
                "id": 64,
                "user_id": 1,
                "learning_content_id": 5,
                "section_id": 59,
                "study_minutes": 120,
                "memo": "既存コードの移行計画",
                "mood_rating": 3,
                "session_type": "manual",
                "studied_at": "2025-09-01 14:00:00",
                "created_at": "2025-09-13 13:15:43",
                "updated_at": "2025-09-13 13:15:43",
                "learning_content": {
                    "id": 5,
                    "user_id": 1,
                    "technology_id": 4,
                    "title": "PHP8.5の内容確認",
                    "description": "PHP8.5で実装されるRFCの確認",
                    "total_sections": 10,
                    "completed_sections": 10,
                    "status": "in_progress",
                    "completed_at": null,
                    "created_at": "2025-09-13 12:30:46",
                    "updated_at": "2025-09-13 12:30:46"
                },
                "section": {
                    "id": 59,
                    "learning_content_id": 5,
                    "title": "移行ガイド",
                    "order": 10,
                    "status": "completed",
                    "created_at": "2025-09-13 12:53:19",
                    "updated_at": "2025-09-13 12:53:19"
                }
            },
            {
                "id": 54,
                "user_id": 1,
                "learning_content_id": 1,
                "section_id": 20,
                "study_minutes": 90,
                "memo": "最終確認とまとめ",
                "mood_rating": 5,
                "session_type": "manual",
                "studied_at": "2025-08-28 17:00:00",
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
                    "id": 20,
                    "learning_content_id": 1,
                    "title": "デプロイ",
                    "order": 20,
                    "status": "completed",
                    "created_at": "2025-09-13 12:53:19",
                    "updated_at": "2025-09-13 12:53:19"
                }
            },
            {
                "id": 79,
                "user_id": 1,
                "learning_content_id": 3,
                "section_id": 41,
                "study_minutes": 180,
                "memo": "React.memoとuseMemo",
                "mood_rating": 5,
                "session_type": "manual",
                "studied_at": "2024-09-07 10:30:00",
                "created_at": "2025-09-13 13:15:43",
                "updated_at": "2025-09-13 13:15:43",
                "learning_content": {
                    "id": 3,
                    "user_id": 1,
                    "technology_id": 3,
                    "title": "React基礎からNext.jsまで",
                    "description": "Reactの基礎概念からNext.jsを使った本格的なWebアプリケーション開発まで",
                    "total_sections": 10,
                    "completed_sections": 6,
                    "status": "in_progress",
                    "completed_at": null,
                    "created_at": "2025-09-13 12:30:46",
                    "updated_at": "2025-09-13 12:30:46"
                },
                "section": {
                    "id": 41,
                    "learning_content_id": 3,
                    "title": "パフォーマンス最適化",
                    "order": 6,
                    "status": "completed",
                    "created_at": "2025-09-13 12:53:19",
                    "updated_at": "2025-09-13 12:53:19"
                }
            }
        ]
    }
    ```
    

**Mock Response 401**:権限なし

---

## 6. 学習内容別最新記録取得

**Method:** GET

**URL:/**`api/learning-contents/{learningContentId}/statistics/daily`

**Headers:**

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Query Parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| days | integer | 取得する日数（デフォルト: 30） |
| learningContentId | integer | 学習記録ID |
- **Response 200:**（例: days=365,learningContentId=1の場合）
    
    ```json
    [
        {
            "date": "2025-09-26",
            "total_minutes": "150"
        }
    ]
    ```
    
- **Response 200:**（例: days=null,learningContentId=1の場合）
    
    ```json
    []
    ```
    

**Mock Response 401**:権限なし

**Mock Response 403**:アクセス禁止

**Mock Response 404**:レコードが存在しない

---

## 備考

### 重要な仕様

- `total_study_minutes`は**integer型**として定義
- 月別・技術別・日別統計の`total_minutes`は**string型**のまま（SQLの集計結果のため）

---
