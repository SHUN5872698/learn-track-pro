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
        // 認可：他ユーザーの学習内容のセクション閲覧を防止
        Gate::authorize('view', $learningContent);

        $sections = $learningContent->sections()->orderBy('order')->get();

        return response()->json([
            'data' => $sections
        ]);
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
        // RESTful APIの原則に従い、存在しない学習内容IDには404を返す
        $learningContent = LearningContent::findOrFail($validated['learning_content_id']);

        // 認可：他ユーザーの学習内容へのセクション追加を防止
        Gate::authorize('update', $learningContent);

        // セクション作成と統計情報更新をトランザクション化し、片方が失敗した場合に両方ロールバック
        $section = DB::transaction(function () use ($learningContent, $validated) {
            $section = $learningContent->sections()->create($validated);
            // total_sectionsとセクション実数の整合性を保つため、ここで増加
            $learningContent->increment('total_sections');
            return $section;
        });

        return response()->json([
            'data' => $section,
            'message' => 'セクションを追加しました。'
        ], 201);
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
        // 認可：他ユーザーの学習内容に属するセクションの更新を防止
        Gate::authorize('update', $section->learningContent);
        $section->update($request->validated());

        return response()->json([
            'data' => $section,
            'message' => 'セクションを更新しました。'
        ]);
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
        // 認可：他ユーザーの学習内容に属するセクションの削除を防止
        Gate::authorize('update', $learningContent);

        // ビジネスルール：学習内容には最低1つのセクションが必須
        if ($learningContent->sections()->count() <= 1) {
            return response()->json(['message' => '最低1つのセクションが必要です。'], 422);
        }

        // セクション削除と統計情報更新をトランザクション化し、データの整合性を保証
        DB::transaction(function () use ($section, $learningContent) {
            $isCompleted = $section->status === 'completed';
            $section->delete();
            // total_sectionsとセクション実数の整合性を保つため、ここで減少
            $learningContent->decrement('total_sections');
            // 完了済みセクションを削除した場合、completed_sectionsも減算して整合性を保つ
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
        // 認可：他ユーザーの学習内容に属するセクションのステータス更新を防止
        Gate::authorize('update', $learningContent);

        $oldStatus = $section->status;
        $newStatus = $request->validated()['status'];

        // 不要なDB更新とトランザクション処理を回避
        if ($oldStatus === $newStatus) {
            return response()->json([
                'data' => $section,
                'message' => 'ステータスは既に設定されています。'
            ]);
        }

        // セクションステータス更新と統計情報更新をトランザクション化し、データの整合性を保証
        DB::transaction(function () use ($section, $learningContent, $oldStatus, $newStatus) {
            $section->update([
                'status' => $newStatus,
                // 完了ステータスへの遷移時のみ完了日時を記録
                'completed_at' => $newStatus === 'completed' ? now() : null,
            ]);

            // completed_sectionsとセクションの完了状態の整合性を保つため、ステータス変化に応じて増減
            if ($oldStatus === 'completed' && $newStatus !== 'completed') {
                $learningContent->decrement('completed_sections');
            } elseif ($oldStatus !== 'completed' && $newStatus === 'completed') {
                $learningContent->increment('completed_sections');
            }
        });

        return response()->json([
            'data' => $section,
            'message' => 'ステータスを更新しました。'
        ]);
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

            // 削除処理
            if (!empty($validated['deleted_section_ids'])) {
                // ビジネスルール：削除後も最低1つのセクションを保持
                $remainingCount = $learningContent->sections()->count() - count($validated['deleted_section_ids']);
                if ($remainingCount < 1) {
                    abort(422, '最低1つのセクションが必要です。');
                }
                $learningContent->sections()
                    ->whereIn('id', $validated['deleted_section_ids'])
                    ->delete();
            }

            // orderカラムのユニーク制約を回避するため、既存セクションを一時的に大きな値に退避
            $existingIds = collect($validated['sections'])
                ->pluck('id')
                ->filter(); // nullを除外（新規セクションは対象外）

            if ($existingIds->isNotEmpty()) {
                // Eloquentを使わずクエリビルダで一括更新（パフォーマンス向上）
                DB::table('sections')
                    ->where('learning_content_id', $learningContent->id)
                    ->whereIn('id', $existingIds)
                    ->update(['order' => DB::raw('id + 10000')]); // 一時的にIDベースの一意な値を設定
            }

            // セクションを正しいorder値に配置
            foreach ($validated['sections'] as $sectionData) {
                if (isset($sectionData['id'])) {
                    // 既存セクション：titleとorderを更新
                    Section::where('id', $sectionData['id'])
                        ->where('learning_content_id', $learningContent->id)
                        ->update([
                            'title' => $sectionData['title'],
                            'order' => $sectionData['order']
                        ]);
                } else {
                    // 新規セクション：作成
                    $learningContent->sections()->create([
                        'title' => $sectionData['title'],
                        'order' => $sectionData['order'],
                        'status' => 'not_started'
                    ]);
                }
            }

            // 一括操作後に統計情報を再計算（increment/decrementではなくcount()で確実性を保証）
            $learningContent->update([
                'total_sections' => $learningContent->sections()->count(),
                'completed_sections' => $learningContent->sections()
                    ->where('status', 'completed')
                    ->count()
            ]);
        });
        $sections = $learningContent->sections()->orderBy('order')->get();

        return response()->json([
            'data' => $sections,
            'message' => 'セクションを更新しました。'
        ]);
    }
}
