## 1. ログイン

```markdown
Playwright MCPを使ってLearnTrack Proにログインしてください。

## 手順

1. **ログインページにアクセス**
   - URL: http://localhost:8000/login
   - ページが完全に読み込まれるまで待機してください

2. **browser_fill_formツールを使用してログイン**
   - 以下の認証情報を一度に入力：
     * メールアドレス: [test01@example.com](mailto:test01@example.com)
     * パスワード: password
   - browser_fill_formツールで両方のフィールドを同時に設定してください

3. **ログインボタンをクリック**
   - ボタンのテキスト: "ログイン"
   - クリック後、ダッシュボードへのリダイレクトを待機

4. **ログイン成功の確認**
   - URL が http://localhost:8000/dashboard に変わることを確認
   - ページタイトルが "LearnTrack Pro" であることを確認
   - "学習ダッシュボード" の見出しが表示されていることを確認

5. **ブラウザを開いたまま維持**
   - ログイン状態を保持するため、ブラウザを閉じないでください

## 注意事項
- browser_typeではなく、browser_fill_formを使用してください（入力の安定性のため）
- 各ステップ後は必ずページの状態を確認してください
```

---

## 2. スクリーンショット撮影

<aside>
💡

 **スクリーンショット撮影だけなら手動撮影がおすすめです。**

**Playwright MCP**

- ❌ GeminiCLI待機が必要
- ❌ コマンド入力が複雑
- ⚠️ エラー時の再実行が面倒
- ✅ E2Eテストの練習になる

**Chrome DevTools**

- ✅ 即座に撮影
- ✅ ショートカットで簡単
- ✅ 何度でも撮り直し可能
- ⚠️ テスト自動化はできない
</aside>

### 2.0 Chrome DevToolsでのスクリーンショット撮影方法

**1. Chrome DevToolsを開く**

**2. Device Modeを有効化**

**3. デバイスサイズを設定**

- モバイル：375×667px
    1. 横幅：`375`
    2. 縦幅：`667`
    3. ズーム：`100%`（重要）
- デスクトップ：1280×800px
    1. 横幅：`1280`
    2. 縦幅：`800`
    3. ズーム：`100%` （重要）
1. **キャプチャ**
    
    ```markdown
    ## コマンドパレットを開く
    Cmd + Shift + P
    
    ### 全画面キャプチャ（**推奨**）
    Capture full size screenshot
    
    ### 表示部分のみキャプチャ
    Capture screenshot
    ```
    

### 2-1. 単体ページ撮影用（トラブルシューティング）

特定のページのみを撮影する際に使用します。

