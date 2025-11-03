## 1. 概要

ログアウト処理時にVueコンポーネントのライフサイクルフックが予期せず実行され、401エラーが発生する問題に対する技術的解決策を定義する。

### 1.1 解決した主な問題

- ログアウト中の`onMounted`実行による401エラー
- 認証失敗時のエラーハンドリング不足
- 二重リダイレクトによるライフサイクルの乱れ
- Piniaストアのクリーンアップ不足

---

## 2. 問題の背景

### 2.1 発生した現象

ユーザーがログアウトボタンをクリックした際、以下のエラーが発生：

- HTTP 401 Unauthorized エラー
- コンソールにAPI通信エラーが表示
- まれにレイアウトが正しく切り替わらない

### 2.2 根本原因

Vue.jsのコンポーネントライフサイクルとVue Routerのナビゲーションが**非同期**で実行されるため、以下の競合状態が発生：

```
1. authStore.logout() 実行
2. this.setAuthUser(null) でログアウト状態に
3. App.vueのlayout computed が再評価 → DefaultLayout破棄開始
4. 子コンポーネントのonMountedが実行される（タイミング予測不可能）
5. onMounted内でデータフェッチ → 認証情報なし → 401エラー
6. router.replace('/login') が完了
```

### 2.3 重要な技術的知見

- コンポーネントの破棄とナビゲーションは非同期
- `onMounted`の実行タイミングは制御不可能
- ナビゲーションガードだけでは`onMounted`を防げない

---

## 3. 実装仕様

### 3.1 コンポーネントレベルの防御（最優先）

**方針：** すべてのデータフェッチを行うコンポーネントに認証状態チェックを追加

**実装パターン：**

```jsx
onMounted(async () => {
  // ログアウト中は処理をスキップ
  if (!authStore.isLoggedIn) {
    console.log('⚠️ ログアウト中のため処理をスキップ');
    return;
  }

  // ログイン中のみデータフェッチを実行
  await fetchData();
});
```

**適用対象コンポーネント：**

- `StudyProgress.vue`
- `StudySessionEdit.vue`
- `SectionStudyRecords.vue`
- `Dashboard.vue`
- その他、`onMounted`でAPI通信を行う全コンポーネント

### 3.2 ルーターレベルのエラーハンドリング

**ファイル：** `resources/js/router.js`

**修正内容：**

```jsx
// ❌ 修正前
if (!authStore.authUser && localStorage.getItem('isLoggedIn') === 'true') {
  await authStore.fetchUser(); // エラーハンドリングなし
}

// ✅ 修正後
if (!authStore.authUser && localStorage.getItem('isLoggedIn') === 'true') {
  try {
    await authStore.fetchUser();
  } catch (error) {
    console.error('認証情報の取得に失敗しました:', error);
    localStorage.removeItem('isLoggedIn');
    
    if ([to.name](http://to.name) !== 'login') {
      next('/login');
      return;
    }
  }
}
```

**効果：**

- 認証失敗時に適切にログイン画面へリダイレクト
- `localStorage`の不整合を解消

### 3.3 ログアウト処理の最適化

**ファイル：** `resources/js/stores/auth.js`

**実装仕様：**

```jsx
async logout() {
  // 1. 認証状態をクリア（先に実行）
  this.setAuthUser(null);
  localStorage.removeItem('isLoggedIn');

  // 2. すべてのPinia Storeをリセット
  useLearningContentStore().$reset();
  useLearningSessionStore().$reset();
  useSectionStore().$reset();
  useReportStore().$reset();

  // 3. ログイン画面へリダイレクト（後に実行）
  await router.replace('/login');

  // 4. サーバー側のセッション削除（非同期・失敗しても続行）
  [axios.post](http://axios.post)('/fortify/logout').catch((error) => {
    console.warn('サーバー側のログアウトに失敗:', error);
  });
}
```

**実装の順序が重要な理由：**

- 認証状態クリア → App.vueの`layout` computedが発火
- リダイレクトを後にすることで、layoutが正しく切り替わる

