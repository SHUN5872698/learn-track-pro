<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLearningContentRequest;
use App\Http\Requests\UpdateLearningContentRequest;
use App\Http\Resources\LearningContentResource;
use App\Models\LearningContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class LearningContentController extends Controller
{
    /**
     * 学習コンテンツの一覧を取得
     *
     * @param Request $request
     * @return void
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        // N+1問題を回避するため、関連データを事前にロード
        $query = LearningContent::with(['technology.category', 'sections'])
            ->where('user_id', $user->id);

        return LearningContentResource::collection(
            $query->paginate($request->input('per_page', 20))
        );
    }

    /**
     * 新しい学習コンテンツを保存
     *
     * @param StoreLearningContentRequest $request
     * @return void
     */
    public function store(StoreLearningContentRequest $request)
    {
        $validated = $request->validated();
        $user = Auth::user();

        // 学習内容とセクションの同時作成をトランザクション化し、片方が失敗した場合に両方ロールバック
        $learningContent = DB::transaction(function () use ($validated, $user) {
            $content = $user->learningContents()->create([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'technology_id' => $validated['technology_id'],
                'total_sections' => count($validated['sections']),
                // フロントエンドの「すぐに学習を開始する」フラグでステータスを切り替え
                'status' => !empty($validated['startImmediately']) ? 'in_progress' : 'not_started',
            ]);

            // 学習内容作成時に初期セクションを同時作成
            foreach ($validated['sections'] as $index => $sectionData) {
                $content->sections()->create([
                    'title' => $sectionData['title'],
                    'order' => $index + 1,
                    'status' => 'not_started',
                ]);
            }

            return $content;
        });

        // APIレスポンスでN+1問題を回避するため、関連データを事前にロード
        $learningContent->load('technology.category', 'sections');

        return (new LearningContentResource($learningContent))
            ->additional(['message' => '学習内容を作成しました。'])
            ->response()
            ->setStatusCode(201);
    }

    /**
     * 指定された学習コンテンツの詳細を取得
     *
     * @param LearningContent $learningContent
     * @return void
     */
    public function show(LearningContent $learningContent)
    {
        // 認可：他ユーザーの学習内容へのアクセスを防止
        Gate::authorize('view', $learningContent);
        // N+1問題を回避するため、関連データを事前にロード
        $learningContent->load('technology.category', 'sections');

        return new LearningContentResource($learningContent);
    }

    /**
     * 指定された学習コンテンツを更新
     *
     * @param UpdateLearningContentRequest $request
     * @param LearningContent $learningContent
     * @return void
     */
    public function update(UpdateLearningContentRequest $request, LearningContent $learningContent)
    {
        // 認可：他ユーザーの学習内容の更新を防止
        Gate::authorize('update', $learningContent);
        $learningContent->update($request->validated());
        // APIレスポンスでN+1問題を回避するため、関連データを事前にロード
        $learningContent->load('technology.category');
        return (new LearningContentResource($learningContent))
            ->additional(['message' => '学習内容を更新しました。']);
    }

    /**
     * 指定された学習コンテンツを削除
     *
     * @param LearningContent $learningContent
     * @return void
     */
    public function destroy(LearningContent $learningContent)
    {
        // 認可：他ユーザーの学習内容の削除を防止
        Gate::authorize('delete', $learningContent);
        $learningContent->delete();
        return response()->json(['message' => '学習内容を削除しました。'], 200);
    }

    /**
     * 指定された学習コンテンツを完了状態にする
     *
     * @param LearningContent $learningContent
     * @return void
     */
    public function complete(LearningContent $learningContent)
    {
        // 認可：他ユーザーの学習内容の完了を防止
        Gate::authorize('complete', $learningContent);

        // ビジネスルール：全セクション完了が完了状態への遷移条件
        if ($learningContent->completed_sections < $learningContent->total_sections) {
            return response()->json(['message' => '全てのセクションが完了していません。'], 422);
        }

        $learningContent->update([
            'status' => 'completed',
            'completed_at' => now(), // 完了日時を記録（統計情報で使用）
        ]);

        // APIレスポンスでN+1問題を回避するため、関連データを事前にロード
        $learningContent->load('technology.category');
        return (new LearningContentResource($learningContent))
            ->additional(['message' => '学習内容を完了しました。']);
    }

    /**
     * 指定された学習コンテンツを再開状態にする
     *
     * @param LearningContent $learningContent
     * @return void
     */
    public function reopen(LearningContent $learningContent)
    {
        // 認可：他ユーザーの学習内容の再開を防止
        Gate::authorize('reopen', $learningContent);

        // ビジネスルール：完了状態からのみ再開可能（未着手や進行中からは再開できない）
        if ($learningContent->status !== 'completed') {
            return response()->json(['message' => '完了していない学習内容は再開できません。'], 422);
        }

        $learningContent->update([
            'status' => 'in_progress',
            'completed_at' => null, // 完了日時をクリア（再度完了時に更新される）
        ]);

        // APIレスポンスでN+1問題を回避するため、関連データを事前にロード
        $learningContent->load('technology.category');
        return (new LearningContentResource($learningContent))
            ->additional(['message' => '学習を再開しました。']);
    }
}
