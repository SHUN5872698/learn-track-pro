## 概要

開発中に使用する`console.log`や`console.error`を本番環境から自動削除する方針と実装方法を定義します。

**採用方針**: Viteのビルド時自動削除（環境変数制御は不採用）

---

## 背景・問題

### 現在の状況

開発中、デバッグ用のコンソールログが大量に出力されている：

```jsx
// ダッシュボードログイン時の出力例
Pinia: fetchUser レスポンスデータ: {id: 3, name: '藤井　俊祐', avatar: null, email: '[test01@example.com](mailto:test01@example.com)', ...}
✅ Pinia: ユーザー情報取得成功 {...}
マスターデータ初期化完了
API Response: {data: Array(53)}
Sessions loaded: 53
```

### セキュリティリスク

**本番環境で残すべきでないログ：**

- 個人情報（名前、メールアドレス）
- 認証トークン（error.config.headersに含まれる可能性）
- 内部実装の詳細

**残してもOKなログ：**

- 汎用的なエラーメッセージ
- 状態確認用の簡潔なログ

### 削除される範囲の明確化

**削除されるもの：**

- アプリケーションコード内の`console.*`のみ
- 例：`console.log()`, `console.error()`, `console.warn()`, [`console.info](http://console.info)()`, `console.debug()`

**削除されないもの（本番環境でも表示される）：**

- ブラウザ自身が出力するログ・エラー
- ネットワークエラー（例：`GET /api/users 500 (Internal Server Error)`）
- JavaScriptエラー（例：`Uncaught TypeError: ...`）
- Vue警告（例：`[Vue warn]: ...`）

つまり、開発に必要な情報（ネットワークエラー等）は本番でも確認できるが、個人情報を含むアプリケーションのデバッグログは削除される。

---

## 採用した解決策

### Viteのビルド時自動削除

`vite.config.js`の`terserOptions`で本番ビルド時に自動削除する方式を採用。

### 選定理由

| 項目 | 環境変数制御 | Viteビルド時削除（採用） |
| --- | --- | --- |
| 工数 | 高い
- logger.js作成
- 全ファイル修正
- 検証必須 | 最小
- vite.config.js修正のみ
- 既存コード変更不要 |
| 開発体験 | 普通
- logger経由で記述 | 最高
- 削除されるのはアプリケーションコード内の`console.*`のみ
- ブラウザ自身が出力するログ・エラーは自由に使える |
| セキュリティ | 安全
- 本番で無効化 | 安全
- 本番ビルドで完全削除
 |
| メンテナンス | 中
- logger管理が必要 | 不要
- 自動処理 |
| デプロイ優先 | 工数増 | Phase 3へ影響なし |

---

## 実装方法

### 1. vite.config.jsの修正

```jsx
// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
  plugins: [
    vue(),
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.js'],
      refresh: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './resources/js'),
    },
  },
  // 本番ビルド時の設定
  build: {
    terserOptions: {
      compress: {
        drop_console: true,     // 本番ビルド時にconsole.*を削除
        drop_debugger: true,    // debugger文も削除
      },
    },
  },
});
```

### 2. 既存のconsole.logは修正不要

```jsx
// stores/auth.js - そのまま残す
console.log('✅ Pinia: ユーザー情報取得成功', [response.data](http://response.data));

// stores/learningSession.js - そのまま残す
console.log('API Response:', response);
console.log('Sessions loaded:', this.sessions.length);
```

**理由：**

- 開発中（`npm run dev`）は便利に使える
- 本番ビルド（`npm run build`）時に自動削除される
- ファイル修正が不要で工数最小

---

## 動作確認

### 開発環境（今まで通り）

```bash
# Docker環境で開発サーバー起動
docker compose exec php-apache bash -c "cd /var/www/html && npm run dev"
# → console.logが表示される
```

### 本番ビルド（Phase 3で確認）

```bash
# 本番ビルド実行
docker compose exec php-apache bash -c "cd /var/www/html && npm run build"

# 確認方法
grep -r "console.log" public/build/assets/
# → 何も見つからなければOK
```

**確認タイミング：**

- 現在（Phase 2）：何もしなくてOK
- Phase 3デプロイ直前：`npm run build`で確認（所要時間：5分）

---

## デプロイ方法との関係

デプロイ方法に依存せず、どの環境でも同様に動作する。

| デプロイ方法 | ビルド処理 | 影響 |
| --- | --- | --- |
| Docker（本番最適化） | CI/CDまたはローカルで
`npm run build` | 同じ |
| VPS（直接デプロイ） | CI/CDまたはVPS上で
`npm run build` | 同じ |
| AWS/Azure（マネージド） | CI/CDで
`npm run build` | 同じ |

補足：

- デプロイ方法の検討は独立して進められる
- `terserOptions`の設定はどの環境でも有効
- Phase 3で自由にデプロイ方法を選択できる

---

## 今後の拡張（Phase 4以降）

### 環境変数制御が必要になるケース

以下の場合は環境変数による制御を検討：

1. **本番環境でもログを一時的に有効化したい**
    - トラブルシューティング時
    - パフォーマンス調査時
2. **ログレベル（debug, info, warn, error）を細かく制御したい**
    - 開発：全て表示
    - ステージング：warn以上
    - 本番：errorのみ
3. **監視ツール（Sentry等）と連携したい**
    - エラーを外部サービスに送信
    - ユーザー行動のトラッキング

### 実装例（参考）

```jsx
// utils/logger.js（Phase 4以降で検討）
const isDev = [import.meta.env.DEV](http://import.meta.env.DEV);
const isDebugEnabled = import.meta.env.VITE_ENABLE_CONSOLE_LOG === 'true';

export const logger = {
  debug: (...args) => {
    if (isDev || isDebugEnabled) console.log(...args);
  },
  info: (...args) => {
    if (isDev || isDebugEnabled) [console.info](http://console.info)(...args);
  },
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args),
};
```

**現時点の判断：**

- Phase 2・Phase 3では導入しない（工数削減優先）
- Phase 4以降で必要に応じて検討

---

## まとめ

### 採用方針

Viteのビルド時自動削除を採用

### メリット

1. 工数最小（設定ファイル1箇所のみ、5分）
2. 検証不要（既存機能に影響なし）
3. 開発効率維持（console.log自由に使える）
4. セキュリティ確保（本番では完全削除）
5. デプロイ優先（Phase 3への影響なし）

### 実装状況

- vite.config.js修正完了
- 既存コード変更不要
- Phase 3デプロイ時に動作確認予定

---

## 参考資料

### 関連ドキュメント

- [機能拡張ロードマップ](https://www.notion.so/2499d86c12e880b9ba25d1cc7e8d71f3?pvs=21)

### Vite公式ドキュメント

- [Building for Production - Vite](https://vitejs.dev/guide/build.html)
- [Terser Options](https://terser.org/docs/api-reference#compress-options)
