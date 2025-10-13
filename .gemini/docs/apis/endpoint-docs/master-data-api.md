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
- **Mock Response 200**:
    
    ```json
    [
        {
            "id": 1,
            "name": "Programming",
            "icon": "http://localhost:8000/assets/icons/technologies/programming-icon.png",
            "description": "プログラミング言語、フレームワーク、ライブラリ",
            "created_at": "2025-09-13 11:47:01",
            "updated_at": "2025-09-13 11:47:01"
        },
        {
            "id": 2,
            "name": "Infrastructure",
            "icon": "http://localhost:8000/assets/icons/technologies/infrastructure-icon.png",
            "description": "サーバー、ネットワーク、クラウド、コンテナ技術",
            "created_at": "2025-09-13 11:47:01",
            "updated_at": "2025-09-13 11:47:01"
        },
        {
            "id": 3,
            "name": "Service",
            "icon": "http://localhost:8000/assets/icons/technologies/service-icon.png",
            "description": "Webサービス、開発ツール、生産性向上ツール",
            "created_at": "2025-09-13 11:47:01",
            "updated_at": "2025-09-13 11:47:01"
        },
        {
            "id": 4,
            "name": "Development",
            "icon": "http://localhost:8000/assets/icons/technologies/development-icon.png",
            "description": "設計、開発手法、プロジェクト管理、実践的な開発",
            "created_at": "2025-09-13 11:47:01",
            "updated_at": "2025-09-13 11:47:01"
        },
        {
            "id": 5,
            "name": "AI",
            "icon": "http://localhost:8000/assets/icons/technologies/ai-icon.png",
            "description": "AI、機械学習、LLM、プロンプトエンジニアリング",
            "created_at": "2025-09-13 11:47:01",
            "updated_at": "2025-09-13 11:47:01"
        },
        {
            "id": 6,
            "name": "Other",
            "icon": "http://localhost:8000/assets/icons/technologies/other-icon.png",
            "description": "ビジネススキル、マインドセット、その他の学習",
            "created_at": "2025-09-13 11:47:01",
            "updated_at": "2025-09-13 11:47:01"
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
- **Mock Response 200（全件取得の例・一部抜粋）**:
    
    ```json
    [
        {
            "id": 1,
            "category_id": 1,
            "name": "Laravel",
            "icon": "http://localhost:8000/assets/icons/technologies/laravel-icon.png",
            "created_at": "2025-09-13 12:04:28",
            "updated_at": "2025-09-13 12:04:28",
            "category": {
                "id": 1,
                "name": "Programming",
                "icon": "http://localhost:8000/assets/icons/technologies/programming-icon.png",
                "description": "プログラミング言語、フレームワーク、ライブラリ",
                "created_at": "2025-09-13 11:47:01",
                "updated_at": "2025-09-13 11:47:01"
            }
        },
        {
            "id": 2,
            "category_id": 1,
            "name": "Vue.js",
            "icon": "http://localhost:8000/assets/icons/technologies/vue-icon.png",
            "created_at": "2025-09-13 12:04:28",
            "updated_at": "2025-09-13 12:04:28",
            "category": {
                "id": 1,
                "name": "Programming",
                "icon": "http://localhost:8000/assets/icons/technologies/programming-icon.png",
                "description": "プログラミング言語、フレームワーク、ライブラリ",
                "created_at": "2025-09-13 11:47:01",
                "updated_at": "2025-09-13 11:47:01"
            }
        },
        {
            "id": 3,
            "category_id": 1,
            "name": "React",
            "icon": "http://localhost:8000/assets/icons/technologies/react-icon.png",
            "created_at": "2025-09-13 12:04:28",
            "updated_at": "2025-09-13 12:04:28",
            "category": {
                "id": 1,
                "name": "Programming",
                "icon": "http://localhost:8000/assets/icons/technologies/programming-icon.png",
                "description": "プログラミング言語、フレームワーク、ライブラリ",
                "created_at": "2025-09-13 11:47:01",
                "updated_at": "2025-09-13 11:47:01"
            }
        },
        {
            "id": 4,
            "category_id": 1,
            "name": "PHP",
            "icon": "http://localhost:8000/assets/icons/technologies/php-icon.png",
            "created_at": "2025-09-13 12:04:28",
            "updated_at": "2025-09-13 12:04:28",
            "category": {
                "id": 1,
                "name": "Programming",
                "icon": "http://localhost:8000/assets/icons/technologies/programming-icon.png",
                "description": "プログラミング言語、フレームワーク、ライブラリ",
                "created_at": "2025-09-13 11:47:01",
                "updated_at": "2025-09-13 11:47:01"
            }
        },
        {
            "id": 5,
            "category_id": 1,
            "name": "JavaScript",
            "icon": "http://localhost:8000/assets/icons/technologies/javascript-icon.png",
            "created_at": "2025-09-13 12:04:28",
            "updated_at": "2025-09-13 12:04:28",
            "category": {
                "id": 1,
                "name": "Programming",
                "icon": "http://localhost:8000/assets/icons/technologies/programming-icon.png",
                "description": "プログラミング言語、フレームワーク、ライブラリ",
                "created_at": "2025-09-13 11:47:01",
                "updated_at": "2025-09-13 11:47:01"
            }
        },
        {
            "id": 6,
            "category_id": 1,
            "name": "TypeScript",
            "icon": "http://localhost:8000/assets/icons/technologies/typescript-icon.png",
            "created_at": "2025-09-13 12:04:28",
            "updated_at": "2025-09-13 12:04:28",
            "category": {
                "id": 1,
                "name": "Programming",
                "icon": "http://localhost:8000/assets/icons/technologies/programming-icon.png",
                "description": "プログラミング言語、フレームワーク、ライブラリ",
                "created_at": "2025-09-13 11:47:01",
                "updated_at": "2025-09-13 11:47:01"
            }
        },
        {
            "id": 7,
            "category_id": 1,
            "name": "Python",
            "icon": "http://localhost:8000/assets/icons/technologies/python-icon.png",
            "created_at": "2025-09-13 12:04:28",
            "updated_at": "2025-09-13 12:04:28",
            "category": {
                "id": 1,
                "name": "Programming",
                "icon": "http://localhost:8000/assets/icons/technologies/programming-icon.png",
                "description": "プログラミング言語、フレームワーク、ライブラリ",
                "created_at": "2025-09-13 11:47:01",
                "updated_at": "2025-09-13 11:47:01"
            }
        },
        {
            "id": 8,
            "category_id": 1,
            "name": "Ruby",
            "icon": "http://localhost:8000/assets/icons/technologies/ruby-icon.png",
            "created_at": "2025-09-13 12:04:28",
            "updated_at": "2025-09-13 12:04:28",
            "category": {
                "id": 1,
                "name": "Programming",
                "icon": "http://localhost:8000/assets/icons/technologies/programming-icon.png",
                "description": "プログラミング言語、フレームワーク、ライブラリ",
                "created_at": "2025-09-13 11:47:01",
                "updated_at": "2025-09-13 11:47:01"
            }
        },
        {
            "id": 9,
            "category_id": 1,
            "name": "Java",
            "icon": "http://localhost:8000/assets/icons/technologies/java-icon.png",
            "created_at": "2025-09-13 12:04:28",
            "updated_at": "2025-09-13 12:04:28",
            "category": {
                "id": 1,
                "name": "Programming",
                "icon": "http://localhost:8000/assets/icons/technologies/programming-icon.png",
                "description": "プログラミング言語、フレームワーク、ライブラリ",
                "created_at": "2025-09-13 11:47:01",
                "updated_at": "2025-09-13 11:47:01"
            }
        },
        {
            "id": 10,
            "category_id": 1,
            "name": "HTML",
            "icon": "http://localhost:8000/assets/icons/technologies/html-icon.png",
            "created_at": "2025-09-13 12:04:28",
            "updated_at": "2025-09-13 12:04:28",
            "category": {
                "id": 1,
                "name": "Programming",
                "icon": "http://localhost:8000/assets/icons/technologies/programming-icon.png",
                "description": "プログラミング言語、フレームワーク、ライブラリ",
                "created_at": "2025-09-13 11:47:01",
                "updated_at": "2025-09-13 11:47:01"
            }
        }
    ```
    
- **Mock Response 200（category_id=1でフィルタした例）**:
    
    ```json
    [
        {
            "id": 1,
            "category_id": 1,
            "name": "Laravel",
            "icon": "http://localhost:8000/assets/icons/technologies/laravel-icon.png",
            "created_at": "2025-09-13 12:04:28",
            "updated_at": "2025-09-13 12:04:28",
            "category": {
                "id": 1,
                "name": "Programming",
                "icon": "http://localhost:8000/assets/icons/technologies/programming-icon.png",
                "description": "プログラミング言語、フレームワーク、ライブラリ",
                "created_at": "2025-09-13 11:47:01",
                "updated_at": "2025-09-13 11:47:01"
            }
        },
        {
            "id": 2,
            "category_id": 1,
            "name": "Vue.js",
            "icon": "http://localhost:8000/assets/icons/technologies/vue-icon.png",
            "created_at": "2025-09-13 12:04:28",
            "updated_at": "2025-09-13 12:04:28",
            "category": {
                "id": 1,
                "name": "Programming",
                "icon": "http://localhost:8000/assets/icons/technologies/programming-icon.png",
                "description": "プログラミング言語、フレームワーク、ライブラリ",
                "created_at": "2025-09-13 11:47:01",
                "updated_at": "2025-09-13 11:47:01"
            }
        },
        {
            "id": 3,
            "category_id": 1,
            "name": "React",
            "icon": "http://localhost:8000/assets/icons/technologies/react-icon.png",
            "created_at": "2025-09-13 12:04:28",
            "updated_at": "2025-09-13 12:04:28",
            "category": {
                "id": 1,
                "name": "Programming",
                "icon": "http://localhost:8000/assets/icons/technologies/programming-icon.png",
                "description": "プログラミング言語、フレームワーク、ライブラリ",
                "created_at": "2025-09-13 11:47:01",
                "updated_at": "2025-09-13 11:47:01"
            }
        },
        {
            "id": 4,
            "category_id": 1,
            "name": "PHP",
            "icon": "http://localhost:8000/assets/icons/technologies/php-icon.png",
            "created_at": "2025-09-13 12:04:28",
            "updated_at": "2025-09-13 12:04:28",
            "category": {
                "id": 1,
                "name": "Programming",
                "icon": "http://localhost:8000/assets/icons/technologies/programming-icon.png",
                "description": "プログラミング言語、フレームワーク、ライブラリ",
                "created_at": "2025-09-13 11:47:01",
                "updated_at": "2025-09-13 11:47:01"
            }
        },
        {
            "id": 5,
            "category_id": 1,
            "name": "JavaScript",
            "icon": "http://localhost:8000/assets/icons/technologies/javascript-icon.png",
            "created_at": "2025-09-13 12:04:28",
            "updated_at": "2025-09-13 12:04:28",
            "category": {
                "id": 1,
                "name": "Programming",
                "icon": "http://localhost:8000/assets/icons/technologies/programming-icon.png",
                "description": "プログラミング言語、フレームワーク、ライブラリ",
                "created_at": "2025-09-13 11:47:01",
                "updated_at": "2025-09-13 11:47:01"
            }
        },
        {
            "id": 6,
            "category_id": 1,
            "name": "TypeScript",
            "icon": "http://localhost:8000/assets/icons/technologies/typescript-icon.png",
            "created_at": "2025-09-13 12:04:28",
            "updated_at": "2025-09-13 12:04:28",
            "category": {
                "id": 1,
                "name": "Programming",
                "icon": "http://localhost:8000/assets/icons/technologies/programming-icon.png",
                "description": "プログラミング言語、フレームワーク、ライブラリ",
                "created_at": "2025-09-13 11:47:01",
                "updated_at": "2025-09-13 11:47:01"
            }
        },
        {
            "id": 7,
            "category_id": 1,
            "name": "Python",
            "icon": "http://localhost:8000/assets/icons/technologies/python-icon.png",
            "created_at": "2025-09-13 12:04:28",
            "updated_at": "2025-09-13 12:04:28",
            "category": {
                "id": 1,
                "name": "Programming",
                "icon": "http://localhost:8000/assets/icons/technologies/programming-icon.png",
                "description": "プログラミング言語、フレームワーク、ライブラリ",
                "created_at": "2025-09-13 11:47:01",
                "updated_at": "2025-09-13 11:47:01"
            }
        },
        {
            "id": 8,
            "category_id": 1,
            "name": "Ruby",
            "icon": "http://localhost:8000/assets/icons/technologies/ruby-icon.png",
            "created_at": "2025-09-13 12:04:28",
            "updated_at": "2025-09-13 12:04:28",
            "category": {
                "id": 1,
                "name": "Programming",
                "icon": "http://localhost:8000/assets/icons/technologies/programming-icon.png",
                "description": "プログラミング言語、フレームワーク、ライブラリ",
                "created_at": "2025-09-13 11:47:01",
                "updated_at": "2025-09-13 11:47:01"
            }
        },
        {
            "id": 9,
            "category_id": 1,
            "name": "Java",
            "icon": "http://localhost:8000/assets/icons/technologies/java-icon.png",
            "created_at": "2025-09-13 12:04:28",
            "updated_at": "2025-09-13 12:04:28",
            "category": {
                "id": 1,
                "name": "Programming",
                "icon": "http://localhost:8000/assets/icons/technologies/programming-icon.png",
                "description": "プログラミング言語、フレームワーク、ライブラリ",
                "created_at": "2025-09-13 11:47:01",
                "updated_at": "2025-09-13 11:47:01"
            }
        },
        {
            "id": 10,
            "category_id": 1,
            "name": "HTML",
            "icon": "http://localhost:8000/assets/icons/technologies/html-icon.png",
            "created_at": "2025-09-13 12:04:28",
            "updated_at": "2025-09-13 12:04:28",
            "category": {
                "id": 1,
                "name": "Programming",
                "icon": "http://localhost:8000/assets/icons/technologies/programming-icon.png",
                "description": "プログラミング言語、フレームワーク、ライブラリ",
                "created_at": "2025-09-13 11:47:01",
                "updated_at": "2025-09-13 11:47:01"
            }
        },
        {
            "id": 11,
            "category_id": 1,
            "name": "CSS",
            "icon": "http://localhost:8000/assets/icons/technologies/css-icon.png",
            "created_at": "2025-09-13 12:04:28",
            "updated_at": "2025-09-13 12:04:28",
            "category": {
                "id": 1,
                "name": "Programming",
                "icon": "http://localhost:8000/assets/icons/technologies/programming-icon.png",
                "description": "プログラミング言語、フレームワーク、ライブラリ",
                "created_at": "2025-09-13 11:47:01",
                "updated_at": "2025-09-13 11:47:01"
            }
        },
        {
            "id": 12,
            "category_id": 1,
            "name": "Next.js",
            "icon": "http://localhost:8000/assets/icons/technologies/next-js-icon.png",
            "created_at": "2025-09-13 12:04:28",
            "updated_at": "2025-09-13 12:04:28",
            "category": {
                "id": 1,
                "name": "Programming",
                "icon": "http://localhost:8000/assets/icons/technologies/programming-icon.png",
                "description": "プログラミング言語、フレームワーク、ライブラリ",
                "created_at": "2025-09-13 11:47:01",
                "updated_at": "2025-09-13 11:47:01"
            }
        },
        {
            "id": 13,
            "category_id": 1,
            "name": "TailwindCSS",
            "icon": "http://localhost:8000/assets/icons/technologies/tailwindcss-icon.png",
            "created_at": "2025-09-13 12:04:28",
            "updated_at": "2025-09-13 12:04:28",
            "category": {
                "id": 1,
                "name": "Programming",
                "icon": "http://localhost:8000/assets/icons/technologies/programming-icon.png",
                "description": "プログラミング言語、フレームワーク、ライブラリ",
                "created_at": "2025-09-13 11:47:01",
                "updated_at": "2025-09-13 11:47:01"
            }
        }
    ]
    ```
    

---

## 備考

- `icon`フィールドの値は、実際の実装時には適切な画像URLまたはBase64エンコードされたデータを返す必要があります
- カテゴリー名は英語表記（Programming, Infrastructure等）で統一されています
- タイムスタンプはISO 8601形式で返されます
- 技術一覧APIでは、関連するカテゴリー情報も含めて返されます

---
