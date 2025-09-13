<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLearningContentRequest;
use App\Http\Requests\UpdateLearningContentRequest;
use App\Models\LearningContent;

class LearningContentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLearningContentRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(LearningContent $learningContent)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLearningContentRequest $request, LearningContent $learningContent)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LearningContent $learningContent)
    {
        //
    }
}
