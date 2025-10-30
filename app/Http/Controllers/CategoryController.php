<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * リソースの一覧を表示
     */
    public function index()
    {
        return response()->json(Category::all());
    }

    /**
     * 新しく作成されたリソースをストレージに保存
     */
    public function store(StoreCategoryRequest $request)
    {
        //
    }

    /**
     * 指定されたリソースを表示
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * 指定されたリソースをストレージで更新
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        //
    }

    /**
     * 指定されたリソースをストレージから削除
     */
    public function destroy(Category $category)
    {
        //
    }
}
