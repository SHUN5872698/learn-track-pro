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
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        // sectionsも追加してN+1を完全に解消
        $query = LearningContent::with(['technology.category', 'sections'])
            ->where('user_id', $user->id);

        return LearningContentResource::collection(
            $query->paginate($request->input('per_page', 20))
        );
    }


    /**
     * 新しい学習コンテンツを保存
     *
     * @param  \App\Http\Requests\StoreLearningContentRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreLearningContentRequest $request)
    {
        $validated = $request->validated();
        $user = Auth::user();

        $learningContent = DB::transaction(function () use ($validated, $user) {
            $content = $user->learningContents()->create([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'technology_id' => $validated['technology_id'],
                'total_sections' => count($validated['sections']),
                'status' => !empty($validated['startImmediately']) ? 'in_progress' : 'not_started',
            ]);

            foreach ($validated['sections'] as $index => $sectionData) {
                $content->sections()->create([
                    'title' => $sectionData['title'],
                    'order' => $index + 1,
                    'status' => 'not_started',
                ]);
            }

            return $content;
        });

        $learningContent->load('technology.category', 'sections');

        return (new LearningContentResource($learningContent))
            ->additional(['message' => '学習内容を作成しました。'])
            ->response()
            ->setStatusCode(201);
    }

    /**
     * 指定された学習コンテンツの詳細を取得
     *
     * @param  \App\Models\LearningContent  $learningContent
     * @return \App\Http\Resources\LearningContentResource
     */
    public function show(LearningContent $learningContent)
    {
        Gate::authorize('view', $learningContent);
        $learningContent->load('technology.category', 'sections');
        return new LearningContentResource($learningContent);
    }

    /**
     * 指定された学習コンテンツを更新
     *
     * @param  \App\Http\Requests\UpdateLearningContentRequest  $request
     * @param  \App\Models\LearningContent  $learningContent
     * @return \App\Http\Resources\LearningContentResource
     */
    public function update(UpdateLearningContentRequest $request, LearningContent $learningContent)
    {
        Gate::authorize('update', $learningContent);
        $learningContent->update($request->validated());
        $learningContent->load('technology.category');
        return (new LearningContentResource($learningContent))
            ->additional(['message' => '学習内容を更新しました。']);
    }

    /**
     * 指定された学習コンテンツを削除
     *
     * @param  \App\Models\LearningContent  $learningContent
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(LearningContent $learningContent)
    {
        Gate::authorize('delete', $learningContent);
        $learningContent->delete();
        return response()->json(['message' => '学習内容を削除しました。'], 200);
    }

    /**
     * 指定された学習コンテンツを完了状態にする
     *
     * @param  \App\Models\LearningContent  $learningContent
     * @return \Illuminate\Http\JsonResponse
     */
    public function complete(LearningContent $learningContent)
    {
        Gate::authorize('complete', $learningContent);

        if ($learningContent->completed_sections < $learningContent->total_sections) {
            return response()->json(['message' => '全てのセクションが完了していません。'], 422);
        }

        $learningContent->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        $learningContent->load('technology.category');
        return (new LearningContentResource($learningContent))
            ->additional(['message' => '学習内容を完了しました。']);
    }

    /**
     * 指定された学習コンテンツを再開状態にする
     *
     * @param  \App\Models\LearningContent  $learningContent
     * @return \Illuminate\Http\JsonResponse
     */
    public function reopen(LearningContent $learningContent)
    {
        Gate::authorize('reopen', $learningContent);

        if ($learningContent->status !== 'completed') {
            return response()->json(['message' => '完了していない学習内容は再開できません。'], 422);
        }

        $learningContent->update([
            'status' => 'in_progress',
            'completed_at' => null,
        ]);

        $learningContent->load('technology.category');
        return (new LearningContentResource($learningContent))
            ->additional(['message' => '学習を再開しました。']);
    }
}
