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
     *
     * 認証済みユーザーは全員が学習内容の一覧を閲覧可能
     * （個別の閲覧権限はview()メソッドで制御）
     *
     * @param User $user
     * @return boolean
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * ユーザーが指定されたモデルを閲覧できるか判定
     *
     * 認可：他ユーザーの学習内容の閲覧を防止
     *
     * @param User $user
     * @param LearningContent $learningContent
     * @return boolean
     */
    public function view(User $user, LearningContent $learningContent): bool
    {
        return $user->id === $learningContent->user_id;
    }

    /**
     * ユーザーがモデルを作成できるか判定
     *
     * 認証済みユーザーは全員が学習内容を作成可能
     *
     * @param User $user
     * @return boolean
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * ユーザーがモデルを更新できるか判定
     *
     * 認可：他ユーザーの学習内容の更新を防止
     *
     * @param User $user
     * @param LearningContent $learningContent
     * @return boolean
     */
    public function update(User $user, LearningContent $learningContent): bool
    {
        return $user->id === $learningContent->user_id;
    }

    /**
     * ユーザーがモデルを削除できるか判定
     *
     * 認可：他ユーザーの学習内容の削除を防止
     *
     * @param User $user
     * @param LearningContent $learningContent
     * @return boolean
     */
    public function delete(User $user, LearningContent $learningContent): bool
    {
        return $user->id === $learningContent->user_id;
    }

    /**
     * ユーザーがモデルを完了できるか判定
     *
     * 認可：他ユーザーの学習内容の完了を防止
     *
     * @param User $user
     * @param LearningContent $learningContent
     * @return boolean
     */
    public function complete(User $user, LearningContent $learningContent): bool
    {
        return $user->id === $learningContent->user_id;
    }

    /**
     * ユーザーがモデルを再開できるか判定
     *
     * 認可：他ユーザーの学習内容の再開を防止
     *
     * @param User $user
     * @param LearningContent $learningContent
     * @return boolean
     */
    public function reopen(User $user, LearningContent $learningContent): bool
    {
        return $user->id === $learningContent->user_id;
    }
}
