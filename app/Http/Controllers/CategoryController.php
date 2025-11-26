<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * 技術カテゴリ一覧を取得
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return response()->json(Category::all());
    }

    /**
     * 新しく作成された技術カテゴリをストレージに保存
     */
    public function store(StoreCategoryRequest $request)
    {
        //
    }

    /**
     * 指定された技術カテゴリを表示
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * 指定された技術カテゴリをストレージで更新
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        //
    }

    /**
     * 指定された技術カテゴリをストレージから削除
     */
    public function destroy(Category $category)
    {
        //
    }
}
