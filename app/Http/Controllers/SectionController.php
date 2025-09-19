<?php

namespace App\Http\Controllers;

use App\Http\Requests\BulkUpdateSectionsRequest;
use App\Http\Requests\StoreSectionRequest;
use App\Http\Requests\UpdateSectionRequest;
use App\Http\Requests\UpdateSectionStatusRequest;
use App\Models\LearningContent;
use App\Models\Section;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

final class SectionController extends Controller
{
    /**
     * 指定した学習コンテンツのセクション一覧を取得
     *
     * @param LearningContent $learningContent
     * @return JsonResponse
     */
    public function index(LearningContent $learningContent): JsonResponse
    {
        // 認可ポリシーを適用し、ユーザーがコンテンツを閲覧する権限があるか確認
        Gate::authorize('view', $learningContent);

        $sections = $learningContent->sections()->orderBy('order')->get();

        return response()->json($sections);
    }

    /**
     * 新しいセクションを追加
     *
     * @param StoreSectionRequest $request
     * @return JsonResponse
     */
    public function store(StoreSectionRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $learningContent = LearningContent::findOrFail($validated['learning_content_id']);
        // 認可ポリシーを適用し、ユーザーがコンテンツを更新する権限があるか確認
        Gate::authorize('update', $learningContent);

        // セクションの作成と学習コンテンツのセクション数更新をトランザクションで囲み、原子性を保証
        $section = DB::transaction(function () use ($learningContent, $validated) {
            $section = $learningContent->sections()->create($validated);
            $learningContent->increment('total_sections'); // 学習コンテンツの総セクション数を増やす
            return $section;
        });

        return response()->json($section, 201);
    }

    /**
     * セクションを更新
     *
     * @param UpdateSectionRequest $request
     * @param Section $section
     * @return JsonResponse
     */
    public function update(UpdateSectionRequest $request, Section $section): JsonResponse
    {
        // 認可ポリシーを適用し、ユーザーがセクションの学習コンテンツを更新する権限があるか確認
        Gate::authorize('update', $section->learningContent);
        $section->update($request->validated());
        return response()->json($section);
    }

    /**
     * セクションを削除
     *
     * @param Section $section
     * @return JsonResponse
     */
    public function destroy(Section $section): JsonResponse
    {
        $learningContent = $section->learningContent;
        // 認可ポリシーを適用し、ユーザーがセクションの学習コンテンツを更新する権限があるか確認
        Gate::authorize('update', $learningContent);

        // 学習コンテンツに最低1つのセクションを保持するため、最後のセクションは削除不可
        if ($learningContent->sections()->count() <= 1) {
            return response()->json(['message' => '最低1つのセクションが必要です。'], 422);
        }

        // セクションの削除と学習コンテンツのセクション数更新をトランザクションで囲み、原子性を保証
        DB::transaction(function () use ($section, $learningContent) {
            $isCompleted = $section->status === 'completed';
            $section->delete();
            $learningContent->decrement('total_sections'); // 学習コンテンツの総セクション数を減らす
            // 削除されたセクションが完了済みだった場合、学習コンテンツの完了セクション数も減らす
            if ($isCompleted) {
                $learningContent->decrement('completed_sections');
            }
        });

        return response()->json(['message' => 'セクションを削除しました。']);
    }

    /**
     * セクションのステータスを更新
     *
     * @param UpdateSectionStatusRequest $request
     * @param Section $section
     * @return JsonResponse
     */
    public function updateStatus(UpdateSectionStatusRequest $request, Section $section): JsonResponse
    {
        $learningContent = $section->learningContent;
        // 認可ポリシーを適用し、ユーザーがセクションの学習コンテンツを更新する権限があるか確認
        Gate::authorize('update', $learningContent);

        $oldStatus = $section->status;
        $newStatus = $request->validated()['status'];

        // ステータスに変更がない場合は更新処理をスキップ
        if ($oldStatus === $newStatus) {
            return response()->json($section);
        }

        // セクションのステータス更新と学習コンテンツの完了セクション数更新をトランザクションで囲み、原子性を保証
        DB::transaction(function () use ($section, $learningContent, $oldStatus, $newStatus) {
            $section->update([
                'status' => $newStatus,
                // 完了ステータスになった場合のみ完了日時を記録
                'completed_at' => $newStatus === 'completed' ? now() : null,
            ]);

            // 完了セクション数の増減を適切に処理
            if ($oldStatus === 'completed' && $newStatus !== 'completed') {
                $learningContent->decrement('completed_sections');
            } elseif ($oldStatus !== 'completed' && $newStatus === 'completed') {
                $learningContent->increment('completed_sections');
            }
        });

        return response()->json($section);
    }

    /**
     * セクションを一括更新
     *
     * @param BulkUpdateSectionsRequest $request
     * @param LearningContent $learningContent
     * @return JsonResponse
     */
    public function bulkUpdate(BulkUpdateSectionsRequest $request, LearningContent $learningContent): JsonResponse
    {
        Gate::authorize('update', $learningContent);

        DB::transaction(function () use ($learningContent, $request) {
            $validated = $request->validated();

            // 1. 削除処理
            if (!empty($validated['deleted_section_ids'])) {
                // ✅ 削除前チェックを追加（セクションが0になるのを防ぐ）
                $remainingCount = $learningContent->sections()->count() - count($validated['deleted_section_ids']);
                if ($remainingCount < 1) {
                    abort(422, '最低1つのセクションが必要です。');
                }

                $learningContent->sections()
                    ->whereIn('id', $validated['deleted_section_ids'])
                    ->delete();
            }

            // 2. 既存セクションを一時的に退避（ユニーク制約回避）
            $existingIds = collect($validated['sections'])
                ->pluck('id')
                ->filter();  // nullを除外（新規セクションを除く）

            if ($existingIds->isNotEmpty()) {
                // updateメソッドで一括更新（パフォーマンス向上）
                DB::table('sections')
                    ->where('learning_content_id', $learningContent->id)
                    ->whereIn('id', $existingIds)
                    ->update(['order' => DB::raw('id + 10000')]);  // IDベースで一時値を設定
            }

            // 3. 正しい位置に配置
            foreach ($validated['sections'] as $sectionData) {
                if (isset($sectionData['id'])) {
                    // 既存セクション更新
                    Section::where('id', $sectionData['id'])
                        ->where('learning_content_id', $learningContent->id)
                        ->update([
                            'title' => $sectionData['title'],
                            'order' => $sectionData['order']
                        ]);
                } else {
                    // 新規セクション作成
                    $learningContent->sections()->create([
                        'title' => $sectionData['title'],
                        'order' => $sectionData['order'],
                        'status' => 'not_started'
                    ]);
                }
            }

            // 4. 統計情報更新
            $learningContent->update([
                'total_sections' => $learningContent->sections()->count(),
                'completed_sections' => $learningContent->sections()
                    ->where('status', 'completed')
                    ->count()
            ]);
        });

        return response()->json([
            'sections' => $learningContent->sections()->orderBy('order')->get(),
            'message' => 'セクションを更新しました。'
        ]);
    }
}
