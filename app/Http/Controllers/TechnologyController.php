<?php

namespace App\Http\Controllers;

use App\Models\Technology;
use Illuminate\Http\Request;

class TechnologyController extends Controller
{
    /**
     * 技術情報一覧を取得
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
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
     * 新しく作成された技術情報をストレージに保存
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * 指定された技術情報を表示
     */
    public function show(Technology $technology)
    {
        //
    }

    /**
     * 指定された技術情報をストレージで更新
     */
    public function update(Request $request, Technology $technology)
    {
        //
    }

    /**
     * 指定された技術情報をストレージから削除
     */
    public function destroy(Technology $technology)
    {
        //
    }
}
