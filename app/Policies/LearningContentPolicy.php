<?php

namespace App\Policies;

use App\Models\LearningContent;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class LearningContentPolicy
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
    public function view(User $user, LearningContent $learningContent): bool
    {
        return $user->id === $learningContent->user_id;
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
    public function update(User $user, LearningContent $learningContent): bool
    {
        return $user->id === $learningContent->user_id;
    }

    /**
     * ユーザーがモデルを削除できるか判定
     */
    public function delete(User $user, LearningContent $learningContent): bool
    {
        return $user->id === $learningContent->user_id;
    }

    /**
     * ユーザーがモデルを完了できるか判定
     */
    public function complete(User $user, LearningContent $learningContent): bool
    {
        return $user->id === $learningContent->user_id;
    }

    /**
     * ユーザーがモデルを再開できるか判定
     */
    public function reopen(User $user, LearningContent $learningContent): bool
    {
        return $user->id === $learningContent->user_id;
    }
}
