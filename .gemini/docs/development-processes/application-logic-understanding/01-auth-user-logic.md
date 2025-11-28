## Backend理解（Controller→Model/Action）

### 概要

認証機能はLaravel Fortifyを採用し、ユーザー情報管理は自前APIで実装。

**主要ファイル**:

```markdown
### Controller
@app/Http/Controllers/UserController.php
### Action
@app/Actions/Fortify/CreateNewUser.php
@app/Actions/Fortify/ResetUserPassword.php
### Request
@app/Http/Requests/User/ProfileRequest.php
### Model
@app/Models/User.php
### Route
@routes/api.php
### Provider
@app/Providers/FortifyServiceProvider.php
```

### 質問1: Laravel Fortifyと自前APIの使い分け

プロンプト

```markdown
### 質問1: Laravel Fortifyと自前APIの使い分け
認証機能の実装について教えてください。
- Laravel Fortifyが担当する機能は何ですか？（/fortify/* エンドポイント）
- 自前APIが担当する機能は何ですか？（/api/user/* エンドポイント）
- なぜこのような使い分けにしたのですか？
- FortifyServiceProvider.phpではどのような設定をしていますか？
```

### Laravel Fortifyの担当範囲

- POST /fortify/register：ユーザー登録
- POST /fortify/login：ログイン
- POST /fortify/logout：ログアウト
- POST /fortify/forgot-password：パスワードリセット要求
- POST /fortify/reset-password：パスワードリセット実行

### 自前APIの担当範囲

- GET /api/user：認証済みユーザー情報取得（has_avatar, initials などのカスタムフィールド付与）
- PUT /api/user/profile：プロフィール更新（ProfileRequestバリデーション後、直接Model更新）

### なぜこの使い分けか

**判断理由**:

1. セキュリティと堅牢性：認証の根幹部分は実績のあるFortifyに任せる
2. 柔軟性：カスタムフィールド（has_avatar, initials）はFortifyでサポート外のため自前実装
3. パフォーマンス：Fortifyと独自カラムを分けると二重SQL発行になるため、UserControllerで一括更新

### FortifyServiceProviderの設定

- CreateNewUser, ResetUserPassword などのアクションクラスをバインド
- ログイン試行のレート制限設定（ブルートフォースアタック対策）

### 私の理解

- 認証の基本機能はFortify、カスタムフィールド（has_avatar, initials）を含むユーザー情報取得は自前API（UserController）に分離
- UserController.phpの`profile()`は、Fortifyとは独立した実装でProfileRequestバリデーション後に直接Model更新（二重SQL発行を回避）

### 質問2: UserControllerの実装

プロンプト

```markdown
### 質問2: UserControllerの実装
UserController.phpの実装を教えてください。
- me()メソッドはどのように認証済みユーザーを取得していますか？
- profile()メソッドのバリデーションとデータ更新の流れは？
- なぜServiceレイヤーを使わず、Controller内で直接Modelを操作していますか？
- レスポンスに含まれる has_avatar と initials フィールドはどのように生成されますか？
```

### me()メソッドの実装

- `$request->user()`で認証済みユーザーを取得
- `auth:sanctum`ミドルウェアがユーザーインスタンスを`$request`にバインド済み
- JSON形式でユーザー情報を返却

### profile()メソッドの実装

1. ProfileRequestでバリデーション自動実行（name, email）
2. `$user->update($request->validated())`で直接Model更新
3. 更新後のユーザー情報と成功メッセージを返却

### なぜServiceレイヤーを使わないのか

**判断理由**:

1. シンプルなデータ取得・更新のみ
2. 複雑なビジネスロジックが存在しない
3. 開発効率とコードのシンプルさを優先

### has_avatar, initialsの生成方法

- User.phpモデルの`$appends = ['has_avatar', 'initials']`で自動付与
- `getHasAvatarAttribute()`: `!empty($this->avatar)`でブール値を返却
- `getInitialsAttribute()`: 名前から動的にイニシャル生成（日本語は2文字、英語は頭文字）