- 変更が必要な箇所
    - `<URL>` → 例：http://localhost:8000/learning/1000
    - [`<page-name>`](https://www.notion.so/Playwright-MCP-2809d86c12e88042bc4ce592287e1c46?pvs=21)  → 例：dashboard
    - `<YYYY-MM-DD>` → 例：2025-10-16

```markdown
現在のブラウザでログイン状態を維持したまま、以下の手順でスクリーンショットを撮影してください。

---

## 📱 撮影設定

### デバイスサイズ

以下の各サイズで、全8画面のスクリーンショットを撮影します：

1. **デスクトップ**: 1280×800
   - ファイル名プレフィックス: `desktop-`

2. **モバイル**: 375×667
   - ファイル名プレフィックス: `mobile-`

### 撮影の流れ

1. デスクトップサイズ（1280×800）に設定
2. 全8ページを撮影
3. モバイルサイズ（375×667）に設定
4. 全8ページを撮影

**合計16枚のスクリーンショット**が生成されます。

---

## 🖥️ Phase 1: デスクトップサイズでの撮影

### ステップ0: ウィンドウサイズ設定

**最初に一度だけ実行**:
- `browser_resize`ツールを使用
- 幅: 1280ピクセル
- 高さ: 800ピクセル

### 撮影対象ページと手順

**重要**: 各ページで必ず以下の順序で実行してください：
1. ページに移動
2. 5秒間待機（SPAのレンダリング完了を待つ）
3. 対象要素が表示されていることを確認
4. スクリーンショット撮影

---

#### 1. ダッシュボード

**手順**:
1. ページに移動: http://localhost:8000/dashboard
2. 5秒間待機してください
3. 「学習ダッシュボード」の見出しまたは学習カードが表示されていることを`browser_snapshot`で確認
4. 確認できたら、フルページスクリーンショットを撮影
   - ファイル名: **desktop-dashboard-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/desktop/

---

#### 2. 学習内容詳細

**手順**:
1. ページに移動: http://localhost:8000/learning-contents/1000
   - **注意**: 学習内容ID=1000を使用してください
2. 5秒間待機してください
3. セクション一覧が表示されていることを`browser_snapshot`で確認
4. 確認できたら、フルページスクリーンショットを撮影
   - ファイル名: **desktop-learning-content-detail-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/desktop/

---

#### 3. 学習内容作成

**手順**:
1. ページに移動: http://localhost:8000/learning-contents/create
2. 5秒間待機してください
3. 「新しい学習内容の作成」の見出しが表示されていることを`browser_snapshot`で確認
4. 確認できたら、フルページスクリーンショットを撮影
   - ファイル名: **desktop-learning-content-create-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/desktop/

---

#### 4. 学習記録作成

**手順**:
1. ページに移動: http://localhost:8000/learning-contents/1000/sessions/create
2. 5秒間待機してください
3. 「学習記録の追加」の見出しが表示されていることを`browser_snapshot`で確認
4. 確認できたら、フルページスクリーンショットを撮影
   - ファイル名: **desktop-study-session-create-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/desktop/

---

#### 5. 全体レポート

**手順**:
1. ページに移動: http://localhost:8000/reports
2. 5秒間待機してください
3. 「学習レポート」の見出しまたは統計カードが表示されていることを`browser_snapshot`で確認
4. 確認できたら、フルページスクリーンショットを撮影
   - ファイル名: **desktop-reports-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/desktop/

---

#### 6. 個別レポート

**手順**:
1. ページに移動: http://localhost:8000/learning-contents/1000/progress
   - **注意**: 学習内容ID=1000を使用してください
2. 5秒間待機してください
3. 「個別レポート」の見出しまたは「日別学習時間」グラフが表示されていることを`browser_snapshot`で確認
4. 確認できたら、フルページスクリーンショットを撮影
   - ファイル名: **desktop-study-progress-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/desktop/

---

#### 7. セクション別記録

**手順**:
1. ページに移動: http://localhost:8000/sections/86/sessions
   - **注意**: セクションID=86は学習記録が複数件存在するため確認に最適です
2. 5秒間待機してください
3. 「学習記録一覧」または「このセクションに記録を追加」ボタンが表示されていることを`browser_snapshot`で確認
4. 確認できたら、フルページスクリーンショットを撮影
   - ファイル名: **desktop-section-records-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/desktop/

---

#### 8. プロフィール

**手順**:
1. ページに移動: http://localhost:8000/profile
2. 5秒間待機してください
3. 「プロフィール」の見出しまたはユーザー情報が表示されていることを`browser_snapshot`で確認
4. 確認できたら、フルページスクリーンショットを撮影
   - ファイル名: **desktop-profile-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/desktop/

---

## 📱 Phase 2: モバイルサイズでの撮影

### ステップ0: ウィンドウサイズ変更

**デスクトップ撮影完了後に実行**:
- `browser_resize`ツールを使用
- 幅: 375ピクセル
- 高さ: 667ピクセル

### 撮影対象ページと手順

Phase 1と同じ8ページを、同じ手順で撮影します。
**ファイル名と保存先のみが異なります**：

#### 撮影対象一覧

1. **ダッシュボード**
   - ファイル名: **mobile-dashboard-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/mobile/

2. **学習内容詳細**
   - ファイル名: **mobile-learning-content-detail-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/mobile/

3. **学習内容作成**
   - ファイル名: **mobile-learning-content-create-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/mobile/

4. **学習記録作成**
   - ファイル名: **mobile-study-session-create-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/mobile/

5. **全体レポート**
   - ファイル名: **mobile-reports-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/mobile/

6. **個別レポート**
   - ファイル名: **mobile-study-progress-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/mobile/

7. **セクション別記録**
   - ファイル名: **mobile-section-records-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/mobile/

8. **プロフィール**
   - ファイル名: **mobile-profile-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/mobile/

---

## ⚙️ 重要な注意事項

- **必ず5秒間待機してください**（Vue.jsのレンダリングに時間がかかるため）
- スクリーンショット前に`browser_snapshot`でコンテンツの存在を確認してください
- もし白い画面が表示された場合は、さらに3秒待機してから再度スクリーンショットを撮影してください
- **ウィンドウサイズの変更は各Phaseの最初に1回だけ**実行してください

---

## ✅ 完了確認

### 生成されるファイル一覧

**デスクトップ（8枚）**:
- desktop-dashboard-BEFORE.png
- desktop-learning-content-detail-BEFORE.png
- desktop-learning-content-create-BEFORE.png
- desktop-study-session-create-BEFORE.png
- desktop-reports-BEFORE.png
- desktop-study-progress-BEFORE.png
- desktop-section-records-BEFORE.png
- desktop-profile-BEFORE.png

**モバイル（8枚）**:
- mobile-dashboard-BEFORE.png
- mobile-learning-content-detail-BEFORE.png
- mobile-learning-content-create-BEFORE.png
- mobile-study-session-create-BEFORE.png
- mobile-reports-BEFORE.png
- mobile-study-progress-BEFORE.png
- mobile-section-records-BEFORE.png
- mobile-profile-BEFORE.png

**合計**: 16枚のスクリーンショット

撮影完了後、ファイル名とパスを報告してください。
```

### 2-2. 学習内容作成（マルチウィザード形式）

学習内容作成はマルチウィザード形式なので専用プロンプトをつかう必要があります

- 変更が必要な箇所
    - `<YYYY-MM-DD>` → 例：2025-10-16

```markdown
#### 3. 学習内容作成（マルチウィザード形式）

**⚠️ 重要**: この画面は3ステップのウィザード形式です。各ステップで個別にスクリーンショットを撮影してください。

---

## 🖥️ デスクトップ版（1280×800）

### ステップ0: ウィンドウサイズ設定

**最初に一度だけ実行**:
- `browser_resize`ツールを使用
- 幅: 1280ピクセル
- 高さ: 800ピクセル

---

### ステップ1: 基本情報（入力完了後の状態を撮影）

**手順**:
1. ページに移動: http://localhost:8000/learning-contents/create
2. 5秒間待機してください
3. 「新しい学習内容の作成」の見出しとステップインジケーター（●━━━━○━━━━○）が表示されていることを`browser_snapshot`で確認

4. **技術選択ドロップダウンをクリック**
   - セレクタ: `button` で「技術を選択してください」というテキストを含むボタン
   - クリック後、1秒待機

5. **技術を選択**
   - リスト内の最初の技術（例: Laravel）をクリック
   - クリック後、1秒待機

6. **タイトルを入力**
   - `browser_fill_form`ツールを使用
   - フィールド: `#title`
   - 値: "Playwright MCPテスト"

7. **概要を入力（任意）**
   - `browser_fill_form`ツールを使用
   - フィールド: `#description`
   - 値: "Playwright MCPによる自動テスト"

8. **入力完了後、1秒待機**

9. **スクリーンショット撮影**（入力完了後の状態）
   - ファイル名: **desktop-learning-content-create-step1-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/desktop/

---

### ステップ2: セクション設定（入力完了後の状態を撮影）

**手順**:
1. **次へボタンをクリック**
   - ボタンのテキスト: "次へ"
   - クリック後、3秒待機（ウィザードのアニメーション完了を待つ）

2. **ステップインジケーターを確認**
   - ステップ2が強調表示されている（✓━━━●━━━○）ことを`browser_snapshot`で確認

3. **セクションタイトルを入力**
   - `browser_fill_form`ツールを使用
   - フィールド: `#section-title-0`
   - 値: "セクションテスト"

4. **入力完了後、1秒待機**

5. **スクリーンショット撮影**（入力完了後の状態）
   - ファイル名: **desktop-learning-content-create-step2-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/desktop/

---

### ステップ3: 確認画面

**手順**:
1. **次へボタンをクリック**
   - ボタンのテキスト: "次へ"
   - クリック後、3秒待機（ウィザードのアニメーション完了を待つ）

2. **確認画面を確認**
   - 「基本情報」と「セクション」のサマリーが表示されていることを`browser_snapshot`で確認
   - ステップインジケーターがステップ3（✓━━━✓━━━●）になっていることを確認
   - 入力した内容（技術: Laravel、タイトル: Playwright MCPテスト、セクション: セクションテスト）が表示されていることを確認

3. **スクリーンショット撮影**
   - ファイル名: **desktop-learning-content-create-step3-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/desktop/

---

## 📱 モバイル版（375×667）

### ステップ0: ウィンドウサイズ変更

**デスクトップ撮影完了後に実行**:
- `browser_resize`ツールを使用
- 幅: 375ピクセル
- 高さ: 667ピクセル

---

### ステップ1: 基本情報（入力完了後の状態を撮影）

**手順**:
1. ページに移動: http://localhost:8000/learning-contents/create
2. 5秒間待機してください
3. 「新しい学習内容の作成」の見出しとステップインジケーター（●━━━━○━━━━○）が表示されていることを`browser_snapshot`で確認

4. **技術選択ドロップダウンをクリック**
   - セレクタ: `button` で「技術を選択してください」というテキストを含むボタン
   - クリック後、1秒待機

5. **技術を選択**
   - リスト内の最初の技術（例: Laravel）をクリック
   - クリック後、1秒待機

6. **タイトルを入力**
   - `browser_fill_form`ツールを使用
   - フィールド: `#title`
   - 値: "Playwright MCPテスト"

7. **概要を入力（任意）**
   - `browser_fill_form`ツールを使用
   - フィールド: `#description`
   - 値: "Playwright MCPによる自動テスト"

8. **入力完了後、1秒待機**

9. **スクリーンショット撮影**（入力完了後の状態）
   - ファイル名: **mobile-learning-content-create-step1-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/mobile/

---

### ステップ2: セクション設定（入力完了後の状態を撮影）

**手順**:
1. **次へボタンをクリック**
   - ボタンのテキスト: "次へ"
   - クリック後、3秒待機（ウィザードのアニメーション完了を待つ）

2. **ステップインジケーターを確認**
   - ステップ2が強調表示されている（✓━━━●━━━○）ことを`browser_snapshot`で確認

3. **セクションタイトルを入力**
   - `browser_fill_form`ツールを使用
   - フィールド: `#section-title-0`
   - 値: "セクションテスト"

4. **入力完了後、1秒待機**

5. **スクリーンショット撮影**（入力完了後の状態）
   - ファイル名: **mobile-learning-content-create-step2-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/mobile/

---

### ステップ3: 確認画面

**手順**:
1. **次へボタンをクリック**
   - ボタンのテキスト: "次へ"
   - クリック後、3秒待機（ウィザードのアニメーション完了を待つ）

2. **確認画面を確認**
   - 「基本情報」と「セクション」のサマリーが表示されていることを`browser_snapshot`で確認
   - ステップインジケーターがステップ3（✓━━━✓━━━●）になっていることを確認
   - 入力した内容（技術: Laravel、タイトル: Playwright MCPテスト、セクション: セクションテスト）が表示されていることを確認

3. **スクリーンショット撮影**
   - ファイル名: **mobile-learning-content-create-step3-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/mobile/

---

## ✅ 完了確認

### 生成されるファイル一覧

**デスクトップ（3枚）**:
- desktop-learning-content-create-step1-BEFORE.png（基本情報入力完了後）
- desktop-learning-content-create-step2-BEFORE.png（セクション設定入力完了後）
- desktop-learning-content-create-step3-BEFORE.png（確認画面）

**モバイル（3枚）**:
- mobile-learning-content-create-step1-BEFORE.png（基本情報入力完了後）
- mobile-learning-content-create-step2-BEFORE.png（セクション設定入力完了後）
- mobile-learning-content-create-step3-BEFORE.png（確認画面）

**合計**: 6枚のスクリーンショット

撮影完了後、ファイル名とパスを報告してください。

---
```

### 2-3. 学習内容編集（マルチウィザード形式）

学習内容編集はマルチウィザード形式なので専用プロンプトをつかう必要があります

理想的には各ステップでフォームを変更後の「ステップ3: 確認画面」のスクリーンショットを撮影すべきですが(確認画面の内容が変化するため)、時間的制約から省略します

- 変更が必要な箇所
    - `<YYYY-MM-DD>` → 例：2025-10-16

```markdown
**⚠️ 重要**: この画面は3ステップのウィザード形式です。各ステップで個別にスクリーンショットを撮影してください。

---

## 🖥️ デスクトップ版（1280×800）

### ステップ0: ウィンドウサイズ設定

**最初に一度だけ実行**:
- `browser_resize`ツールを使用
- 幅: 1280ピクセル
- 高さ: 800ピクセル

---

### ステップ1: 基本情報（入力完了後の状態を撮影）

**手順**:
1. ページに移動: http://localhost:8000/learning/1000/edit
2. 5秒間待機してください
3. 「新しい学習内容の作成」の見出しとステップインジケーター（●━━━━○━━━━○）が表示されていることを`browser_snapshot`で確認

4. **スクリーンショット撮影**（入力完了後の状態）
   - ファイル名: **desktop-learning-content-edit-step1-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/desktop/

---

### ステップ2: セクション設定（入力完了後の状態を撮影）

**手順**:
1. **次へボタンをクリック**
   - ボタンのテキスト: "次へ"
   - クリック後、3秒待機（ウィザードのアニメーション完了を待つ）

2. **ステップインジケーターを確認**
   - ステップ2が強調表示されている（✓━━━●━━━○）ことを`browser_snapshot`で確認

3. **スクリーンショット撮影**（入力完了後の状態）
   - ファイル名: **desktop-learning-content-edit-step2-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/desktop/

---

### ステップ3: 確認画面

**手順**:
1. **次へボタンをクリック**
   - ボタンのテキスト: "次へ"
   - クリック後、3秒待機（ウィザードのアニメーション完了を待つ）

2. **確認画面を確認**
   - 「基本情報」と「セクション」のサマリーが「変更点がありません」と表示されていることを`browser_snapshot`で確認
   - ステップインジケーターがステップ3（✓━━━✓━━━●）になっていることを確認

3. **スクリーンショット撮影**
   - ファイル名: **desktop-learning-content-edit-step3-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/desktop/

---

## 📱 モバイル版（375×667）

### ステップ0: ウィンドウサイズ変更

**デスクトップ撮影完了後に実行**:
- `browser_resize`ツールを使用
- 幅: 375ピクセル
- 高さ: 667ピクセル

---

### ステップ1: 基本情報（入力完了後の状態を撮影）

**手順**:
1. ページに移動: http://localhost:8000/learning/1000/edit
2. 5秒間待機してください
3. 「新しい学習内容の作成」の見出しとステップインジケーター（●━━━━○━━━━○）が表示されていることを`browser_snapshot`で確認

4. **スクリーンショット撮影**（入力完了後の状態）
   - ファイル名: **mobile-learning-content-edit-step1-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/mobile/

---

### ステップ2: セクション設定（入力完了後の状態を撮影）

**手順**:
1. **次へボタンをクリック**
   - ボタンのテキスト: "次へ"
   - クリック後、3秒待機（ウィザードのアニメーション完了を待つ）

2. **ステップインジケーターを確認**
   - ステップ2が強調表示されている（✓━━━●━━━○）ことを`browser_snapshot`で確認

3. **スクリーンショット撮影**（入力完了後の状態）
   - ファイル名: **mobile-learning-content-edit-step2-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/mobile/

---

### ステップ3: 確認画面

**手順**:
1. **次へボタンをクリック**
   - ボタンのテキスト: "次へ"
   - クリック後、3秒待機（ウィザードのアニメーション完了を待つ）

2. **確認画面を確認**
   - 「基本情報」と「セクション」のサマリーが「変更点がありません」と表示されていることを`browser_snapshot`で確認
   - ステップインジケーターがステップ3（✓━━━✓━━━●）になっていることを確認

3. **スクリーンショット撮影**
   - ファイル名: **mobile-learning-content-edit-step3-BEFORE.png**
   - 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/mobile/

---

## ✅ 完了確認

### 生成されるファイル一覧

**デスクトップ（3枚）**:
- desktop-learning-content-edit-step1-BEFORE.png（基本情報入力完了後）
- desktop-learning-content-edit-step2-BEFORE.png（セクション設定入力完了後）
- desktop-learning-content-edit-step3-BEFORE.png（確認画面）

**モバイル（3枚）**:
- mobile-learning-content-edit-step1-BEFORE.png（基本情報入力完了後）
- mobile-learning-content-edit-step2-BEFORE.png（セクション設定入力完了後）
- mobile-learning-content-edit-step3-BEFORE.png（確認画面）

**合計**: 6枚のスクリーンショット

撮影完了後、ファイル名とパスを報告してください。

---
```

### 2-4. Phase 2全画面一括撮影用

Phase 2の8画面すべてを一度に撮影する際に使用します。

- 変更が必要な箇所
    - [`<page-name>`](https://www.notion.so/Playwright-MCP-2809d86c12e88042bc4ce592287e1c46?pvs=21)  → 例：dashboard
    - `<YYYY-MM-DD>` → 例：2025-10-16

```markdown
現在のブラウザでログイン状態を維持したまま、以下の手順でスクリーンショットを撮影してください。

---

## 📱 撮影設定

### デバイスサイズ

以下の各サイズで、全8画面のスクリーンショットを撮影します：

1. **デスクトップ**: 1280×800
   - ファイル名プレフィックス: `desktop-`

2. **モバイル**: 375×667
   - ファイル名プレフィックス: `mobile-`

### 撮影の流れ

1. デスクトップサイズ（1280×800）に設定
2. 全8ページを撮影
3. モバイルサイズ（375×667）に設定
4. 全8ページを撮影

**合計16枚のスクリーンショット**が生成されます。

---

## 🖥️ Phase 1: デスクトップサイズでの撮影

### ステップ0: ウィンドウサイズ設定

**最初に一度だけ実行**:
- `browser_resize`ツールを使用
- 幅: 1280ピクセル
- 高さ: 800ピクセル

### 撮影対象ページと手順

**重要**: 各ページで必ず以下の順序で実行してください：
1. ページに移動
2. 5秒間待機（SPAのレンダリング完了を待つ）
3. 対象要素が表示されていることを確認
4. スクリーンショット撮影

---

#### 1. ダッシュボード

**手順**:
1. ページに移動: http://localhost:8000/dashboard
2. 5秒間待機してください
3. 「学習ダッシュボード」の見出しまたは学習カードが表示されていることを`browser_snapshot`で確認
4. 確認できたら、フルページスクリーンショットを撮影
   - ファイル名: **desktop-dashboard.png**
   - 保存先: .playwright-mcp/phase2-responsive/2025-10-16/desktop/

---

#### 2. 学習内容詳細

**手順**:
1. ページに移動: http://localhost:8000/learning-contents/1000
   - **注意**: 学習内容ID=1000を使用してください
2. 5秒間待機してください
3. セクション一覧が表示されていることを`browser_snapshot`で確認
4. 確認できたら、フルページスクリーンショットを撮影
   - ファイル名: **desktop-learning-content-detail.png**
   - 保存先: .playwright-mcp/phase2-responsive/2025-10-16/desktop/

---

#### 3. 学習内容作成

**手順**:
1. ページに移動: http://localhost:8000/learning-contents/create
2. 5秒間待機してください
3. 「新しい学習内容の作成」の見出しが表示されていることを`browser_snapshot`で確認
4. 確認できたら、フルページスクリーンショットを撮影
   - ファイル名: **desktop-learning-content-create.png**
   - 保存先: .playwright-mcp/phase2-responsive/2025-10-16/desktop/

---

#### 4. 学習記録作成

**手順**:
1. ページに移動: http://localhost:8000/learning-contents/1000/sessions/create
2. 5秒間待機してください
3. 「学習記録の追加」の見出しが表示されていることを`browser_snapshot`で確認
4. 確認できたら、フルページスクリーンショットを撮影
   - ファイル名: **desktop-study-session-create.png**
   - 保存先: .playwright-mcp/phase2-responsive/2025-10-16/desktop/

---

#### 5. 全体レポート

**手順**:
1. ページに移動: http://localhost:8000/reports
2. 5秒間待機してください
3. 「学習レポート」の見出しまたは統計カードが表示されていることを`browser_snapshot`で確認
4. 確認できたら、フルページスクリーンショットを撮影
   - ファイル名: **desktop-reports.png**
   - 保存先: .playwright-mcp/phase2-responsive/2025-10-16/desktop/

---

#### 6. 個別レポート

**手順**:
1. ページに移動: http://localhost:8000/learning-contents/1000/progress
   - **注意**: 学習内容ID=1000を使用してください
2. 5秒間待機してください
3. 「個別レポート」の見出しまたは「日別学習時間」グラフが表示されていることを`browser_snapshot`で確認
4. 確認できたら、フルページスクリーンショットを撮影
   - ファイル名: **desktop-study-progress.png**
   - 保存先: .playwright-mcp/phase2-responsive/2025-10-16/desktop/

---

#### 7. セクション別記録

**手順**:
1. ページに移動: http://localhost:8000/sections/86/sessions
   - **注意**: セクションID=86は学習記録が複数件存在するため確認に最適です
2. 5秒間待機してください
3. 「学習記録一覧」または「このセクションに記録を追加」ボタンが表示されていることを`browser_snapshot`で確認
4. 確認できたら、フルページスクリーンショットを撮影
   - ファイル名: **desktop-section-records.png**
   - 保存先: .playwright-mcp/phase2-responsive/2025-10-16/desktop/

---

#### 8. プロフィール

**手順**:
1. ページに移動: http://localhost:8000/profile
2. 5秒間待機してください
3. 「プロフィール」の見出しまたはユーザー情報が表示されていることを`browser_snapshot`で確認
4. 確認できたら、フルページスクリーンショットを撮影
   - ファイル名: **desktop-profile.png**
   - 保存先: .playwright-mcp/phase2-responsive/2025-10-16/desktop/

#### ９. プロフィール編集

**手順**:
1. ページに移動: http://localhost:8000/profile/edit
2. 5秒間待機してください
3. 「プロフィール」の見出しまたはユーザー情報が表示されていることを`browser_snapshot`で確認
4. 確認できたら、フルページスクリーンショットを撮影
   - ファイル名: **desktop-profile-edit.png**
   - 保存先: .playwright-mcp/phase2-responsive/2025-10-16/desktop/

---

## 📱 Phase 2: モバイルサイズでの撮影

### ステップ0: ウィンドウサイズ変更

**デスクトップ撮影完了後に実行**:
- `browser_resize`ツールを使用
- 幅: 375ピクセル
- 高さ: 667ピクセル

### 撮影対象ページと手順

Phase 1と同じ8ページを、同じ手順で撮影します。
**ファイル名と保存先のみが異なります**：

#### 撮影対象一覧

1. **ダッシュボード**
   - ファイル名: **mobile-dashboard.png**
   - 保存先: .playwright-mcp/phase2-responsive/2025-10-16/mobile/

2. **学習内容詳細**
   - ファイル名: **mobile-learning-content-detail.png**
   - 保存先: .playwright-mcp/phase2-responsive/2025-10-16/mobile/

3. **学習内容作成**
   - ファイル名: **mobile-learning-content-create.png**
   - 保存先: .playwright-mcp/phase2-responsive/2025-10-16/mobile/

4. **学習記録作成**
   - ファイル名: **mobile-study-session-create.png**
   - 保存先: .playwright-mcp/phase2-responsive/2025-10-16/mobile/

5. **全体レポート**
   - ファイル名: **mobile-reports.png**
   - 保存先: .playwright-mcp/phase2-responsive/2025-10-16/mobile/

6. **個別レポート**
   - ファイル名: **mobile-study-progress.png**
   - 保存先: .playwright-mcp/phase2-responsive/2025-10-16/mobile/

7. **セクション別記録**
   - ファイル名: **mobile-section-records.png**
   - 保存先: .playwright-mcp/phase2-responsive/2025-10-16/mobile/

8. **プロフィール**
   - ファイル名: **mobile-profile.png**
   - 保存先: .playwright-mcp/phase2-responsive/2025-10-16/mobile/

9. **プロフィール編集**
   - ファイル名: **mobile-profile-edit.png**
   - 保存先: .playwright-mcp/phase2-responsive/2025-10-16/mobile/

---

## ⚙️ 重要な注意事項

- **必ず5秒間待機してください**（Vue.jsのレンダリングに時間がかかるため）
- スクリーンショット前に`browser_snapshot`でコンテンツの存在を確認してください
- もし白い画面が表示された場合は、さらに3秒待機してから再度スクリーンショットを撮影してください
- **ウィンドウサイズの変更は各Phaseの最初に1回だけ**実行してください

---

## ✅ 完了確認

### 生成されるファイル一覧

**デスクトップ（8枚）**:
- desktop-dashboard.png
- desktop-learning-content-detail.png
- desktop-learning-content-create.png
- desktop-study-session-create.png
- desktop-reports.png
- desktop-study-progress.png
- desktop-section-records.png
- desktop-profile.png

**モバイル（8枚）**:
- mobile-dashboard.png
- mobile-learning-content-detail.png
- mobile-learning-content-create.png
- mobile-study-session-create.png
- mobile-reports.png
- mobile-study-progress.png
- mobile-section-records.png
- mobile-profile.png

**合計**: 16枚のスクリーンショット

撮影完了後、ファイル名とパスを報告してください。
```

### 2-5. ファイル管理構造

スクリーンショットは以下の構造で保存されます：

```bash
.playwright-mcp/
└── phase2-responsive/
    └── 2025-10-16/          # 撮影日付（YYYY-MM-DD）
        ├── desktop/
        │   ├── desktop-dashboard-BEFORE.png
        │   ├── desktop-learning-content-detail-BEFORE.png
        │   ├── desktop-learning-content-create-BEFORE.png
        │   ├── desktop-learning-content-edit-BEFORE.png
        │   ├── desktop-study-session-create-BEFORE.png
        │   ├── desktop-study-session-edit-BEFORE.png
        │   ├── desktop-study-progress-BEFORE.png
        │   ├── desktop-reports-BEFORE.png
        │   ├── desktop-section-records-BEFORE.png
        │   └── desktop-profile-BEFORE.png
        ├── mobile/
        │   ├── mobile-dashboard-BEFORE.png
        │   ├── mobile-learning-content-detail-BEFORE.png
        │   ├── mobile-learning-content-create-BEFORE.png
        │   ├── mobile-learning-content-edit-BEFORE.png
        │   ├── mobile-study-session-create-BEFORE.png
        │   ├── mobile-study-session-edit-BEFORE.png
        │   ├── mobile-study-progress-BEFORE.png
        │   ├── mobile-reports-BEFORE.png
        │   ├── mobile-section-records-BEFORE.png
        │   └── mobile-profile-BEFORE.png
        │   └── mobile-profile-edit-BEFORE.png
        └── analysis/
            └── gemini-report.md  # Gemini CLIの分析結果
```

---

## 3. レイアウト問題分析プロンプト

スクリーンショットを基にレイアウトの問題を~~Gemini CLI~~に分析してもらいます

- Flash 2.5では分析力に限界があるため、ProまたはClaude（推奨）への依頼を推奨します
- Claudeを使用する場合は、スクリーンショットの添付とVueファイルをコンテキストに含める必要があります

```markdown
添付画像を見て、レイアウトの問題を分析してください。

### スクリーンショット
- `.playwright-mcp/phase2-responsive/[dir_name]/[device]/[filename].png`

---

## チェック項目

### 1. テキスト表示
- [ ] 長文が適切に折り返されているか
- [ ] テキストが要素からはみ出していないか
- [ ] 改行が正しく表示されているか
- [ ] フォントサイズは適切か

### 2. 要素の配置
- [ ] ボタンやアイコンが見える位置にあるか
- [ ] 要素同士が重なっていないか
- [ ] 要素が意図しない位置に落ちていないか
- [ ] 余白は適切か

### 3. レスポンシブ対応
- [ ] カード内の要素が適切に収まっているか
- [ ] 横幅が制限されすぎていないか
- [ ] 縦方向のスペースは適切か

### 4. 視覚的な区別
- [ ] 異なる情報が明確に区別できるか
- [ ] 背景色やボーダーは適切か
- [ ] 重要な情報が目立っているか

### 5. ユーザビリティ
- [ ] クリック可能な要素が明確か
- [ ] 情報の優先順位が視覚的に表現されているか
- [ ] スクロールなしで重要情報が見えるか

### 6. TailwindCSS レスポンシブクラスの妥当性
- [ ] 現在のブレークポイントクラス（md:, lg:）は適切か
- [ ] hidden/block の切り替えは意図通りか
- [ ] flex の方向（flex-col/flex-row）は適切か
- [ ] グリッドのカラム数は適切か

### 7. タッチ操作への配慮（モバイルのみ）
- [ ] ボタンのタップエリアは十分か（44×44px以上推奨）
- [ ] スワイプ/スクロール領域は明確か
- [ ] ホバー効果に依存していないか

### 8. パフォーマンス
- [ ] 画像の読み込みは適切か
- [ ] 不要な要素が非表示になっているか

### 9. Phase 2 特有の確認（レスポンシブ対応）
- [ ] ハンバーガーメニューは適切に表示されているか（モバイルのみ）
- [ ] サイドバーは適切に非表示/表示されているか
- [ ] カードのカラム数は適切か（デスクトップ: 2-3列、モバイル: 1列）
- [ ] ページネーションの表示数は適切か（デスクトップ: 5個、モバイル: 3個）
- [ ] フォームの幅は適切か（モバイル: フル幅、デスクトップ: max-w-2xl等）

### 10. 個人的に気になった点
- <ここに記入>

<Claudeに依頼する場合は以下を追加>
### 実装時の制約（Phase 2方針）
- TailwindCSS のみ使用（カスタムCSSは最小限）
- 2サイズ戦略（モバイル vs デスクトップ、md:プレフィックスのみ）
- sm:プレフィックスは使用しない
- タブレット専用調整はしない
- 既存のコンポーネント構造を維持
- Composition API パターンを踏襲
- タッチ操作への配慮（ボタン最低44×44px）

---

## 報告形式

以下の形式で報告してください：

### 発見した問題
1. **問題のカテゴリ**：具体的な問題の説明
2. **問題のカテゴリ**：具体的な問題の説明

### 影響度
- 致命的：使用に支障がある
- 高：ユーザー体験を大きく損なう
- 中：改善が望ましい
- 低：軽微な問題

### 推奨される対応
問題を解決するために必要な変更を簡潔に説明してください。

---

分析を開始してください。
```

### 使用例

**シンプルな依頼（BEFORE）**:

```markdown
添付: desktop-dashboard.png

この画像のレイアウト問題を分析してください。
```

**詳細な依頼（AFTER）**:

```markdown
添付: desktop-dashboard.png

[上記の汎用プロンプトを貼り付け]
```

### 期待される出力例

```markdown
### 発見した問題
1. **要素の配置**：学習カードが3カラムで表示されているが、1280px幅では窮屈に見える
2. **レスポンシブ対応**：md:grid-cols-3ではなく、md:grid-cols-2 lg:grid-cols-3が適切
3. **Phase 2 特有の確認**：ハンバーガーメニューがデスクトップサイズで表示されている（モバイル専用にすべき）

### 影響度
- 高：カードの窮屈さがユーザー体験を損なう（中）
- 高：ハンバーガーメニューの誤表示（高）

### 推奨される対応
- カードグリッドを `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` に変更
- ハンバーガーメニューを `block md:hidden` に変更
- サイドバーを `hidden md:block` に変更
```

---

## 4. Claude への引き継ぎテンプレート

Gemini CLIの分析完了後、Claudeに修正を依頼する際のテンプレート：

```markdown
## レイアウト修正依頼

### 対象ページ
- ファイルパス: resources/js/views/[path]/[filename].vue
- ルート: [例: /dashboard, /reports]
- デバイスサイズ: [モバイル/デスクトップ/両方]

### Gemini CLIの分析結果
[Gemini CLIの出力をコピペ]

### 現在のコード
```vue
<該当コードを貼り付け>
```

### 関連コンポーネント
- [例: components/common/Pagination.vue]
- [例: components/learning/LearningContentCard.vue]

### 実装時の制約（Phase 2方針）
- TailwindCSS のみ使用（カスタムCSSは最小限）
- 2サイズ戦略（モバイル vs デスクトップ、md:プレフィックスのみ）
- sm:プレフィックスは使用しない
- タブレット専用調整はしない
- 既存のコンポーネント構造を維持
- Composition API パターンを踏襲
- タッチ操作への配慮（ボタン最低44×44px）

### 期待する対応
上記の問題を修正してください。

### 検証方法
修正後、以下のサイズで再度スクリーンショット撮影して確認：
- 375×667（モバイル）
- 1280×800（デスクトップ）
```

---

## 5. 修正後の確認プロンプト

修正完了後、BEFORE/AFTER比較用のスクリーンショットを撮影します

```markdown
## BEFORE/AFTER 比較撮影

### デスクトップ（1280×800）
1. ブラウザサイズ: 1280×800
2. ページ移動: <URL>
3. 5秒待機
4. スクリーンショット撮影: `desktop-<page-name>-AFTER.png`
5. 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/AFTER/desktop/

### モバイル（375×667）
1. ブラウザサイズ: 375×667
2. ページ移動: [URL]
3. 5秒待機
4. スクリーンショット撮影: `mobile-<page-name>-AFTER.png`
5. 保存先: .playwright-mcp/phase2-responsive/<YYYY-MM-DD>/AFTER/mobile/
```

### Cloude版

```markdown
修正後のスクリーンショットとコードを提供します。
問題点が解決されているか確認していただけますでしょうか？

## 確認項目

**撮影した画像を見て以下を確認**:
- [ ] 指摘された問題が改善されているか
- [ ] 新たなレイアウト崩れが発生していないか
- [ ] モバイル/デスクトップ両方で適切に表示されているか
- [ ] タッチ操作可能な要素のサイズは十分か（モバイル）
- [ ] 以下の@apply適用が反映されているか

### @applyチェックリスト
#### h2
"mb-2 text-2xl font-bold text-slate-800"
"section-heade"

#### input
"block w-full px-3 py-2 mt-1 text-sm placeholder-gray-400 border rounded-md shadow-sm appearance-none focus:outline-none"
"form-input-base"

'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-violet-500 focus:ring-violet-500'
'form-input-error' : 'form-input-normal'

#### エラー表示
"p-4 mb-6 text-sm text-red-800 bg-red-100 border-l-4 border-red-500 rounded-md md:text-base"
"error-container"

#### フォームラベル
"block text-sm font-medium text-slate-700"
"form-label"

#### 文字数カウンター
"mt-1 text-xs"
"text-counter"
'text-red-500 font-medium' : 'text-gray-500'
'text-counter-over' : ''

- ファイルパス
```vue
<該当コードを貼り付け>
```

確認結果を報告してください。
```

### GeminCLI版

```markdown
修正完了後、以下を厳密に実行してください：

## 確認項目

**撮影した画像を見て以下を確認**:
- [ ] 指摘された問題が改善されているか
- [ ] 新たなレイアウト崩れが発生していないか
- [ ] モバイル/デスクトップ両方で適切に表示されているか
- [ ] タッチ操作可能な要素のサイズは十分か（モバイル）

- ファイルパス

確認結果を報告してください。
```

---
