<?php

namespace App\Policies;

use App\Models\LearningSession;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class LearningSessionPolicy
{
    use HandlesAuthorization;

    /**
     * ユーザーが任意のモデルを閲覧できるか判定
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * ユーザーが指定されたモデルを閲覧できるか判定
     */
    public function view(User $user, LearningSession $learningSession): bool
    {
        return $user->id === $learningSession->user_id;
    }

    /**
     * ユーザーがモデルを作成できるか判定
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * ユーザーがモデルを更新できるか判定
     */
    public function update(User $user, LearningSession $learningSession): bool
    {
        return $user->id === $learningSession->user_id;
    }

    /**
     * ユーザーがモデルを削除できるか判定
     */
    public function delete(User $user, LearningSession $learningSession): bool
    {
        return $user->id === $learningSession->user_id;
    }
}
