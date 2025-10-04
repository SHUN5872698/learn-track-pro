## 相互リンク

[**これまでの議論の要点まとめ**](https://www.notion.so/2809d86c12e880e485b9e08ef6eddb83?pvs=21) 

.gemini/docs/project-infos/discussion-summary.md

---

```bash
# これまでの議論の要点まとめ

## 背景・経緯

### プロジェクトの概要

- **プロジェクト名**: LearnTrack Pro - プログラミング学習管理プラットフォーム
- **開発期間**: 2025年9月3日〜10月7日（5.5週間、バッファ含む）
- **現在日**: 2025年10月3日（金）- 最終週（残り4日）
- **開発者**: 藤井俊祐氏（転職活動用ポートフォリオ）
- **開発手法**: APIファーストアプローチ with AI駆動開発（GeminiCLI + Claude）
- **差別化ポイント**: StudyPlusと異なり、書籍に依存しない学習内容管理（ポートフォリオ作成等）

### 目的・目標

- プログラミング学習に特化した進捗管理システム
- セクション単位での詳細な進捗可視化
- 技術分野別の学習時間分析機能
- **最重要**: 2025年10月7日までにMVP完成（残り4日）

### 主要な制約条件

- TypeScript不使用（JavaScriptのみ）
- Bootstrapクラス・カスタムCSS禁止（TailwindCSSのみ）
- jQuery等レガシーライブラリ禁止
- 絵文字アイコン不使用（Heroiconsのみ）
- Options API禁止（Composition APIのみ）

---

## 完了・確定事項

### 既に決定されている内容

#### 確定技術スタック

**Backend:**
- Laravel 12.x (PHP 8.3+)
- Laravel Sanctum / Fortify（SPA認証）
- MySQL 8.0 / Docker環境
- Gmail SMTP（Mailtrapから変更）

**Frontend:**
- Vue.js 3 (Composition API)
- Pinia（状態管理）/ Vue Router
- TailwindCSS 3.x / Headless UI
- Chart.js / vue-chartjs
- Vite（ビルドツール）

### 作成済みのドキュメント・成果物

#### 本日完了事項（10/3）✅

**認証系フォームバリデーション統一化完了:**

1. ✅ バリデーションルール完全統一
   - `resources/js/validators/authValidator.js`: 認証系バリデーション
   - `resources/js/validators/profileValidator.js`: プロフィール系バリデーション
   - すべてのバリデーションが `{ isValid, message }` 形式を返却

2. ✅ エラー表示の完全統一（全5ファイル）
   - Login.vue
   - Register.vue
   - PasswordReset.vue
   - PasswordResetConfirm.vue
   - ProfileEdit.vue

3. ✅ 赤枠表示制御の統一実装
   - `errors` オブジェクトでエラーメッセージ管理
   - `xxxModified` フラグで入力変更を検知
   - `showXxxBorder` 算出プロパティで赤枠表示制御
   - 入力変更後は赤枠を解除（UX向上）

4. ✅ Tailwindスタイルの完全統一
   - placeholder色: `placeholder-gray-400`
   - focus色: `violet-500`（ブランドカラー）
   - エラー時: `border-red-500 focus:border-red-500 focus:ring-red-500`
   - 通常時: `border-gray-300 focus:border-violet-500 focus:ring-violet-500`

5. ✅ HTML属性の統一
   - `id`と`name`属性を全フィールドに追加（アクセシビリティ・テスト対応）
   - `autocomplete`は削除（プロジェクト方針）

#### 前回完了事項（10/2）✅

**パスワードリセット機能完全実装:**
1. ✅ Gmail SMTP設定完了（.envでMAIL_DRIVER → MAIL_MAILERに変更）
2. ✅ routes/web.phpにリセットルート追加（name('password.reset')）
3. ✅ Vue Router設定（/reset-password/:token）
4. ✅ PasswordResetConfirm.vue作成（既存認証ページと統一デザイン）
5. ✅ メール送信・受信・リセット処理の動作確認完了
6. ✅ Apidog APIテスト完了（エンドポイント8, 9）

#### 直近の修正完了事項（10/1）✅

**UI/UX改善:**
1. ✅ 学習記録カードコンポーネント作成（StudyRecordCard.vue）
2. ✅ 学習記録削除用モーダル作成（StudyRecordDeleteModal.vue）
3. ✅ ページネーション内メモ表示レイアウト調整
4. ✅ ダッシュボードの技術とステータス表示を2行に分離

### API実装状況

- 全エンドポイント実装・検証完了
- パスワードリセットAPI（/fortify/forgot-password, /fortify/reset-password）動作確認完了
- 当日データを含む統計API正常動作

### 合意済みの方針・アプローチ

#### バリデーション実装の統一パターン（10/3確立）★重要

**1. バリデーションルールの構造:**

```javascript
// resources/js/validators/authValidator.js または profileValidator.js

export const validateFieldName = (value) => {
  // 空白チェック、形式チェックなど
  
  return {
    isValid: true,  // または false
    message: '',    // エラーメッセージ（エラー時のみ）
  };
};
```

**2. Vueファイルの状態管理パターン:**

```javascript
// エラーメッセージを保持
const errors = reactive({
  fieldName: '',
});

// 入力変更フラグ
const fieldNameModified = ref(false);

// 赤枠表示制御
const showFieldNameBorder = computed(() => {
  return errors.fieldName && !fieldNameModified.value;
});

// エラーメッセージ集約
const validationErrors = computed(() => {
  const messages = [];
  if (errors.fieldName) messages.push(errors.fieldName);
  return messages;
});
```

**3. テンプレートの統一構造:**

```vue
<!-- バリデーションエラー表示 -->
<div v-if="validationErrors.length" class="p-4 mb-6 text-red-800 bg-red-100 border-l-4 border-red-500 rounded-md">
  <h3 class="font-bold">入力エラー</h3>
  <ul class="mt-2 ml-2 list-disc list-inside">
    <li v-for="error in validationErrors" :key="error">{{ error }}</li>
  </ul>
</div>

<!-- API側のエラー表示 -->
<div v-if="authError" class="p-4 mb-6 text-red-800 bg-red-100 border-l-4 border-red-500 rounded-md">
  <h3 class="font-bold">エラー</h3>
  <ul class="mt-2 ml-2 list-disc list-inside">
    <li>{{ authError }}</li>
  </ul>
</div>

<!-- 入力フィールド -->
<div>
  <label for="field-id" class="block mb-2 text-sm font-medium">
    フィールド名<span class="pl-1 text-red-500">*</span>
  </label>
  <input
    id="field-id"
    name="field-name"
    type="text"
    placeholder="..."
    v-model="fieldValue"
    @input="fieldNameModified = true"
    class="w-full px-3 py-2 placeholder-gray-400 border rounded-lg appearance-none focus:outline-none"
    :class="[showFieldNameBorder ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-violet-500 focus:ring-violet-500']"
  />
</div>
```

**4. 送信処理の統一パターン:**

```javascript
const handleSubmit = async () => {
  // 1. エラーをリセット
  errors.field = '';
  authError.value = '';
  fieldModified.value = false;
  
  // 2. 空白除去
  field.value = field.value.trim();
  
  // 3. Vue側バリデーション
  const result = validateField(field.value);
  if (!result.isValid) {
    errors.field = result.message;
    return; // ← API送信をブロック
  }
  
  // 4. API送信
  try {
    await store.someAction(data);
    // 成功処理
  } catch (error) {
    // 5. API側のエラーを authError に設定
    if (store.hasAuthErrors) {
      authError.value = Object.values(store.authErrors).flat().join(', ');
    } else {
      authError.value = '一般的なエラーメッセージ';
    }
  }
};
```

**5. 重要な設計原則:**

- ✅ Vue側とAPI側のエラーを明確に分離表示
- ✅ Vue側バリデーションでエラーがあればAPI送信をブロック
- ✅ 入力変更後は赤枠を解除（UX向上）
- ✅ `trim()`で空白を除去してからバリデーション
- ✅ バリデーションエラーは`validationErrors`、API側エラーは`authError`

#### Vueファイルのコード整理方針（10/2確定）

**`<script setup>`セクション順序:**

```javascript
// 1. 外部インポート
// 2. 内部インポート
// 3. ユーティリティ関数（存在する場合）
// 4. 初期設定
// 5. 状態管理
// 6. 算出プロパティ
// 7. ライフサイクル
// 8. メソッド
```

**対象ファイル（10件）:**
- 認証系：Register.vue, PasswordReset.vue, Login.vue
- 共通コンポーネント：BaseButton.vue, ConfirmModal.vue, DatePickerModal.vue, LoadingSpinner.vue, SectionSelector.vue, UserAvatar.vue, TimeInputModal.vue

#### Toast通知実装方針（10/2確定）

**設計方針:**
- モーダルではなく「Toast Notification」として実装
- チェックアイコン表示 + 3秒後に自動消去
- 右上隅に表示
- Vue Transition APIでアニメーション

**新規コンポーネント:**
- ToastNotification.vue
- props: show, type, title, message, duration
- emit: close
- 3種類のtype: success, error, info

**使用箇所（予定）:**
- 学習コンテンツ完了時
- セクション完了時
- プロフィール更新成功時
- パスワード変更成功時

#### console.log管理方針（9/30確定）

```javascript
// AI時代の開発スタイル
// 1. 問題発生時: AIにデバッグコードを生成してもらう
// 2. 問題解決後: きれいに削除してコードをクリーンに保つ
// 3. コメントアウトではなく完全削除を推奨
```

---

## 技術的検討事項

### 採用技術・ツール

- **開発支援**: GeminiCLI（FLASH2.5）/ Claude / Apidog
- **API仕様管理**: OpenAPI 3.0.1 / YAML形式
- **テスト**: Apidog（API検証）/ Playwright MCP（E2Eテスト・スクリーンショット）
- **バージョン管理**: Git
- **エディタ**: VS Code

### 技術的方針・戦略

#### Playwright MCP活用戦略（10/2確立）

**目的:**
- レスポンシブ対応時のレイアウト検証自動化
- デバイスサイズ別スクリーンショット一括取得
- AIによるレイアウト問題分析の効率化

**確立したワークフロー:**
1. ログイン - `browser_fill_form`で安定した認証
2. スクリーンショット撮影 - デスクトップ（1920px）+ モバイル（375px）
3. レイアウト問題分析 - チェックリスト形式の汎用プロンプト
4. 修正実行 - GeminiCLI → 問題あればClaude引き継ぎ

**プロンプト設計の特徴:**
- 5秒待機ルール（SPA対応）
- ファイル命名規則統一（{device}-{page}-{description}.png）
- 保存先固定（resources/js/.playwright-mcp/）
- 確認要素の明記（要素の存在確認）

#### レスポンシブ対応戦略（10/2確定）

**基本方針:**
- スマホサイズ（375px）を最優先
- タブレット（768px）は時間があれば対応
- テキストサイズ起因のレイアウト崩れは発見次第対応

**実装アプローチ:**
1. 小規模テストから開始（Login.vueのみでワークフロー確立）
2. GeminiCLI（Flash 2.5）で初回修正
3. 問題があればClaude（高品質保証）
4. 最終確認は開発者自身

**優先度:**
- 高：ログイン、ダッシュボード、学習内容詳細
- 中：学習記録作成、レポート
- 低：プロフィール編集

#### AI活用の成熟度（10/3確立）★重要

**Level 3: AI協働期（現在地）**

```
問題 → 自分で調査 → パターン発見 → 自分で修正 → AIで確認
```

**特徴:**
- ✅ 最も理解が深い
- ✅ 自走できる
- ✅ AIは「確認・相談相手」

**教訓:**
- 異なるAI（Gemini Flash）で実装したコードは統一性が失われやすい
- パターン認識力が重要
- 手を動かすことで深い理解が得られる
- 「動く」≠「良いコード」
- 統一性・保守性・可読性も重要

---

## 現在の課題・検討点

### 未解決の課題

#### MVP必須機能（残タスク - 優先度順）

**1. 残りのバリデーション実装（最優先）**★新規追加

**対象ファイル（未実装）:**

1. **学習内容管理:**
   - `resources/js/views/content/ContentCreate.vue`
   - `resources/js/views/content/ContentEdit.vue`

2. **セクション管理:**
   - `resources/js/views/section/SectionCreate.vue`
   - `resources/js/views/section/SectionEdit.vue`

3. **学習記録管理:**
   - `resources/js/views/record/RecordCreate.vue`
   - `resources/js/views/record/RecordEdit.vue`

**実装すべき内容:**
- ✅ 確立したバリデーションパターンを適用
- ✅ エラー表示の統一（Vue側とAPI側の分離）
- ✅ 赤枠表示制御の実装
- ✅ Tailwindスタイルの統一
- ✅ `id`と`name`属性の追加

**必要なバリデーションルール作成:**
- `resources/js/validators/contentValidator.js`: 学習内容バリデーション
- `resources/js/validators/sectionValidator.js`: セクションバリデーション
- `resources/js/validators/recordValidator.js`: 学習記録バリデーション

**バリデーション項目（予想）:**

```javascript
// contentValidator.js
- validateTitle: タイトル（必須、最大255文字）
- validateDescription: 説明（任意、最大1000文字）
- validateTechnology: 技術分野（必須）
- validateTotalSections: 総セクション数（必須、1以上の整数）
- validateContent: 全体バリデーション

// sectionValidator.js
- validateTitle: セクション名（必須、最大255文字）
- validateSectionNumber: セクション番号（必須、1以上の整数）
- validateSection: 全体バリデーション

// recordValidator.js
- validateDate: 学習日（必須、未来日付不可）
- validateStartTime: 開始時刻（必須、HH:mm形式）
- validateEndTime: 終了時刻（必須、開始時刻より後）
- validateMemo: メモ（任意、最大1000文字）
- validateRecord: 全体バリデーション（時刻の前後チェック含む）
```

**見積もり時間:**
- バリデーションルール作成: 2-3時間
- 各ファイルへの適用: 3-4時間
- 動作確認: 1-2時間
- **合計: 6-9時間**

---

**2. Vueファイル<script setup>並び替え（1時間）**
- Geminiワークフロー化済み
- 10ファイルのコード整理
- コード品質向上

**3. Toast通知（完了通知モーダル）実装（2-3時間）**
- ToastNotification.vue新規作成
- 各画面への適用（4-5箇所）
- alertからの置き換え

**4. 手動テスト実施（3-5時間）**
- GeminiCLIによるテストドキュメント自動生成
- 各ページ単位でのチェックリスト作成
- 通常動作でのエラー確認（カバレッジ重視せず）

**5. レスポンシブ対応（5-8時間）**
- Playwright MCP活用
- スマホサイズ対応優先
- 段階的実装（1ページずつワークフロー確立）

### 軽微な調整（時間があれば）

- ダッシュボードのテキストサイズ調整（タブレットサイズ対応）
- 学習記録作成・編集のメモ欄行数調整（完了済み）
- 確認画面での概要表示改善（完了済み）

### リスク要因

#### バリデーション実装の時間超過リスク★新規追加

**懸念点:**
- 6ファイルのバリデーション実装（6-9時間見込み）
- バリデーションルールの複雑さ（特に学習記録の時刻チェック）
- 既存コードとの統合時の予期せぬ問題

**対策:**
- **段階的実装**: 1ファイルずつ完成させる
- **パターンの再利用**: 認証系で確立したパターンを厳密に適用
- **GeminiCLI活用**: バリデーションルールの初期実装
- **Claude確認**: ロジックの正確性を最終確認
- **最悪のケース**: サーバー側バリデーションのみに頼る（UXは劣るがMVPとしては成立）

#### レスポンシブ対応の不確実性

**懸念点:**
- Playwright MCPワークフロー未完全確立
- GeminiCLI（Flash 2.5）の修正品質にばらつき
- 想定外の時間超過リスク

**対策:**
- 小規模テストから開始（1ページのみ）
- GeminiCLI → Claude の2段階修正体制
- 最悪のケース：レスポンシブ対応をPhase 1に延期（MVP品質を優先）

#### 時間的制約★更新

- **残り4日**（10/7まで）
- 平日2日（10/4-10/5）+ 週末1日（10/6）+ 最終日（10/7）
- **バリデーション実装が追加されたため、余裕は更に少ない**

---

## これまでの議論で確定した方針

### 重要な判断・決定事項

#### バリデーション統一化の教訓（10/3確立）★重要

**発見した問題:**
- ProfileEdit.vueがGemini CLI Flashで実装されていた
- 他の認証ページ（Login, Register等）と統一性がなかった
- バリデーションエラー表示、赤枠制御、Tailwindスタイルがバラバラ

**根本原因:**
- Mockデータの扱いが不明確な時期に、焦って別のAI（Gemini Flash）に依頼
- 動くコードは得られたが、プロジェクト全体の統一性が失われた

**得られた教訓:**
1. **異なるAIは異なる「クセ」を持つ**
   - Gemini Flash: 高速、一発回答型、機能重視
   - Claude: 段階的、文脈重視、統一性重視

2. **「動く」≠「良いコード」**
   - 統一性・保守性・可読性も重要
   - プロジェクト全体のパターンを守る

3. **手を動かす価値**
   - 自分で手直しすることで深い理解が得られる
   - パターン認識力が向上する
   - AI任せの弊害を回避できる

4. **パターンの重要性**
   - 一度確立したパターンは厳密に守る
   - 新規実装時は既存コードを参照する
   - コピー&ペーストできる実装が理想

**今後の方針:**
- ✅ 認証系で確立したバリデーションパターンを**厳密に**適用
- ✅ 学習内容・セクション・学習記録でも同じパターンを使用
- ✅ 新規実装時は必ず既存コードと比較して統一性を確認

#### パスワードリセット機能実装の教訓（10/2確定）

**問題と解決:**
1. 問題: メールが届かない
2. 原因: .envでMAIL_DRIVERを使用（Laravel 12では非推奨）
3. 解決: MAIL_MAILERに変更 + routes/web.phpにルート追加
4. 結果: Gmail SMTP経由でメール送信成功

**重要なポイント:**
- Fortifyはトークン付きURLを生成するため、route('password.reset')の定義が必須
- SPAなのでview('app')を返してVue Routerに委譲
- 既存認証ページとデザイン統一（コピー&ペースト可能な実装）

#### MVP完成の判断基準（10/3再確認）★更新

**絶対必須:**
- ✅ 認証機能（パスワードリセット含む）- **バリデーション完了**
- 🔄 学習内容・セクション管理 - **バリデーション未実装**
- 🔄 学習記録CRUD - **バリデーション未実装**
- ✅ レポート・統計表示
- 🔄 Toast通知（UX向上）
- 🔄 手動テスト完了

**推奨（時間があれば）:**
- レスポンシブ対応（スマホサイズ）
- 軽微なレイアウト調整

**Phase 1に延期確定:**
- タブレット完全対応
- パフォーマンス最適化
- Composable分割改善
- セクション別学習時間チャート

### 優先度・重要度の確定

#### 今週の優先順位（10/3更新）★重要

**第1優先: バリデーション実装（新規追加）**

1. バリデーションルール作成（2-3時間）
   - contentValidator.js
   - sectionValidator.js
   - recordValidator.js

2. 各ファイルへのバリデーション適用（3-4時間）
   - ContentCreate.vue / ContentEdit.vue
   - SectionCreate.vue / SectionEdit.vue
   - RecordCreate.vue / RecordEdit.vue

3. 動作確認（1-2時間）
   - 各フォームでのバリデーション動作確認
   - エラー表示の確認
   - API送信のブロック確認

---

**第2優先: コード品質向上**

1. Vueファイル<script setup>並び替え（1時間）
2. Toast通知実装（2-3時間）

---

**第3優先: 品質保証**

1. 手動テスト実施（3-5時間）
2. バグ修正

---

**第4優先: UX向上**

1. レスポンシブ対応（時間があれば）

#### レスポンシブ対応を必須にしない判断（10/2確定）

**理由:**
1. MVP定義: 最小限の実用的プロダクト → PC版完璧なら十分
2. ポートフォリオ価値: レスポンシブ未対応はシステム不具合ではない
3. リスク管理: Playwright MCPワークフロー未確立による時間超過リスク
4. 段階的実装: Phase 1でレスポンシブ対応可能

**合理性:**
- 手動テスト先行 → 機能の正常動作保証
- レスポンシブ後回し → MVP完成を優先
- ボタンが押せないレベルの問題は現時点で発生していない

### 除外・後回し事項

#### MVP後に延期（確定）

- Composable分割の改善（useTechnologies.js, useCategories.js等）
- バリデーションメッセージの機能別一元管理
- 統計計算ロジックのcomposable化
- 進捗バーの共通コンポーネント化
- セクション別学習時間チャート追加

#### 完全除外（実装しない）

- ストップウォッチ機能（条件未達成）
- 期間切り替え機能（条件未達成）
- パスワード変更機能（ProfileEdit.vueから削除済み）

---

## 次のアクション

### 今日の作業計画（10/3金）★更新

**午後（13:00-17:00）- 残り4時間**

1. **バリデーションルール作成開始（2時間）**
   - `resources/js/validators/contentValidator.js` 作成
   - validateTitle, validateDescription, validateTechnology, validateTotalSections
   - validateContent（全体バリデーション）

2. **ContentCreate.vueへのバリデーション適用（2時間）**
   - 認証系パターンの適用
   - エラー表示の統一
   - 赤枠表示制御の実装
   - 動作確認

### 週末の作業計画（10/4-10/7）★更新

**土曜日（10/4）- バリデーション実装日**

- 午前（4時間）
  - ContentEdit.vueへのバリデーション適用
  - sectionValidator.js作成
  - SectionCreate.vueへのバリデーション適用

- 午後（4時間）
  - SectionEdit.vueへのバリデーション適用
  - recordValidator.js作成
  - RecordCreate.vueへのバリデーション適用開始

---

**日曜日（10/5）- バリデーション完了 + コード品質向上**

- 午前（4時間）
  - RecordEdit.vueへのバリデーション適用
  - 全バリデーションの動作確認
  - バグ修正

- 午後（4時間）
  - Vueファイル<script setup>並び替え（1時間）
  - Toast通知実装開始（3時間）

---

**月曜日（10/6）- Toast完了 + 手動テスト**

- 午前（4時間）
  - Toast通知実装完了
  - 手動テスト開始（GeminiCLIでテストドキュメント生成）

- 午後（4時間）
  - 手動テスト継続
  - 発見したバグ修正

---

**火曜日（10/7）最終日 - 最終調整 + MVP完成**

- 午前（4時間）
  - 手動テスト完了
  - 軽微なバグ修正
  - 最終動作確認

- 午後（4時間）
  - ドキュメント整備
  - README更新
  - **MVP完成** 🎉

### 継続検討が必要な事項

#### 技術的検討

- Playwright MCPワークフローの最適化（レスポンシブ対応時）
- GeminiCLI vs Claude の使い分け基準明確化
- レスポンシブ対応の実装パターン確立（Phase 1）

#### プロジェクト管理

- Phase 1機能の優先順位策定（MVP後）
- 本番環境のインフラ選定
- デプロイ方法の確定（AWS想定）
- ドキュメント・README整備計画

---

## 特記事項

### 開発者の強み

1. **論理的思考**: 優先順位付けが明確
2. **リスク管理**: 不確実性を認識し段階的アプローチ
3. **AI活用**: GeminiCLI + Claudeの使い分けが秀逸
4. **パターン認識**: 統一性の重要性を理解し実践
5. **自己成長**: AI任せの弊害に気づき、手を動かして学ぶ姿勢

### プロジェクトの健全性（10/3更新）★更新

- ✅ **コア機能完成度**: 90%（バリデーション実装が追加されたため微減）
- ⚠️ **スケジュール**: タイト（残り4日、バリデーション実装6-9時間）
- ✅ **技術的負債**: 最小限（統一化により改善）
- ✅ **ドキュメント**: 充実
- ⚠️ **レスポンシブ**: 未着手（リスク管理済み、Phase 1に延期可能）

**総合評価: MVP完成可能性 85%**（バリデーション実装追加により微減、ただし十分実現可能）

---

## バリデーション実装の参考情報★重要

### 既に完了しているバリデーション実装（参考にすべきファイル）

**認証系（完全実装済み）:**
1. `resources/js/views/auth/Login.vue`
2. `resources/js/views/auth/Register.vue`
3. `resources/js/views/auth/PasswordReset.vue`
4. `resources/js/views/auth/PasswordResetConfirm.vue`

**プロフィール系（完全実装済み）:**
1. `resources/js/views/user/ProfileEdit.vue`

**バリデーションルール（完全実装済み）:**
1. `resources/js/validators/authValidator.js`
2. `resources/js/validators/profileValidator.js`

### 実装時の注意点

1. **パターンの厳密な適用**
   - 既存の認証系ファイルをコピー&ペーストベースで実装
   - `errors` オブジェクト、`xxxModified` フラグ、`showXxxBorder` 算出プロパティの3点セット
   - エラー表示HTMLの統一構造を維持

2. **バリデーションルールの設計**
   - 必ず `{ isValid, message }` 形式を返却
   - エラーメッセージは日本語で分かりやすく
   - 複数フィールドの相互検証（開始・終了時刻など）は全体バリデーション関数で実施

3. **API送信のブロック**
   - Vue側バリデーションでエラーがあれば、`return`でAPI送信を中断
   - `trim()`による空白除去を忘れずに

4. **Tailwindスタイルの統一**
   - `placeholder-gray-400`, `focus:border-violet-500`, `focus:ring-violet-500`
   - エラー時: `border-red-500 focus:border-red-500 focus:ring-red-500`

5. **HTML属性の統一**
   - `id`と`name`属性を必ず追加
   - `<label for="...">`で入力欄と紐付け
   - `autocomplete`は不要（プロジェクト方針）

---

```
