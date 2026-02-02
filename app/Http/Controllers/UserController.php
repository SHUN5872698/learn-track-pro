<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\ProfileRequest;
use App\Http\Requests\User\AvatarUploadRequest;
use App\Services\User\AvatarService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * ログインユーザー情報を取得
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * プロフィール更新
     *
     * @param ProfileRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function profile(ProfileRequest $request)
    {
        $user = $request->user();
        // Fortify Action経由せず、直接Model更新
        $user->update($request->validated());

        return response()->json([
            'user' => $user,
            'message' => 'プロフィールを更新しました'
        ]);
    }

    /**
     * プロフィール画像アップロード
     *
     * @param AvatarUploadRequest $request
     * @param AvatarService $avatarService
     * @return \Illuminate\Http\JsonResponse
     */
    public function avatarUpload(AvatarUploadRequest $request, AvatarService $avatarService)
    {
        $user = $request->user();
        $avatarUrl = $avatarService->upload($request->file('avatar'), $user);

        return response()->json([
            'message' => 'プロフィール画像を更新しました',
            'avatar_url' => $avatarUrl,
        ]);
    }
}
