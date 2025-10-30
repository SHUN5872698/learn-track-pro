<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\ProfileRequest;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // ユーザー情報取得
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    // プロフィール更新
    public function profile(ProfileRequest $request)
    {
        $user = $request->user();
        $user->update($request->validated());

        return response()->json([
            'user' => $user,
            'message' => 'プロフィールを更新しました'
        ]);
    }
}
