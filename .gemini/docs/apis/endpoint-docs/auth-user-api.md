## RESTful エンドポイント

```bash
# CSRF保護
GET    /sanctum/csrf-cookie

# 基本認証（Fortify）
POST   /fortify/register
POST   /fortify/login
POST   /fortify/logout
POST   /fortify/forgot-password
POST   /fortify/reset-password

# ユーザー情報管理（自前API）
GET    /api/user
PUT    /api/user/profile
```

---

## 環境変数設定

```
base_url: <http://localhost:8000>
frontend_url: <http://localhost:5173>
XSRF_TOKEN: (自動設定)
is_authenticated: false

```

---

## 共通設定（全エンドポイント - XSRF-Token取得以外）

- **Pre-processor**:
    
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
    
- **Post-processor**:
    
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

- **Post-processor**:
    
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
- **URL**: `/fortify/register`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
- **Request Body (JSON)**:
    
    ```json
    {
        "name": "田中 太郎",
        "email": "tanaka@example.com",
        "password": "password",
        "password_confirmation": "password"
    }
    
    ```
    
- **Mock Response 201**:
    
    ```json
    {
        "id": 1,
        "name": "田中 太郎",
        "email": "tanaka@example.com",
        "email_verified_at": "tanaka@example.com",
        "avatar": "https://avatars.githubusercontent.com/u/98958328",
        "created_at": "2025-08-21T10:00:00.000000Z",
        "updated_at": "2025-08-21T10:00:00.000000Z",
    }
    ```
    
- **Mock Response 422**:メールアドレスの重複
    
    ```json
    {
        "message": "The given data was invalid.",
        "errors": {
            "email": ["このメールアドレスは既に使用されています。"],
            "password": ["パスワードは8文字以上である必要があります。"]
        }
    }
    
    ```
    
- **Mock Response 422**:未入力
    
    ```json
    {
        "message": "名前は必須項目です。 (その他、2エラーあり)",
        "errors": {
            "name": [
                "名前は必須項目です。"
            ],
            "email": [
                "メールアドレスは必須項目です。"
            ],
            "password": [
                "パスワードは必須項目です。"
            ]
        }
    }
    ```
    