### 私の理解

- `me()`は`$request->user()`でシンプルに実装。ページリロード時のPinia状態不整合はrouter.beforeEachの`fetchUser()`で解決済み
- `profile()`はFortifyと独立した実装でProfileRequestバリデーション後に直接Model更新（二重SQL発行を回避）
- Serviceレイヤーは現状不要だが、パスワードリセット等の複雑な処理を追加する際は導入を検討
- `has_avatar`, `initials`はModelアクセサで動的生成され、$appendsによりJSONレスポンスに自動付与

### 質問3: CreateNewUserアクション

プロンプト

```markdown
### 質問3: CreateNewUserアクション
app/Actions/Fortify/CreateNewUser.phpの実装を教えてください。
- create()メソッドのバリデーションルールは？
- パスワードのハッシュ化はどのタイミングで行われますか？
- PasswordValidationRulesトレイトの役割は？
- なぜControllerではなくActionクラスなのですか？
```

### バリデーションルール

- name: required, string, max:50
- email: required, string, email, max:255, unique:users
- password: required, string, min:8, confirmed（PasswordValidationRulesトレイトで定義）

### パスワードハッシュ化

- User::create()実行時に`Hash::make()`でハッシュ化
- Userモデル保存直前に実行

### PasswordValidationRulesトレイト

- パスワードの複雑性ルールを定義
- 複数のActionクラス（CreateNewUser, ResetUserPassword等）で共通利用

### なぜActionクラスか

**判断理由**:

1. Laravel Fortifyのアーキテクチャに準拠
2. 認証ロジックをControllerから分離し再利用性向上
3. テスタビリティの向上

### 私の理解

- バリデーションルールは実装時に確認済み。手動テスト時にパスワードバリデーション漏れからPasswordValidationRulesトレイトの存在を認識
- Actionクラスの責務分離はドメイン駆動設計の学習経験から理解。今後認証機能追加時はファイルとロジックの責務を確認する意識が必要

### 質問4: ルーティングとミドルウェア

プロンプト

```markdown
### 質問4: ルーティングとミドルウェア
routes/api.phpでの認証関連ルーティングを教えてください。
- /api/user と /api/user/profile にはどのミドルウェアが適用されていますか？
- auth:sanctum ミドルウェアの役割は？
- CSRF保護とSanctumの関係は？
```

### 適用されているミドルウェア

- `/api/user` (GET) と `/api/user/profile` (PUT) には `auth:sanctum` ミドルウェアが適用
- `Route::middleware('auth:sanctum')->group()` のブロック内に定義
- マスターデータ（categories, technologies）を除く全APIルートが対象

### auth:sanctum ミドルウェアの役割

1. **認証情報の検証**: セッションクッキーまたはAPIトークンの有効性を確認
2. **ユーザー特定**: 認証成功時、`$request->user()` でユーザー情報を利用可能にする
3. **未認証の拒否**: 認証情報が無効な場合、401 Unauthorized レスポンスを返却

### CSRF保護とSanctumの関係

**SPA認証（セッションベース）**:

- GET /sanctum/csrf-cookie でCSRFトークンを取得
- POST/PUT/DELETEリクエスト時、セッションクッキーとCSRFトークンの両方で検証
- ブラウザが自動送信するクッキーと、JavaScriptで設定するヘッダーの組み合わせで正当性を確認

**APIトークン認証（ステートレス）**:

- Authorization ヘッダーにAPIトークンを含める場合、CSRF保護は不要
- トークン自体が認証・認可の役割を果たす

### 私の理解

- マスターデータを除く全APIルートに`auth:sanctum`を適用。FortifyとSanctumの役割分担（認証ロジック vs セッション管理）は理解
- CSRF保護はSPA認証時のみ必要。セッションクッキー（自動送信）とCSRFトークン（手動送信）の組み合わせで正当性を検証する仕組み

### 面接で説明する際の30秒テンプレート

