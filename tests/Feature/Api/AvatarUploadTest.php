<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AvatarUploadTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // テストで実際のストレージが変更されないよう、ストレージをフェイクに設定
        Storage::fake('public');
    }

    // ========================================
    // 正常系
    // ========================================

    /**
     * JPEG画像アップロード
     * @return void
     */
    public function test_user_can_upload_jpeg_avatar(): void
    {
        // ========================================
        // Arrange（準備）
        // ========================================
        $user = User::factory()->create();
        $path = base_path('tests/Fixtures/images/avatarUploadTest.jpg');
        $file = new UploadedFile($path, 'avatar.jpg', 'image/jpeg', null, true);

        // ========================================
        // Act（実行）
        // ========================================

        // POSTリクエストをJSON形式で送信
        /** @var User $user */
        $response = $this->actingAs($user) // ログイン状態を偽装
            ->postJson('/api/user/avatar', ['avatar' => $file]); // POSTリクエストをJSON形式で送信

        // ========================================
        // Assert（検証）
        // ========================================
        $response->assertStatus(200) // HTTPステータスが200であることを確認
            // レスポンスJSONに 'message' と 'avatar_url' キーが存在することを確認
            ->assertJsonStructure(['message', 'avatar_url']);

        // ファイルが指定パスに保存されていることを確認
        Storage::disk('public')->assertExists('images/avatars/' . $file->hashName());
    }

    /**
     * PNG画像アップロード
     * @return void
     */
    public function test_user_can_upload_png_avatar(): void
    {
        $user = User::factory()->create();
        $path = base_path('tests/Fixtures/images/avatarUploadTest.png');
        $file = new UploadedFile($path, 'avatar.png', 'image/png', null, true);

        /** @var User $user */
        $response = $this->actingAs($user)
            ->postJson('/api/user/avatar', ['avatar' => $file]);

        $response->assertStatus(200);
        Storage::disk('public')->assertExists('images/avatars/' . $file->hashName());
    }

    /**
     * WebP画像アップロード
     * @return void
     */
    public function test_user_can_upload_webp_avatar(): void
    {
        $user = User::factory()->create();

        // NOTE:実画像フィクスチャを使用必須（image()メソッドがWebP非対応のため）
        $path = base_path('tests/Fixtures/images/avatarUploadTest.webp');
        $file = new UploadedFile(
            $path,
            'avatar.webp',
            'image/webp',
            null,
            true  // テストモード
        );

        /** @var User $user */
        $response = $this->actingAs($user)
            ->postJson('/api/user/avatar', ['avatar' => $file]);

        $response->assertStatus(200);

        // ファイル保存の検証（必要に応じて）
        Storage::disk('public')->assertExists('images/avatars/' . $file->hashName());
    }

    /**
     * 既存画像の置換
     * @return void
     */
    public function test_existing_avatar_is_replaced(): void
    {
        // 事前にプロフィール画像設定済みのユーザーを作成
        $user = User::factory()->create(['avatar' => 'old-avatar.jpg']);

        // 削除対象の古いファイルを配置
        Storage::disk('public')->put('images/avatars/old-avatar.jpg', 'old content');

        // 置換
        $path = base_path('tests/Fixtures/images/avatarUploadTest.jpg');
        $newFile = new UploadedFile($path, 'avatar.jpg', 'image/jpeg', null, true);

        /** @var User $user */
        $response = $this->actingAs($user)
            ->postJson('/api/user/avatar', ['avatar' => $newFile]);

        $response->assertStatus(200);

        // 古いファイルが削除されていることを確認
        Storage::disk('public')->assertMissing('images/avatars/old-avatar.jpg');
        // 新しいファイルが存在することを確認
        Storage::disk('public')->assertExists('images/avatars/' . $newFile->hashName());
    }

    // ========================================
    // 異常系
    // ========================================

    /**
     * サイズ超過エラー
     * @return void
     */
    public function test_upload_fails_when_file_exceeds_size_limit(): void
    {
        $user = User::factory()->create();
        // 3MB のファイル（2MB制限を超過）
        $file = UploadedFile::fake()->image('large.jpg')->size(3072);

        /** @var User $user */
        $response = $this->actingAs($user)
            ->postJson('/api/user/avatar', ['avatar' => $file]);

        $response->assertStatus(422) // バリデーションエラー
            // レスポンスの errors.avatar にエラーメッセージがあることを確認
            ->assertJsonValidationErrors(['avatar']);
    }

    /**
     * 非対応形式エラー
     * @return void
     */
    public function test_upload_fails_with_unsupported_format(): void
    {
        $user = User::factory()->create();
        $path = base_path('tests/Fixtures/images/avatarUploadTest.gif');
        // GIF画像（許可: JPEG, PNG, WebP のみ）
        $file = new UploadedFile($path, 'avatar.gif', 'image/gif', null, true);

        /** @var User $user */
        $response = $this->actingAs($user)
            ->postJson('/api/user/avatar', ['avatar' => $file]);

        $response->assertStatus(422) // バリデーションエラー
            ->assertJsonValidationErrors(['avatar']);
    }

    /**
     * ファイルなしエラー
     * @return void
     */
    public function test_upload_fails_without_file(): void
    {
        $user = User::factory()->create();

        /** @var User $user */
        $response = $this->actingAs($user)
            ->postJson('/api/user/avatar', []);

        $response->assertStatus(422)
            // AvatarUploadRequest の 'required' ルールを検証
            ->assertJsonValidationErrors(['avatar']);
    }

    /**
     * 未認証エラー
     * @return void
     */
    public function test_upload_fails_for_unauthenticated_user(): void
    {
        $file = UploadedFile::fake()->image('avatar.jpg', 200, 200);
        // actingAs() を使わない = 未ログイン状
        $response = $this->postJson('/api/user/avatar', ['avatar' => $file]);

        $response->assertStatus(401); // Unauthorized
    }
}