### 3.4 二重リダイレクトの防止

**ファイル：** `resources/js/App.vue`

**修正内容：**

```jsx
// ❌ 削除した実装
watch(isLoggedIn, (newValue, oldValue) => {
  if (oldValue === true && newValue === false) {
    router.push('/login'); // 二重リダイレクトの原因
  }
});
```

**理由：**

- `auth.js`の`logout()`内で既にリダイレクト済み
- `watch`による追加リダイレクトは不要かつ有害

---

## 4. 修正内容サマリー

| 問題分類 | 原因 | 修正内容 | 効果 |
| --- | --- | --- | --- |
| メイン | `onMounted`中のログアウト | 早期リターンを追加 | 401エラーを防止 |
| サブA | `try-catch`の漏れ | エラーハンドリング追加 | 認証失敗時の適切な処理 |
| サブB | 二重リダイレクト | `App.vue`の`watch`削除 | リダイレクトが1回のみ |
| サブC | ログアウトの順序 | 認証クリア→リダイレクト | layoutが正しく切り替わる |
| 追加 | データの残存 | Pinia Storeのリセット | クリーンな状態でログイン |

---

## 5. テスト観点

### 5.1 正常系

- [ ]  ログアウトボタンクリック → ログイン画面へ遷移
- [ ]  ログアウト後、再ログインで前回のデータが残っていない
- [ ]  レイアウトが正しく切り替わる（DefaultLayout → AuthLayout）

### 5.2 異常系

- [ ]  ログアウト中にデータフェッチが実行されない
- [ ]  ログアウト後のAPI通信で401エラーが発生しない
- [ ]  認証失敗時にログイン画面へリダイレクト

### 5.3 エッジケース

- [ ]  高速なページ遷移中にログアウト
- [ ]  ネットワークエラー中にログアウト
- [ ]  複数タブで同時ログアウト

---

## 6. 技術的知見

### 6.1 Vue.jsライフサイクルの重要な特性

1. **ライフサイクルフックは予測不可能**
    - コンポーネント側で防御的プログラミングが必須
    - ナビゲーションガードだけでは`onMounted`を制御できない
2. **非同期処理のエラーハンドリングは必須**
    - すべてのAPI通信に`try-catch`を追加
    - ユーザー体験を損なわないエラーハンドリング
3. **一貫性のある実装パターン**
    - 全コンポーネントで同じパターンを使用
    - 将来のメンテナンス性向上

### 6.2 ベストプラクティス

**認証状態を必要とするコンポーネントの標準パターン：**

```jsx
onMounted(async () => {
  // 1. 認証状態チェック（必須）
  if (!authStore.isLoggedIn) {
    return;
  }

  // 2. ローディング開始
  isLoading.value = true;

  try {
    // 3. データフェッチ
    await fetchData();
  } catch (error) {
    // 4. エラーハンドリング
    console.error('データ取得に失敗:', error);
  } finally {
    // 5. ローディング終了
    isLoading.value = false;
  }
});
```

---

## 7. 関連ドキュメント

- Vue.js Composition API: Lifecycle Hooks
- Vue Router: Navigation Guards
- Pinia: State Management
- Laravel Sanctum: SPA Authentication

---

## 8. 実装完了チェックリスト

- [x]  ログアウト時の401エラー：解決
- [x]  try-catchの漏れ：修正
- [x]  二重リダイレクト：解決
- [x]  layoutの切り替え：正常動作
- [x]  Pinia Storeのリセット：実装
- [x]  コードの一貫性：確保
- [x]  ユーザー体験：問題なし
- [x]  手動テスト：完了
- [x]  ドキュメント作成：完了

---

## 更新履歴

| 日付 | 変更内容 | 担当者 |
| --- | --- | --- |
| 2025-10-06 | 初版作成・実装完了 | 藤井俊祐 |
| 2025-10-11 | 仕様書形式に整理 | 藤井俊祐 |

---
