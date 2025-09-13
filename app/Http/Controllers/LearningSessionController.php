<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLearningSessionRequest;
use App\Http\Requests\UpdateLearningSessionRequest;
use App\Models\LearningSession;

class LearningSessionController extends Controller
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
    public function store(StoreLearningSessionRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(LearningSession $learningSession)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLearningSessionRequest $request, LearningSession $learningSession)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LearningSession $learningSession)
    {
        //
    }
}
