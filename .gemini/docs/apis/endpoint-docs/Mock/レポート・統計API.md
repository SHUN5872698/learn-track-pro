## 相互リンク

[レポート・統計API](https://www.notion.so/API-2689d86c12e880bca3fde6b9f76c0ad1?pvs=21) 

.gemini/docs/apis/endpoint-docs/レポート・統計API.md

---

## RESTful エンドポイント

```bash
GET    /api/reports/dashboard-stats           # ダッシュボード統計
GET    /api/reports/weekly-chart              # 週間学習時間チャート
  ?period={week|month|all}                    # 期間指定
  &date={YYYY-MM-DD}                         # 基準日
  &content_id={id}                           # 学習内容別（オプション）
GET    /api/reports/technology-summary        # 技術別学習時間サマリー
  ?period={week|month|all}                    # 期間指定
  &date={YYYY-MM-DD}                         # 基準日
GET    /api/reports/learning-history          # 学習履歴
  ?period={week|month|all}                    # 期間指定
  &content_id={id}                           # 学習内容別（オプション）
  &page={page}                                # ページネーション
  
```

---

## 1. ダッシュボード統計取得

- **Method**: GET
- **URL**: `/api/reports/dashboard-stats`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Mock Response 200**:

```json
{
  "active_courses": 3,
  "completed_sections": 15,
  "total_study_minutes": 2450,
  "average_progress": 62.5,
  "recent_activities": [
    {
      "id": 1,
      "title": "Laravel学習",
      "last_studied_at": "2025-08-21T15:30:00.000000Z",
      "progress_percentage": 30.0
    },
    {
      "id": 2,
      "title": "Vue.js実践",
      "last_studied_at": "2025-08-20T18:00:00.000000Z",
      "progress_percentage": 100.0
    }
  ]
}

```

---

## 2. 週間学習時間チャート

- **Method**: GET
- **URL**: `/api/reports/weekly-chart`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Query Parameters**:

| Parameter | Type | Description |
| --- | --- | --- |
| period | string | `week`, `month`, `all` (デフォルト: `week`) |
| date | string | 基準日 YYYY-MM-DD (デフォルト: 今日) |
| content_id | integer | 学習内容ID（オプション） |

**Mock Response 200**:

```json
{
  "period": "week",
  "start_date": "2025-08-15",
  "end_date": "2025-08-21",
  "data": [
    {
      "date": "2025-08-15",
      "study_minutes": 120
    },
    {
      "date": "2025-08-16",
      "study_minutes": 90
    },
    {
      "date": "2025-08-17",
      "study_minutes": 0
    },
    {
      "date": "2025-08-18",
      "study_minutes": 150
    },
    {
      "date": "2025-08-19",
      "study_minutes": 180
    },
    {
      "date": "2025-08-20",
      "study_minutes": 210
    },
    {
      "date": "2025-08-21",
      "study_minutes": 270
    }
  ],
  "total_minutes": 1020,
  "daily_average": 145.7
}

```

---

## 3. 技術別学習時間サマリー

- **Method**: GET
- **URL**: `/api/reports/technology-summary`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Query Parameters**:

| Parameter | Type | Description |
| --- | --- | --- |
| period | string | `week`, `month`, `all` (デフォルト: `month`) |
| date | string | 基準日 YYYY-MM-DD (デフォルト: 今日) |

**Mock Response 200**:

```json
{
  "period": "month",
  "start_date": "2025-08-01",
  "end_date": "2025-08-31",
  "data": [
    {
      "technology_id": 3,
      "technology_name": "Laravel",
      "category_name": "フレームワーク",
      "total_minutes": 1250,
      "percentage": 45.5,
      "learning_contents_count": 2
    },
    {
      "technology_id": 4,
      "technology_name": "Vue.js",
      "category_name": "フレームワーク",
      "total_minutes": 980,
      "percentage": 35.6,
      "learning_contents_count": 1
    },
    {
      "technology_id": 1,
      "technology_name": "JavaScript",
      "category_name": "プログラミング言語",
      "total_minutes": 520,
      "percentage": 18.9,
      "learning_contents_count": 1
    }
  ],
  "total_minutes": 2750
}

```

---

## 4. 学習履歴取得

- **Method**: GET
- **URL**: `/api/reports/learning-history`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Query Parameters**:

| Parameter | Type | Description |
| --- | --- | --- |
| period | string | `week`, `month`, `all` (デフォルト: `week`) |
| content_id | integer | 学習内容ID（オプション） |
| page | integer | ページ番号（デフォルト: 1） |

**Mock Response 200**:

```json
{
  "data": [
    {
      "date": "2025-08-21",
      "sessions": [
        {
          "id": 10,
          "learning_content_title": "Laravel学習",
          "section_title": "データベース",
          "study_minutes": 90,
          "note": "データベース設計について学習した"
        },
        {
          "id": 9,
          "learning_content_title": "Laravel学習",
          "section_title": "ルーティング",
          "study_minutes": 60,
          "note": "RESTful APIの設計"
        }
      ],
      "daily_total_minutes": 150
    },
    {
      "date": "2025-08-20",
      "sessions": [
        {
          "id": 8,
          "learning_content_title": "Vue.js実践",
          "section_title": "Composition API",
          "study_minutes": 120,
          "note": "リアクティブシステムの理解"
        }
      ],
      "daily_total_minutes": 120
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 7,
    "total": 21
  },
  "summary": {
    "period_total_minutes": 1020,
    "period_average_minutes": 145.7
  }
}

```
