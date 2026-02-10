<?php

namespace App\Services\User;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AvatarService
{
    /**
     * プロフィール画像をアップロード
     * @param UploadedFile $file
     * @param mixed $user
     * @return string
     */
    public function upload(UploadedFile $file, $user): string
    {
        // マジックバイト検証
        $this->validateImageMimeType($file);

        // 既存プロフィール画像削除
        if ($user->getRawOriginal('avatar')) {
            Storage::disk('public')->delete('images/avatars/' . $user->getRawOriginal('avatar'));
        }

        // 保存
        $filename = $file->hashName();
        $file->storeAs('images/avatars', $filename, 'public');

        // DB更新
        $user->update(['avatar' => $filename]);

        return $user->avatar;
    }

    /**
     * MIMEタイプ検証
     * @param UploadedFile $file
     * @return void
     */
    private function validateImageMimeType(UploadedFile $file): void
    {
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        // ファイルの実データを読み込み、MIMEタイプを取得
        $mimeType = $finfo->file($file->getPathname());

        $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (!in_array($mimeType, $allowedTypes)) {
            throw ValidationException::withMessages([
                'avatar' => ['不正なファイル形式です'],
            ]);
        }
    }
}
