## 概要

プロフィール画像（アバター）アップロード機能の Feature Test 仕様書。

テストファイル: `tests/Feature/Api/AvatarUploadTest.php`

---

## テストケース一覧

### 正常系（4件）

| No | テスト名 | 検証内容 |
| --- | --- | --- |
| 1 | `test_user_can_upload_jpeg_avatar` | JPEG画像のアップロード成功 |
| 2 | `test_user_can_upload_png_avatar` | PNG画像のアップロード成功 |
| 3 | `test_user_can_upload_webp_avatar` | WebP画像のアップロード成功 |
| 4 | `test_existing_avatar_is_replaced` | 既存プロフィール画像の置換・旧ファイル削除 |

### 異常系（4件）

| No | テスト名 | 検証内容 |
| --- | --- | --- |
| 5 | `test_upload_fails_when_file_exceeds_size_limit` | 2MB超過時に422エラー |
| 6 | `test_upload_fails_with_unsupported_format` | 非対応形式（GIF等）で422エラー |
| 7 | `test_upload_fails_without_file` | ファイルなしで422エラー |
| 8 | `test_upload_fails_for_unauthenticated_user` | 未認証時に401エラー |

<aside>
📌

**偽装拡張子テストについて**

- `AvatarService` は `finfo(FILEINFO_MIME_TYPE)` でマジックバイト検証を行い、悪意のあるスクリプト（PHP/JS等）を確実に弾く
- 画像間偽装は許可形式内のため実害がなく、テスト対象外

</aside>

---

## テスト用フィクスチャ

### 配置場所

```bash
tests/Fixtures/images/
├── avatarUploadTest.jpg   # 有効なJPEG画像（正常系）
├── avatarUploadTest.png   # 有効なPNG画像（正常系）
├── avatarUploadTest.webp  # 有効なWebP画像（正常系）
└── avatarUploadTest.gif   # 有効なGIF画像（異常系: 非対応形式）
```

### 使用方法

```php
// フィクスチャから実画像を読み込む
$path = base_path('tests/Fixtures/images/avatarUploadTest.webp');
$file = new \Illuminate\Http\UploadedFile(
    $path,
    'avatarUploadTest.webp',
    'image/webp',
    null,
    true // テストモード
);
```

<aside>
📌

**実画像フィクスチャを使用する理由**

- マジックバイト検証（`finfo(FILEINFO_MIME_TYPE)`）が実装されているため、正しいバイナリヘッダーを持つ実画像が必要
- `UploadedFile::fake()->create()` はランダムバイト列を生成するため、マジックバイト検証で弾かれる
- JPEG/PNGも `fake()->image()` ではなく実画像を使用することで、テストの一貫性を確保

</aside>

<aside>
⚠️

**リポジトリ除外ファイル**

- `avatarUploadOversized.jpg`（4MB）はリポジトリ肥大化防止のため `.gitignore` で除外
- サイズ超過テストは `fake()->create()` でモック生成（ファイルサイズのみ検証のため）

</aside>

---

## Laravelテストヘルパーの制限事項

### UploadedFile::fake()->image() の制限

| 形式 | 対応状況 | 備考 |
| --- | --- | --- |
| JPEG | ✅ 対応 | GD/Imagickで生成、正しいマジックバイトを持つ |
| PNG | ✅ 対応 | GD/Imagickで生成、正しいマジックバイトを持つ |
| GIF | ✅ 対応 | GD/Imagickで生成、正しいマジックバイトを持つ |
| **WebP** | ❌ **非対応** | `image()` メソッドでは生成不可 |

### UploadedFile::fake()->create() の制限

```php
// この方法では正しいマジックバイトを持たない
$file = UploadedFile::fake()->create('avatar.webp', 100, 'image/webp');
```

<aside>
🚫

**`create()` メソッドの制約**

- ランダムなバイト列でファイルを生成するため、正しいマジックバイトを持たない
- マジックバイト検証を行う `AvatarService` では「不正なファイル形式です」エラー（422）が発生する

</aside>

---

## AvatarServiceのマジックバイト検証

### 検証ロジック

```php
// AvatarService.php
private function validateMagicBytes(UploadedFile $file): bool
{
    $handle = fopen($file->getRealPath(), 'rb');
    $bytes = fread($handle, 12);
    fclose($handle);

    // JPEG: FF D8 FF
    // PNG: 89 50 4E 47 0D 0A 1A 0A
    // WebP: 52 49 46 46 ... 57 45 42 50 (RIFF...WEBP)
    
    return $this->matchesMagicBytes($bytes);
}
```

### マジックバイト一覧

| 形式 | マジックバイト（16進数） | 文字列表現 |
| --- | --- | --- |
| JPEG | `FF D8 FF` | - |
| PNG | `89 50 4E 47 0D 0A 1A 0A` | `.PNG....` |
| WebP | `52 49 46 46 ?? ?? ?? ?? 57 45 42 50` | `RIFF....WEBP` |

---

## 対処方法まとめ

### WebPテストの正しい実装

```php
/**
 * WebP画像アップロード
 * @return void
 */
public function test_user_can_upload_webp_avatar(): void
{
    $user = User::factory()->create();
    
    // ❌ NG: マジックバイトを持たない
    // $file = UploadedFile::fake()->create('avatar.webp', 100, 'image/webp');
    
    // ✅ OK: 実画像フィクスチャを使用
    $path = base_path('tests/Fixtures/images/avatarUploadTest.webp');
    $file = new UploadedFile($path, 'avatarUploadTest.webp', 'image/webp', null, true);

    $response = $this->actingAs($user)
        ->postJson('/api/user/avatar', ['avatar' => $file]);

    $response->assertStatus(200);
}
```

### フィクスチャ画像の準備方法

1. **最小サイズの画像を作成**（1x1px または 10x10px 程度）
2. **各形式で保存**: JPEG, PNG, WebP
3. **`tests/Fixtures/images/` に配置**

<aside>
💡

**フィクスチャ作成のヒント**

- ImageMagickの `convert` コマンドで簡単に作成できる

</aside>

コマンドサンプル

```bash
convert -size 10x10 xc:red tests/Fixtures/images/avatarUploadTest.jpg
convert -size 10x10 xc:red tests/Fixtures/images/avatarUploadTest.png
convert -size 10x10 xc:red tests/Fixtures/images/avatarUploadTest.webp
convert -size 10x10 xc:blue tests/Fixtures/images/avatarUploadTest.gif
```

---

## テスト結果

### PHPUnit Featureテスト（8ケース）

**正常系（4ケース）**

- [x]  JPEG画像のアップロード成功
- [x]  PNG画像のアップロード成功
- [x]  WebP画像のアップロード成功
- [x]  既存画像の置換成功

**異常系（4ケース）**

- [x]  サイズ超過（2MB超）でエラー
- [x]  非対応形式（GIF, BMP等）でエラー
- [x]  ファイルなしでエラー
- [x]  未認証ユーザーで401エラー

---

## 関連ドキュメント

- [認証・ユーザー関連API](https://www.notion.so/API-28a9d86c12e88029a8b0f5076ae4cd50?pvs=21)
- [認証機能手動テストリスト](https://www.notion.so/28a9d86c12e880be877fe9f3ad278ef4?pvs=21)
