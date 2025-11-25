<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLearningSessionRequest;
use App\Http\Requests\UpdateLearningSessionRequest;
use App\Http\Resources\LearningSessionResource;
use App\Models\LearningContent;
use App\Models\LearningSession;
use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class LearningSessionController extends Controller
{
    use AuthorizesRequests;

    /**
     * 学習記録の一覧を表示
     *
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        // 認証済みユーザーの学習記録を、関連する学習コンテンツとセクション情報と共に取得
        $query = LearningSession::where('user_id', auth()->id())
            ->with(['learningContent', 'section']);

        // フィルタリング
        if ($request->has('learning_content_id')) {
            $query->where('learning_content_id', $request->learning_content_id);
        }
        if ($request->has('section_id')) {
            $query->where('section_id', $request->section_id);
        }
        // 学習日時の降順で並び替え
        $sessions = $query->orderBy('studied_at', 'desc')->get();

        return LearningSessionResource::collection($sessions);
    }

    /**
     * 新しく作成された学習記録を保存
     *
     * @param StoreLearningSessionRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreLearningSessionRequest $request)
    {
        // バリデーション済みデータを取得
        $validated = $request->validated();
        // 認証済みユーザーIDを割り当て
        $validated['user_id'] = Auth::id();

        $session = LearningSession::create($validated);

        return (new LearningSessionResource($session))
            ->additional(['message' => '学習記録を作成しました。'])
            ->response()
            ->setStatusCode(201);
    }

    /**
     * 指定された学習記録を表示
     *
     * @param LearningSession $learningSession
     * @return \App\Http\Resources\LearningSessionResource
     */
    public function show(LearningSession $learningSession)
    {
        // ユーザーが学習記録を閲覧する権限があるか確認
        $this->authorize('view', $learningSession);
        // 関連する学習コンテンツの技術情報とセクションをEager Load
        $learningSession->load(['learningContent.technology', 'section']);

        return new LearningSessionResource($learningSession);
    }

    /**
     * 指定された学習記録を更新
     *
     * @param Request $request
     * @return \App\Http\Resources\LearningSessionResource
     */
    public function update(UpdateLearningSessionRequest $request, LearningSession $learningSession)
    {
        // ユーザーが学習記録を更新する権限があるか確認
        $this->authorize('update', $learningSession);

        $learningSession->update($request->validated());
        return (new LearningSessionResource($learningSession))
            ->additional(['message' => '学習記録を更新しました。']);
    }

    /**
     * 指定された学習記録を削除
     *
     * @param LearningSession $learningSession
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(LearningSession $learningSession)
    {
        // ユーザーが学習記録を削除する権限があるか確認
        $this->authorize('delete', $learningSession);
        // 学習記録を削除
        $learningSession->delete();
        return response()->json(['message' => '学習記録を削除しました。']);
    }

    /**
     * セクションごとの学習記録を取得
     *
     * @param LearningContent $learningContent
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function byContent(LearningContent $learningContent)
    {
        // ユーザーが学習コンテンツを閲覧する権限があるか確認
        $this->authorize('view', $learningContent);

        // 指定された学習コンテンツに紐づく学習記録を、セクション情報と共に取得
        // 学習日時の降順で並び替えて20件ずつページネーション
        $sessions = $learningContent->learningSessions()
            ->with(['section'])
            ->latest('studied_at')
            ->paginate(20);
        return LearningSessionResource::collection($sessions);
    }

    /**
     * セクションごとの学習記録を取得
     *
     * @param Section $section
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function bySection(Section $section)
    {
        // ユーザーがセクションの学習コンテンツを更新する権限があるか確認
        $this->authorize('update', $section->learningContent);

        // 指定されたセクションに紐づく学習記録を取得
        // 学習日時の降順で並び替えて20件ずつページネーション
        $sessions = $section->learningSessions()
            ->latest('studied_at')
            ->paginate(20);
        return LearningSessionResource::collection($sessions);
    }

    /**
     * 統計サマリーを取得
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function statisticsSummary()
    {
        $user = Auth::user();
        $today = \Carbon\Carbon::today();

        // ユーザーの総学習時間（分）を計算（未来の日付も含む）
        $totalMinutes = $user->learningSessions()->sum('study_minutes');

        // ユーザーが完了した学習コンテンツの数をカウント
        $completedCourses = $user->learningContents()->where('status', 'completed')->count();

        // 学習を行ったユニークな日付を取得（今日以前のみ）
        // DATE関数で日付部分のみ抽出し、未来の日付や重複を除外して最新日時順で並び替え
        $studyDays = $user->learningSessions()
            ->selectRaw('DATE(studied_at) as date')
            ->whereDate('studied_at', '<=', $today)  // 未来の日付を除外
            ->distinct()
            ->orderBy('date', 'desc')
            ->pluck('date');

        // 学習を行った日数をカウント
        $totalDays = $studyDays->count();
        // 1日あたりの平均学習時間を計算（0除算を回避）
        $averagePerDay = $totalDays > 0 ? round($totalMinutes / $totalDays) : 0;

        // 連続学習日数を計算
        $consecutiveDays = 0;
        if ($studyDays->isNotEmpty()) {
            $latestStudyDate = \Carbon\Carbon::parse($studyDays->first());

            // 最新の学習日が今日または昨日の場合のみカウント開始
            if ($latestStudyDate->isToday() || $latestStudyDate->isYesterday()) {
                $consecutiveDays = 1;
                $expectedDate = $latestStudyDate->copy();

                for ($i = 1; $i < $studyDays->count(); $i++) {
                    $currentDate = \Carbon\Carbon::parse($studyDays[$i]);
                    $expectedDate = $expectedDate->copy()->subDay();

                    if ($currentDate->isSameDay($expectedDate)) {
                        $consecutiveDays++;
                    } else {
                        break;
                    }
                }
            }
            // 今日も昨日も学習していない場合は連続日数は0
        }

        return response()->json([
            'total_study_minutes' => (int) $totalMinutes,
            'completed_courses_count' => $completedCourses,
            'average_study_time_per_day' => $averagePerDay,
            'consecutive_study_days' => $consecutiveDays,
        ]);
    }

    /**
     * 月ごとの統計を取得
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function monthlyStatistics(Request $request)
    {
        // リクエストから月数を取得（デフォルトは6ヶ月）
        $months = $request->input('months', 6);
        $user = Auth::user();

        // ユーザーの学習セッションから月ごとの総学習時間を集計
        // DATE_FORMAT関数で年月形式に変換し、指定月数分のデータを取得
        $data = $user->learningSessions()
            ->selectRaw('DATE_FORMAT(studied_at, "%Y-%m") as month, SUM(study_minutes) as total_minutes')
            ->where('studied_at', '>=', now()->subMonths($months)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        return response()->json($data);
    }

    /**
     * 技術ごとの統計を取得
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function technologyStatistics()
    {
        $user = Auth::user();

        // ユーザーの学習セッションを基に、技術ごとの総学習時間を集計
        // learning_contentsとtechnologiesテーブルをJOINして技術名を取得
        $data = DB::table('learning_sessions')
            ->join('learning_contents', 'learning_sessions.learning_content_id', '=', 'learning_contents.id')
            ->join('technologies', 'learning_contents.technology_id', '=', 'technologies.id')
            ->where('learning_sessions.user_id', $user->id)
            ->selectRaw('technologies.name as technology_name, SUM(learning_sessions.study_minutes) as total_minutes')
            ->groupBy('technologies.name')
            ->orderBy('total_minutes', 'desc')
            ->get();

        return response()->json($data);
    }

    /**
     * 日ごとの統計を取得
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function dailyStatistics(Request $request)
    {
        // リクエストから日数を取得（デフォルトは30日）
        $days = $request->input('days', 30);
        $user = Auth::user();

        // ユーザーの学習セッションから日ごとの総学習時間を集計
        // DATE関数で日付部分のみ抽出し、指定日数分のデータを取得
        $data = $user->learningSessions()
            ->selectRaw('DATE(studied_at) as date, SUM(study_minutes) as total_minutes')
            ->where('studied_at', '>=', now()->subDays($days))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        return response()->json($data);
    }

    /**
     * 学習内容別の最新セッションを1件ずつ取得
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function latestByContent()
    {
        $userId = Auth::id();

        // 各学習内容の最新セッションを取得するサブクエリ
        // 学習内容ごとにグループ化して最大IDを取得し、関連データをEager Load
        $latestSessions = LearningSession::select('learning_sessions.*')
            ->from('learning_sessions')
            ->whereIn('learning_sessions.id', function ($query) use ($userId) {
                $query->select(DB::raw('MAX(id)'))
                    ->from('learning_sessions')
                    ->where('user_id', $userId)
                    ->groupBy('learning_content_id');
            })
            ->with(['learningContent', 'section'])
            ->orderBy('studied_at', 'desc')
            ->get();

        return LearningSessionResource::collection($latestSessions);
    }

    /**
     * 特定の学習コンテンツの日ごとの統計を取得
     *
     * @param Request $request
     * @param int $contentId
     * @return \Illuminate\Http\JsonResponse
     */
    public function dailyStatisticsByContent(Request $request, $contentId)
    {
        // 学習コンテンツの所有者確認
        $learningContent = LearningContent::findOrFail($contentId);
        $this->authorize('view', $learningContent);

        // リクエストから日数を取得（デフォルトは30日）
        $days = $request->input('days', 30);

        // 指定された学習コンテンツの日ごとの総学習時間を集計
        // DATE関数で日付部分のみ抽出し、指定日数分のデータを取得
        $data = $learningContent->learningSessions()
            ->selectRaw('DATE(studied_at) as date, SUM(study_minutes) as total_minutes')
            ->where('studied_at', '>=', now()->subDays($days))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        return response()->json($data);
    }
}