- **Mock Response 422**:バリデーションエラー
    
    ```json
    {
        "message": "名前の文字数は、50文字以下である必要があります。 (その他、2エラーあり)",
        "errors": {
            "name": [
                "名前の文字数は、50文字以下である必要があります。"
            ],
            "email": [
                "メールアドレスは、有効なメールアドレス形式で指定してください。"
            ],
            "password": [
                "パスワードの文字数は、255文字以下である必要があります。"
            ]
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
- **Request Body (JSON)**:
    
    ```json
    {
        "email": "tanaka@example.com",
        "password": "password123"
    }
    
    ```
    
- **Post-processor（個別追加）**:
    
    ```jsx
    if (pm.response.code === 200) {
        pm.environment.set('is_authenticated', 'true');
        console.log("✅ ログイン成功");
    }
    ```
    
- **Mock Response 200**:
    
    ```json
    {
        "two_factor": false
    }
    ```
    
- **Mock Response 302**:
    
    ```html
    <!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="refresh" content="0;url='http://localhost:8000'" />
    
        <title>Redirecting to http://localhost:8000</title>
    </head>
    
    <body>
        Redirecting to <a href="http://localhost:8000">http://localhost:8000</a>.
    </body>
    
    </html>
    ```
    
- **Mock Response 422**:
    
    ```json
    {
        "message": "認証に失敗しました。",
        "errors": {
            "email": [
                "認証に失敗しました。"
            ]
        }
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
- **Post-processor（個別追加）**:
    
    ```jsx
    if (pm.response.code === 204) {
        pm.environment.set('is_authenticated', 'false');
        console.log("✅ ログアウト成功");
    }
    
    ```
    
- **Mock Response**: 204 No Content
- **Mock Response 419**:
    
    ```json
    {
        "message": "Unauthenticated."
    }
    ```
    

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
- **Mock Response 200**:
    
    ```json
    {
        "id": 26,
        "name": "田中 太郎",
        "avatar": null,
        "email": "tanaka@example.com",
        "email_verified_at": null,
        "two_factor_secret": null,
        "two_factor_recovery_codes": null,
        "two_factor_confirmed_at": null,
        "created_at": "2025-09-23 22:49:50",
        "updated_at": "2025-09-23 22:49:50",
        "has_avatar": false,
        "initials": "田中"
    }
    ```
    
- **Mock Response 401**:
    
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
- **Request Body (JSON)**:
    
    ```json
    {
        "name": "田中 次郎",
        "email": "tanaka.new@example.com"
    }
    
    ```
    
- **Mock Response 200**:
    
    ```json
    {
        "user": {
            "id": 26,
            "name": "田中 次郎",
            "avatar": null,
            "email": "tanaka.new@example.com",
            "email_verified_at": null,
            "two_factor_secret": null,
            "two_factor_recovery_codes": null,
            "two_factor_confirmed_at": null,
            "created_at": "2025-09-23 22:49:50",
            "updated_at": "2025-09-23 22:58:27",
            "has_avatar": false,
            "initials": "田中"
        },
        "message": "プロフィールを更新しました"
    }
    ```
    
- **Mock Response 422**:
    
    ```json
    {
        "message": "The given data was invalid.",
        "errors": {
            "email": ["このメールアドレスは既に使用されています。"]
        }
    }
    
    ```
    

---

## ~~7. パスワード変更~~

- **Method**: PUT
- **URL**: `/api/user/password`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
| Referer | {{frontend_url}} |
- **Request Body (JSON)**:
    
    ```json
    {
        "current_password": "password123",
        "password": "newpassword456",
        "password_confirmation": "newpassword456"
    }
    
    ```
    
- **Mock Response 200**:
    
    ```json
    {
        "message": "パスワードを変更しました。"
    }
    
    ```
    
- **Mock Response 422**:
    
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
- **URL**: `/fortify/forgot-password`

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
- **Request Body (JSON)**:
    
    ```json
    {
        "email": "tanaka@example.com"
    }
    
    ```
    
- **Mock Response 200**:
    
    ```json
    {
        "message": "パスワードリセット用のメールを送信しました。"
    }
    
    ```
    
- **Mock Response 302**:ログイン中（guest middlewareによるリダイレクト）
    
    ```json
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="refresh" content="0;url='http://localhost:8000'" />
    
            <title>Redirecting to http: //localhost:8000</title>
        </head>
        <body>
            Redirecting to <a href="http://localhost:8000">http: //localhost:8000</a>.
        </body>
    </html>
    ```
    
- **Mock Response 422**:
    
    ```json
    {
        "message": "このメールアドレスに一致するユーザーがいません。",
        "errors": {
            "email": [
                "このメールアドレスに一致するユーザーがいません。"
            ]
        }
    }
    ```
    

---

## 9. パスワードリセット実行

- **Method**: POST
- **URL**: `/fortify/reset-password`

<aside>
⚠️

**トークンの取得方法**

- エンドポイント8（`/fortify/forgot-password`）のレスポンスには**トークンが含まれません**。
- これはセキュリティ上の意図的な設計です。トークンはメール内のURLにのみ含まれます。

**テスト手順**

1. エンドポイント8でメール送信
2. 受信メールのリンクからトークンをコピー
3. 下記のRequest Bodyの`token`フィールドに貼り付けて実行

**メール内のURL形式**

- http://localhost:5173/reset-password/{token}?email={メールアドレス}

**例**

- http://localhost:5173/reset-password/abc123def456ghi789?email=tanaka@example.com ←`abc123def456ghi789`部分をコピー
</aside>

**Headers**:

| Key | Value |
| --- | --- |
| Accept | application/json |
| Content-Type | application/json |
- **Request Body (JSON)**:
    
    ```json
    {
        "token": "{token}",
        "email": "tanaka@example.com",
        "password": "newpassword456",
        "password_confirmation": "newpassword456"
    }
    
    ```
    
- **Mock Response 200**:
    
    ```json
    {
        "message": "パスワードが再設定されました。"
    }
    ```
    
- **Mock Response 302**:ログイン中（guest middlewareによるリダイレクト）
    
    ```json
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="refresh" content="0;url='http://localhost:8000'" />
    
            <title>Redirecting to http: //localhost:8000</title>
        </head>
        <body>
            Redirecting to <a href="http://localhost:8000">http: //localhost:8000</a>.
        </body>
    </html>
    ```
    
- **Mock Response 422**:
    
    ```json
    // 未登録
    {
        "message": "このメールアドレスに一致するユーザーがいません。",
        "errors": {
            "email": [
                "このメールアドレスに一致するユーザーがいません。"
            ]
        }
    }
    
    // バリデーションエラー
    {
        "message": "tokenは必須項目です。 (その他、2エラーあり)",
        "errors": {
            "token": [
                "tokenは必須項目です。"
            ],
            "email": [
                "メールアドレスは必須項目です。"
            ],
            "password": [
                "パスワードは必須項目です。"
            ]
        }
    }
    
    // トークンエラー
    {
        "message": "このパスワード再設定トークンは無効です。",
        "errors": {
            "email": [
                "このパスワード再設定トークンは無効です。"
            ]
        }
    }
    
    ```
    

---
