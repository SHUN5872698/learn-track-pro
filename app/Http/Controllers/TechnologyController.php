<?php

namespace App\Http\Controllers;

use App\Models\Technology;
use Illuminate\Http\Request;

class TechnologyController extends Controller
{
    /**
     * リソースの一覧を表示
     */
    public function index(Request $request)
    {
        $query = Technology::with('category');

        if ($request->filled('category_id')) {
            $query->byCategory($request->input('category_id'));
        }

        return response()->json($query->get());
    }

    /**
     * 新しく作成されたリソースをストレージに保存
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * 指定されたリソースを表示
     */
    public function show(Technology $technology)
    {
        //
    }

    /**
     * 指定されたリソースをストレージで更新
     */
    public function update(Request $request, Technology $technology)
    {
        //
    }

    /**
     * 指定されたリソースをストレージから削除
     */
    public function destroy(Technology $technology)
    {
        //
    }
}
