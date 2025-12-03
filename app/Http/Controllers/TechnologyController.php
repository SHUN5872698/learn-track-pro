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
}