```markdown
# **CORS vs CSRF**:
CORSはブラウザがレスポンスの読み取りを制限する仕組み。
CSRFはサーバーがリクエストの正当性を検証する仕組み。

CORSでは単純なPOSTを止められないため、
CSRFトークンで「本当にユーザーが意図したリクエストか」を確認します。

# **なぜログイン前にCSRFクッキーを取得？**:
サーバーがトークンを生成してブラウザに渡すため。
次のリクエストで、ブラウザはクッキー（自動）とヘッダー（手動）で
同じトークンを送ります。両方が一致すれば正規サイトからのリクエストと判断。
```

### まとめ

プロンプト

```markdown
## 理解したいこと（Why）
- なぜLaravel Fortifyを採用したのか？
- なぜ一部の機能は自前APIにしたのか？
- Sanctumのセッション認証の仕組みは？
```

### 私の理解

- **Fortify採用の理由**: シンプルな認証で十分と判断。ただしJWT認証からの切替とLaravel 11→12移行時のミドルウェア設定変更（Kernel.php廃止等）で苦労
- **自前API実装の理由**: ポートフォリオ開発で品質重視のため、責務の分離と再利用性を検討し独自機能は自前APIで実装
- **Sanctumのセッション認証**: FortifyとSanctumの役割分担は理解。ただし口頭で詳細を即座に説明するには言語化の練習が必要

### 理解度の現状（Notion AI評価）

- **知識**: ✅ 十分（ドキュメント化できている）
- **理解**: ✅ 良好（Whyを明記している）
- **言語化**: ⚠️ 要強化（口頭で即座に説明する練習が不足）

### 面接対策の方針

1. **3段階説明法**: 1分版（エレベーターピッチ）、3分版（技術面接）、10分版（深掘り対応）で練習
2. **キーワード暗記カード**: FortifyとSanctumの役割分担、なぜセッション認証か、Laravel 11→12の変更点を即答
3. **図を描きながら説明**: 認証フロー（CSRF Cookie取得→ログイン→セッション確立→ユーザー情報取得）を視覚化

**課題**: 「言語化の練習不足」→ 声に出して説明する練習を繰り返す

- **詳細サンプル**（面接練習用）
    
    **1分版**（エレベーターピッチ）:
    
    ```
    FortifyとSanctumを組み合わせたSPA認証を実装しました。
    Fortifyが認証ロジック、Sanctumがセッション管理を担当します。
    JWT認証ではなくセッション認証を選んだ理由は、
    Laravelの成熟したCSRF保護を活用でき、開発効率が高いためです。
    ```
    
    **3分版**（技術面接）:
    
    ```
    Laravel FortifyとSanctumでSPA認証を実装しました。
    
    【構成】
    - Fortify: /fortify/login等の認証エンドポイント提供
    - Sanctum: statefulApiミドルウェアでセッション管理
    - router.beforeEach: ページリロード時にfetchUser()で状態復元
    
    【技術選択の理由】
    JWT認証ではなくセッション認証を選びました。
    理由は3つあります：
    1. Laravelの成熟したCSRF保護を活用できる
    2. トークン管理が不要で開発効率が高い
    3. Laravel生態系との親和性が高い
    
    【苦労した点】
    Laravel 11→12移行時のミドルウェア設定変更です。
    Kernel.phpが廃止され、bootstrap/app.phpに集約されたため、
    statefulApiの適用方法を理解するのに時間がかかりました。
    ```
    
    **10分版**（深掘り質問対応）:
    
    - CSRFトークンの流れ（GET /sanctum/csrf-cookie → X-XSRF-TOKEN）
    - ページリロード時の認証状態復元（router.beforeEach + fetchUser）
    - CORS設定とセキュリティ（allowed_originsの本番設定）

**1分版**（エレベーターピッチ）:

