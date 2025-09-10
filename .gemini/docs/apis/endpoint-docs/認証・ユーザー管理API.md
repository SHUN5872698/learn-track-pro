## 相互リンク

[認証・ユーザー関連API](https://www.notion.so/API-2569d86c12e8804ba4bec2f497faeb5b?pvs=21) 

.gemini/docs/apis/endpoint-docs/認証・ユーザー管理API.md

---

## RESTful エンドポイント

```bash
# CSRF保護
GET    /sanctum/csrf-cookie

# 基本認証
POST   /api/register
POST   /api/login
POST   /api/logout
GET    /api/user

# ユーザー情報管理
PUT    /api/user/profile
PUT    /api/user/password

# パスワードリセット
POST   /api/forgot-password
POST   /api/reset-password

```

## 環境変数設定

```
base_url: <http://localhost:8000>
frontend_url: <http://localhost:5173>
XSRF_TOKEN: (自動設定)
is_authenticated: false

```

## 共通設定（全エンドポイント - XSRF-Token取得以外）

**Pre-processor**:

```jsx
const xsrfToken = pm.environment.get('XSRF_TOKEN');
if (xsrfToken) {
    pm.request.headers.upsert({
        key: 'X-XSRF-TOKEN',
        value: xsrfToken
    });
    console.log("✅ X-XSRF-TOKEN自動設定");
}

```

**Post-processor**:

```jsx
const newXsrfToken = pm.cookies.get('XSRF-TOKEN');
if (newXsrfToken) {
    const currentToken = pm.environment.get('XSRF_TOKEN');
    if (newXsrfToken !== currentToken) {
        pm.environment.set('XSRF_TOKEN', newXsrfToken);
        console.log("✅ XSRF-TOKEN自動更新");
    }
}

```

---

## 1. CSRF Cookie取得

- **Method**: GET
- **URL**: `/sanctum/csrf-cookie`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |

**Pre-processor**: なし（共通設定適用外）

**Post-processor**:

```jsx
const xsrfToken = pm.cookies.get('XSRF-TOKEN');
if (xsrfToken) {
    pm.environment.set('XSRF_TOKEN', xsrfToken);
    console.log("✅ XSRF-TOKEN取得成功");
}

```

**Mock Response**: 204 No Content

---

## 2. ユーザー登録

- **Method**: POST
- **URL**: `/api/register`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |

**Request Body (JSON)**:

```json
{
    "name": "田中太郎",
    "email": "tanaka@example.com",
    "password": "password123",
    "password_confirmation": "password123"
}

```

**Mock Response 201**:

```json
{
    "id": 1,
    "name": "田中太郎",
    "email": "tanaka@example.com",
    "created_at": "2025-08-21T10:00:00.000000Z",
    "updated_at": "2025-08-21T10:00:00.000000Z",
    "message": "ユーザー登録が完了しました。"
}

```

**Mock Response 422**:

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "email": ["このメールアドレスは既に使用されています。"],
        "password": ["パスワードは8文字以上である必要があります。"]
    }
}

```

---

## 3. ログイン

- **Method**: POST
- **URL**: `/fortify/login`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |

**Request Body (JSON)**:

```json
{
    "email": "tanaka@example.com",
    "password": "password123"
}

```

**Post-processor（個別追加）**:

```jsx
if (pm.response.code === 200) {
    pm.environment.set('is_authenticated', 'true');
    console.log("✅ ログイン成功");
}

```

**Mock Response 200**:

```json
{
    "id": 1,
    "name": "田中太郎",
    "email": "tanaka@example.com",
    "created_at": "2025-08-21T10:00:00.000000Z",
    "updated_at": "2025-08-21T10:00:00.000000Z",
    "message": "ログインしました。"
}

```

**Mock Response 401**:

```json
{
    "message": "認証情報が正しくありません。"
}

```

---

## 4. ログアウト

- **Method**: POST
- **URL**: `/fortify/logout`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Post-processor（個別追加）**:

```jsx
if (pm.response.code === 204) {
    pm.environment.set('is_authenticated', 'false');
    console.log("✅ ログアウト成功");
}

```

**Mock Response**: 204 No Content

---

## 5. ユーザー情報取得

- **Method**: GET
- **URL**: `/api/user`

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
    "name": "田中太郎",
    "email": "tanaka@example.com",
    "created_at": "2025-08-21T10:00:00.000000Z",
    "updated_at": "2025-08-21T10:00:00.000000Z"
}

```

**Mock Response 401**:

```json
{
    "message": "Unauthenticated."
}

```

---

## 6. プロフィール更新

- **Method**: PUT
- **URL**: `/api/user/profile`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Request Body (JSON)**:

```json
{
    "name": "田中次郎",
    "email": "tanaka.new@example.com"
}

```

**Mock Response 200**:

```json
{
    "id": 1,
    "name": "田中次郎",
    "email": "tanaka.new@example.com",
    "created_at": "2025-08-21T10:00:00.000000Z",
    "updated_at": "2025-08-21T11:00:00.000000Z",
    "message": "プロフィールを更新しました。"
}

```

**Mock Response 422**:

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "email": ["このメールアドレスは既に使用されています。"]
    }
}

```

---

## 7. パスワード変更

- **Method**: PUT
- **URL**: `/api/user/password`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |

**Request Body (JSON)**:

```json
{
    "current_password": "password123",
    "password": "newpassword456",
    "password_confirmation": "newpassword456"
}

```

**Mock Response 200**:

```json
{
    "message": "パスワードを変更しました。"
}

```

**Mock Response 422**:

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "current_password": ["現在のパスワードが正しくありません。"],
        "password": ["パスワードは8文字以上である必要があります。"]
    }
}

```

---

## 8. パスワードリセット要求

- **Method**: POST
- **URL**: `/api/forgot-password`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |

**Request Body (JSON)**:

```json
{
    "email": "tanaka@example.com"
}

```

**Mock Response 200**:

```json
{
    "message": "パスワードリセット用のメールを送信しました。"
}

```

**Mock Response 422**:

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "email": ["このメールアドレスは登録されていません。"]
    }
}

```

---

## 9. パスワードリセット実行

- **Method**: POST
- **URL**: `/api/reset-password`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |

**Request Body (JSON)**:

```json
{
    "token": "sample_reset_token",
    "email": "tanaka@example.com",
    "password": "newpassword456",
    "password_confirmation": "newpassword456"
}

```

**Mock Response 200**:

```json
{
    "message": "パスワードをリセットしました。"
}

```

**Mock Response 422**:

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "token": ["トークンが無効です。"],
        "password": ["パスワードは8文字以上である必要があります。"]
    }
}

```
