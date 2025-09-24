## 相互リンク

[マスターデータAPI](https://www.notion.so/API-2689d86c12e880c9a42bd5e3a28deca4?pvs=21) 

.gemini/docs/apis/endpoint-docs/マスターデータAPI.md

---

## RESTful エンドポイント

```bash
GET    /api/categories                        # カテゴリー一覧
GET    /api/technologies                      # 技術一覧
GET    /api/technologies?category_id={id}     # カテゴリー別技術一覧

```

---

## 1. カテゴリー一覧取得

- **Method**: GET
- **URL**: `/api/categories`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

### **Mock Response 200**:

```json
[
  {
    "id": 1,
    "name": "Programming",
    "icon": "...",
    "description": "プログラミング言語、フレームワーク、ライブラリ",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z"
  },
  {
    "id": 2,
    "name": "Infrastructure",
    "icon": "...",
    "description": "サーバー、ネットワーク、クラウド、コンテナ技術",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z"
  },
  {
    "id": 3,
    "name": "Service",
    "icon": "...",
    "description": "Webサービス、開発ツール、生産性向上ツール",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z"
  },
  {
    "id": 4,
    "name": "Development",
    "icon": "...",
    "description": "設計、開発手法、プロジェクト管理、実践的な開発",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z"
  },
  {
    "id": 5,
    "name": "AI",
    "icon": "...",
    "description": "AI、機械学習、LLM、プロンプトエンジニアリング",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z"
  },
  {
    "id": 6,
    "name": "Other",
    "icon": "...",
    "description": "ビジネススキル、マインドセット、その他の学習",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z"
  }
]

```

---

## 2. 技術一覧取得

- **Method**: GET
- **URL**: `/api/technologies`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Query Parameters（オプション）**:

| Parameter | Type | Description |
| --- | --- | --- |
| category_id | integer | カテゴリーIDでフィルタ |

**Mock Response 200（全件取得の例・一部抜粋）**:

```json
[
  {
    "id": 1,
    "category_id": 1,
    "name": "Laravel",
    "icon": "/src/assets/icons/technologies/laravel-icon.png",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "category": {
      "id": 1,
      "name": "Programming"
    }
  },
  {
    "id": 2,
    "category_id": 1,
    "name": "Vue.js",
    "icon": "/src/assets/icons/technologies/vue-icon.png",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "category": {
      "id": 1,
      "name": "Programming"
    }
  },
  {
    "id": 3,
    "category_id": 1,
    "name": "React",
    "icon": "/src/assets/icons/technologies/react-icon.png",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "category": {
      "id": 1,
      "name": "Programming"
    }
  },
  {
    "id": 18,
    "category_id": 2,
    "name": "Docker",
    "icon": "/src/assets/icons/technologies/docker-icon.png",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "category": {
      "id": 2,
      "name": "Infrastructure"
    }
  },
  {
    "id": 19,
    "category_id": 2,
    "name": "AWS",
    "icon": "/src/assets/icons/technologies/aws-icon.png",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "category": {
      "id": 2,
      "name": "Infrastructure"
    }
  },
  {
    "id": 21,
    "category_id": 3,
    "name": "Git",
    "icon": "/src/assets/icons/technologies/git-icon.png",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "category": {
      "id": 3,
      "name": "Service"
    }
  }
]

```

**Mock Response 200（category_id=1でフィルタした例）**:

```json
[
  {
    "id": 1,
    "category_id": 1,
    "name": "Laravel",
    "icon": "/src/assets/icons/technologies/laravel-icon.png",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "category": {
      "id": 1,
      "name": "Programming"
    }
  },
  {
    "id": 2,
    "category_id": 1,
    "name": "Vue.js",
    "icon": "/src/assets/icons/technologies/vue-icon.png",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "category": {
      "id": 1,
      "name": "Programming"
    }
  },
  {
    "id": 3,
    "category_id": 1,
    "name": "React",
    "icon": "/src/assets/icons/technologies/react-icon.png",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "category": {
      "id": 1,
      "name": "Programming"
    }
  },
  {
    "id": 4,
    "category_id": 1,
    "name": "PHP",
    "icon": "/src/assets/icons/technologies/php-icon.png",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "category": {
      "id": 1,
      "name": "Programming"
    }
  },
  {
    "id": 5,
    "category_id": 1,
    "name": "JavaScript",
    "icon": "/src/assets/icons/technologies/javascript-icon.png",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "category": {
      "id": 1,
      "name": "Programming"
    }
  },
  {
    "id": 6,
    "category_id": 1,
    "name": "TypeScript",
    "icon": "/src/assets/icons/technologies/typescript-icon.png",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "category": {
      "id": 1,
      "name": "Programming"
    }
  },
  {
    "id": 7,
    "category_id": 1,
    "name": "Python",
    "icon": "/src/assets/icons/technologies/python-icon.png",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "category": {
      "id": 1,
      "name": "Programming"
    }
  },
  {
    "id": 8,
    "category_id": 1,
    "name": "Ruby",
    "icon": "/src/assets/icons/technologies/ruby-icon.png",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "category": {
      "id": 1,
      "name": "Programming"
    }
  },
  {
    "id": 9,
    "category_id": 1,
    "name": "Java",
    "icon": "/src/assets/icons/technologies/java-icon.png",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "category": {
      "id": 1,
      "name": "Programming"
    }
  },
  {
    "id": 10,
    "category_id": 1,
    "name": "HTML",
    "icon": "/src/assets/icons/technologies/html-icon.png",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "category": {
      "id": 1,
      "name": "Programming"
    }
  },
  {
    "id": 11,
    "category_id": 1,
    "name": "CSS",
    "icon": "/src/assets/icons/technologies/css-icon.png",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "category": {
      "id": 1,
      "name": "Programming"
    }
  },
  {
    "id": 12,
    "category_id": 1,
    "name": "Next.js",
    "icon": "/src/assets/icons/technologies/next-js-icon.png",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "category": {
      "id": 1,
      "name": "Programming"
    }
  },
  {
    "id": 13,
    "category_id": 1,
    "name": "TailwindCSS",
    "icon": "/src/assets/icons/technologies/tailwindcss-icon.png",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "category": {
      "id": 1,
      "name": "Programming"
    }
  }
]

```

## 備考

- `icon`フィールドの値は、実際の実装時には適切な画像URLまたはBase64エンコードされたデータを返す必要があります
- カテゴリー名は英語表記（Programming, Infrastructure等）で統一されています
- タイムスタンプはISO 8601形式で返されます
- 技術一覧APIでは、関連するカテゴリー情報も含めて返されます