```
FortifyとSanctumを組み合わせたSPA認証を実装しました。
Fortifyが認証ロジック、Sanctumがセッション管理を担当します。
JWT認証ではなくセッション認証を選んだ理由は、
Laravelの成熟したCSRF保護を活用でき、開発効率が高いためです。
```

**3分版**（技術面接）:

```
Laravel FortifyとSanctumでSPA認証を実装しました。

【構成】
- Fortify: /fortify/login等の認証エンドポイント提供
- Sanctum: statefulApiミドルウェアでセッション管理
- router.beforeEach: ページリロード時にfetchUser()で状態復元

【技術選択の理由】
JWT認証ではなくセッション認証を選びました。
理由は3つあります：
1. Laravelの成熟したCSRF保護を活用できる
2. トークン管理が不要で開発効率が高い
3. Laravel生態系との親和性が高い

【苦労した点】
Laravel 11→12移行時のミドルウェア設定変更です。
Kernel.phpが廃止され、bootstrap/app.phpに集約されたため、
statefulApiの適用方法を理解するのに時間がかかりました。
```

**10分版**（深掘り質問対応）:

- CSRFトークンの流れ（GET /sanctum/csrf-cookie → X-XSRF-TOKEN）
- ページリロード時の認証状態復元（router.beforeEach + fetchUser）
- CORS設定とセキュリティ（allowed_originsの本番設定）
- **参考ドキュメント**:
    - [**Laravel + Vue + Sanctum構成における認証システムの設計考察**](https://www.notion.so/Laravel-Vue-Sanctum-2229d86c12e880409df2ea370bed13f6?pvs=21)
    - [**Laravel Kernel とミドルウェアの役割：モダンWebアプリケーションの基盤設計**](https://www.notion.so/Laravel-Kernel-Web-2319d86c12e880e7ac43da15bbdb2188?pvs=21)
    - [**クッキーを悪用するセキュリティ脅威とCORS・CSRFトークンによる対策**](https://www.notion.so/CORS-CSRF-2249d86c12e880aa95dacd96aefd970c?pvs=21)
    - [**Laravel CORS設定の本番環境最適化と設定判断基準**](https://www.notion.so/Laravel-CORS-2249d86c12e880e2bab8e1bfe22d4121?pvs=21)
    - [**Laravel 12時代の認証システム選択：アーキテクチャから考える最適解**](https://www.notion.so/Laravel-12-2319d86c12e880828b71f8ddeab6d7a1?pvs=21)
    - [Docker + Laravel + Vue.js環境構築手順②【**Laravel Fortify + Sanctumの導入**】](https://www.notion.so/Docker-Laravel-Vue-js-Laravel-Fortify-Sanctum-21b9d86c12e8805b8520f5787e836af1?pvs=21)

---

## Frontend理解（Store→Component）

### 概要

認証状態はPinia Storeで一元管理し、router.jsで認証ガードを実装。

**主要ファイル**:

```markdown
### Store
@resources/js/stores/auth.js
### Composable
@resources/js/composables/useUser.js
### Router
@resources/js/router.js
### Plugin
@resources/js/plugins/axios.js
### View
#### auth
@resources/js/views/auth/Login.vue
@resources/js/views/auth/PasswordReset.vue
@resources/js/views/auth/PasswordResetConfirm.vue
@resources/js/views/auth/Register.vue
#### user
@resources/js/views/user/Profile.vue
@resources/js/views/user/ProfileEdit.vue
### Validator
@resources/js/validators/authValidator.js
@resources/js/validators/profileValidator.js
```

### 質問1: Pinia Storeの認証状態管理

プロンプト

```markdown
### 質問1: Pinia Storeの認証状態管理
stores/auth.jsの実装を教えてください。
- login, register, logout, fetchUser, updateProfile アクションの役割は？
- 認証状態の管理方法（isAuthenticated）は？
- ローディング状態とエラーハンドリングの実装は？
- localStorageとの連携は？
```

### 主要アクションの役割

- **login**: CSRF Cookie取得 → POST /fortify/login → fetchUser() → localStorage保存
- **register**: CSRF Cookie取得 → POST /fortify/register → 自動ログイン（login呼び出し）
- **logout**: クライアント側状態クリア → router.replace('/login') → POST /fortify/logout（失敗しても継続）
- **fetchUser**: GET /api/user → ストアに保存（401時はlocalStorageクリア）
- **updateProfile**: PUT /api/user/profile → ストア更新

### 認証状態の管理方法

- **state.user**: ユーザー情報（null = 未認証）
- **state.isLoggedIn**: `!!user` で判定（setAuthUserで自動設定）
- **localStorage**: ブラウザリロード対策として`isLoggedIn`フラグのみ保存
- **router.beforeEach**: 初回アクセス時、localStorageをチェック→fetchUser()で状態復元

### ローディング・エラーハンドリング

- **state.loading**: API実行中はtrue（try...finallyで確実にクリア）
- **state.errors**: バリデーションエラー（422）を保持、setAuthErrors/clearAuthErrorsで管理
- **axios.interceptors**: 401/419時は自動的にlocalStorageクリア→ログイン画面へリダイレクト

### なぜこの設計か

**判断理由**:

1. **ログアウト優先**: サーバー側の失敗に関わらずクライアント側を確実にクリア（セキュリティ＋UX）
2. **localStorage最小化**: フラグのみ保存（XSS対策・データ鮮度維持）
3. **router.beforeEachで復元**: 全ページで一貫した認証チェック・状態復元

### 私の理解

- localStorageにはフラグのみを保存し、ブラウザリロード時の認証状態を維持。ユーザー情報本体はPiniaストアのみで管理（XSS対策）
    - XSS攻撃でlocalStorageからユーザー情報を盗めない（Piniaストアはメモリ上に存在し、JavaScriptから直接読み取れないため）
- ログアウト時はクライアント側クリアを優先し、APIの成功・失敗に関わらず確実にログアウト。Piniaストアの状態が残ってログイン画面に戻れなくなる問題を解決した経験から学習

### 面接で説明する際の30秒テンプレート

```markdown
Pinia Storeで認証状態を一元管理しています。

【設計のポイント】
- localStorageには「isLoggedIn」フラグのみ保存（ブラウザリロード対策）
- ユーザー情報本体はPinia Storeのみ（XSS対策＋データ鮮度維持）
- router.beforeEachで初回アクセス時にfetchUser()で状態復元

【工夫した点】
ログアウト時はクライアント側の状態クリアを優先し、
APIの成功・失敗に関わらず確実にログアウトします。
セキュリティとUXの両立を意識しました。
```

### 質問2: 認証ガードの実装

プロンプト

```markdown
### 質問2: 認証ガードの実装
router.jsでの認証ガードの実装を教えてください。
- beforeEachでどのようなチェックを行っていますか？
- 未認証時のリダイレクト処理は？
- 認証済み時に/loginにアクセスした場合の処理は？
```

### beforeEachのチェック内容

1. **初回アクセス時の状態復元**: `authStore.authUser`が空 ＋ `localStorage.isLoggedIn = 'true'` → `fetchUser()`で状態復元
2. **認証要否の判定**: `to.meta.requiresAuth` で認証が必要なページかチェック
3. **ゲスト専用判定**: `to.meta.requiresGuest` でゲスト専用ページ（/login等）かチェック

### リダイレクト処理

- **未認証 + 要認証ページ** → `/login` へリダイレクト
- **認証済み + ゲスト専用ページ** → `/dashboard` へリダイレクト
- **その他** → 通常遷移（`next()`）

### なぜこの設計か

**判断理由**:

1. **App.vueではなくrouter.beforeEach**: ページ遷移前に認証状態を確定させるため（全ページで一貫した認証チェック）
2. **fetchUser()のエラーハンドリング**: [`to.name`](http://to.name) `!== 'login'`チェックで無限リダイレクトループを防止
3. **requiresGuestの必要性**: ログイン済みユーザーがログイン画面を見るのを防ぐ（UX向上）

### 私の理解

- router.beforeEachでページ遷移前に認証チェック。localStorageフラグをチェック→fetchUser()で状態復元→meta判定でリダイレクト制御
- fetchUser()失敗時に[`to.name`](http://to.name) `!== 'login'`で無限ループ防止。セッションタイムアウト時も適切にログイン画面へ誘導

### 面接で説明する際の30秒テンプレート

```markdown
router.beforeEachで認証ガードを実装しています。

【設計のポイント】
- ページ遷移前に認証状態を確定（App.vueではなくrouter.beforeEachで実装）
- localStorageのフラグをチェック→fetchUser()で状態復元
- metaフィールド（requiresAuth/requiresGuest）で柔軟なアクセス制御

【工夫した点】
fetchUser()失敗時に無限リダイレクトループを防ぐため、
`to.name !== 'login'`のチェックを追加しました。
これにより、セッションタイムアウト時も適切にログイン画面へ誘導します。
```

### 質問3: コンポーネントでの認証処理

プロンプト

```markdown
### 質問3: コンポーネントでの認証処理
Login.vue、Register.vue、ProfileEdit.vueの実装を教えてください。
- どのようにバリデーションを実行していますか？
- authStoreのアクションをどのように呼び出していますか？
- エラーメッセージの表示方法は？
- ローディング中のUI制御は？
- 入力フィールドのボーダー制御は？
```

### バリデーション実行

- **クライアント側**: フォーム送信前に`authValidator.js`で各フィールドを検証（`validateEmail`, `validatePassword`等）
- **サーバー側**: API側でも二重バリデーション（422エラーで返却）
- **Modifiedフラグ**: `emailModified`等で入力変更を追跡→エラーボーダー制御

### authStoreアクションの呼び出し

1. クライアント側バリデーション実行
2. エラーがなければ`await authStore.login()` / `register()` / `updateProfile()`
3. 成功時は画面遷移、失敗時はエラー表示

### エラーメッセージ表示

- **Vue側エラー**: `validationErrors`算出プロパティで集約表示
- **API側エラー（422）**: `authStore.authErrors`から各フィールドにマッピング
- **API側エラー（その他）**: `apiError`で汎用メッセージ表示

### ローディングUI制御

- **isSubmitting**: API通信中は`true`、ボタンを`:disabled`で無効化（二重送信防止）
- **finally**: 成功・失敗に関わらず`isSubmitting = false`で確実にクリア

### ボーダー制御（UX配慮）

- **通常時**: 灰色ボーダー
- **エラー発生時**: 赤色ボーダー（[`errors.email`](http://errors.email) `!== '' && !emailModified`）
- **エラー後に再入力**: 即座に灰色に戻る（`emailModified = true`で`showEmailBorder = false`）

### なぜこの設計か

**判断理由**:

1. **二重バリデーション**: クライアント側（UX向上）＋サーバー側（セキュリティ：Never trust the client）
2. **エラー表示の分離**: Vue側とAPI側を分けて保守性向上・原因特定を容易に
3. **Modifiedフラグ**: バリデーションエラー後に再入力を開始すると即座にエラー表示を消す（UX配慮）

### 私の理解

- クライアント側バリデーションはUX向上とサーバー負荷軽減のため。ただしセキュリティ上、サーバー側バリデーションは必須（クライアントは改ざん可能）
- 422エラーを特別扱いしフィールドごとにエラー表示。`validationErrors`と`apiError`を分離し、保守性・原因特定の容易さを確保
- `isSubmitting`で二重送信防止。`finally`ブロックで確実にクリアし、エラー時もボタンが永久無効化されないよう実装

### 面接で説明する際の30秒テンプレート

```markdown
クライアント側とサーバー側で二重バリデーションを実装しています。

【設計のポイント】
- クライアント側：UX向上（即座にエラーフィードバック）
- サーバー側：セキュリティ（クライアントは信頼できない）
- エラー表示の分離：Vue側とAPI側でエラーを分けて管理

【工夫した点】
バリデーションエラー後に再度入力を開始すると、
赤ボーダーが即座に消えるUXを実装しました。
`Modified`フラグと算出プロパティで実現しています。
```

### 質問4: axios.jsのエラーハンドリング

プロンプト

```markdown
### 質問4: axios.jsのエラーハンドリング
plugins/axios.jsのインターセプターの実装を教えてください。
- 401/419エラー時の処理は？
- 403/404エラー時の処理は？
- 500系エラー時の処理は？
- なぜこのような共通処理を実装したのですか？
```

### エラーハンドリングの内容

- **401/419**: localStorage初期化 → `/login`へ強制リダイレクト（`window.location.href`でSPA状態リセット）
- **403/404**: `/not-found?type=forbidden`/`?type=notfound`へリダイレクト（NotFound.vueで動的表示）
- **500系**: GlobalErrorModal表示 → `Promise.reject(error)`でコンポーネント側のfinallyブロックでローディング状態クリア
- **422**: `Promise.reject(error)`で伝播 → 各コンポーネントで個別処理（フォームごとに異なるエラー表示が必要）

### なぜこの設計か

**判断理由**:

1. **共通処理で統一**: 全APIで一律対応することでコード重複を防止・UX統一
2. **window.location.href使用**: 401/419でSPAの状態（Piniaストア等）を完全リセット（router.push()は使わない）
3. **422は個別処理**: フォームごとに異なるエラー表示が必要なため共通化しない

### 私の理解

- 手動テスト時にエラー発生後もページ操作可能な問題を発見。axiosインターセプターで共通化することで、全APIで統一的なエラーハンドリングを実現
- `new Promise(() =\> \{\})`で永久に解決されないPromiseを返し、リダイレクト中のエラー処理実行を防止。500系は`Promise.reject(error)`でローディング状態クリア

### 面接で説明する際の30秒テンプレート

```markdown
axiosのレスポンスインターセプターで共通エラーハンドリングを実装しています。

【設計のポイント】
- 401/419: セッションタイムアウト → localStorage初期化 → 強制ログアウト
- 403/404: NotFound.vueにリダイレクト（ステータスコードで表示を動的変更）
- 500系: GlobalErrorModal表示（モーダル強制表示で誤操作防止）
- 422: コンポーネント個別処理（フォームごとに異なるため）

【工夫した点】
手動テスト時に、エラー発生後もページ操作が可能な問題に気づきました。
共通処理で一律対応することで、コード重複を防ぎ、
ユーザー体験を統一しました。
```

### まとめ

プロンプト

```markdown
### 理解したいこと（Why）
- 認証状態をPinia Storeで管理する利点は？
- localStorageとStoreの使い分け基準は？
- axios.jsで共通エラーハンドリングする理由は？
```

### なぜPinia Storeで管理するのか

**判断理由**:

1. 不必要なAPIリクエスト削減：全コンポーネントで状態共有することでパフォーマンス向上
2. リアクティブな更新：ストア変更時に全コンポーネントが自動再レンダリング
3. 保守性向上：認証が必要な処理を一元管理

### localStorageとStoreの使い分け

**判断理由**:

1. **localStorage**: ページリロード時の状態保持（`isLoggedIn`フラグのみ、XSS対策）
2. **Pinia Store**: アプリケーション実行中の状態管理（ユーザー情報全体、リアクティビティ）
3. **ローカル状態**: コンポーネント単位の状態管理（フォーム入力値等、メモリ最適化）

### なぜaxios.jsで共通エラーハンドリングするのか

**判断理由**:

1. コード重複防止：全APIで統一的なエラー処理（DRY原則）
2. UX統一：401/419は即座にログアウト、403/404は専用ページへリダイレクト
3. セキュリティ：セッションタイムアウト時の強制ログアウト

### 私の理解

- グローバル管理でAPIリクエスト削減・パフォーマンス向上。状態管理は3層構造（localStorage/Pinia Store/ローカル状態）で最適化
- 手動テスト時にエラー後もページ操作可能な問題を発見。axiosインターセプターで共通化し、全APIで統一的なエラーハンドリングを実現

### 面接で説明する際の30秒テンプレート

```markdown
Frontend理解のまとめです。

【Pinia Store管理】
全コンポーネントでユーザー情報を共有することで、
不必要なAPIリクエストを削減し、パフォーマンスを向上させています。

【状態管理の3層構造】
- localStorage: 永続化（isLoggedInフラグのみ、XSS対策）
- Pinia Store: グローバル状態（ユーザー情報全体）
- ローカル状態: コンポーネント単位（フォーム入力値等）

【axios.js共通エラーハンドリング】
全APIで統一的なエラー処理を行い、
コード重複を防止しながらUXを統一しています。
```

---

## 統合理解と説明練習

### 質問1: なぜLaravel Fortifyを採用したのですか？

**この質問の意図**:

面接官は、あなたの技術選定プロセスを知りたい。複数の選択肢（Breeze、自前実装、JWT等）がある中で、なぜFortifyを選んだのか。苦労した経験があるのに継続した判断基準は何か。

**あなたの答え**:

```
[転職活動時に記入]
```

### 質問2: 認証システムでFortifyと自前APIを併用していますが、どのように使い分けましたか？

**この質問の意図**:

面接官は、既存ライブラリと独自実装の使い分けができるかを見ている。全てを自前で作る必要はないが、独自要件に対応できる柔軟性があるか。設計の一貫性を保てるか。

**あなたの答え**:

```
[転職活動時に記入]
```

### 質問3: 認証状態をPinia Storeで管理していますが、なぜこの設計にしたのですか？

**この質問の意図**:

面接官は、フロントエンドの状態管理設計を理解しているかを確認したい。Props、Context、Storeなど複数の選択肢がある中で、なぜPinia Storeを選んだのか。localStorage、Pinia Store、ローカル状態の使い分けができるか。

**あなたの答え**:

```
[転職活動時に記入]
```

### 質問4: エラーハンドリングをaxiosインターセプターで共通化していますが、なぜこの設計にしたのですか？

**この質問の意図**:

面接官は、コードの保守性とDRY原則を理解しているかを見ている。422だけ個別処理にした理由は？共通化と個別化の判断基準は何か。実装時にどんな問題を発見して改善したか。

**あなたの答え**:

```
[転職活動時に記入]
```

### 質問5: セッション認証とJWT認証、どちらを選びましたか？その理由は？

**この質問の意図**:

面接官は、認証方式の違いとトレードオフを理解しているかを確認したい。CSRF保護、トークン管理、スケーラビリティなど、複数の観点で判断できるか。実装経験に基づいた判断か。

**あなたの答え**:

```
[転職活動時に記入]
```

### 質問6: クライアント側とサーバー側で二重バリデーションを実装していますが、なぜですか？

**この質問の意図**:

面接官は、セキュリティとUXのバランスを理解しているかを見ている。「クライアントは信頼できない」という原則を知っているか。なぜ両方必要なのか説明できるか。

**あなたの答え**:

```
[転職活動時に記入]
```

### 質問7: 実装中に遭遇した技術的な問題と、どう解決しましたか？

**この質問の意図**:

面接官は、問題解決能力と学習プロセスを知りたい。ドキュメントを読んで解決したのか、試行錯誤したのか、誰かに相談したのか。問題から何を学んだか。

**あなたの答え**:

```
[転職活動時に記入]
```

### 質問8: この認証システムの改善点や、次に実装したい機能は何ですか？

**この質問の意図**:

面接官は、自分の実装を客観的に評価できるかを見ている。完璧なコードはないという認識があるか。優先度を付けて改善提案ができるか。継続的な学習意欲があるか。

**あなたの答え**:

```
[転職活動時に記入]
```

---
