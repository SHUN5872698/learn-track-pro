<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

use Illuminate\Validation\Rule;

class UpdateLearningContentRequest extends FormRequest
{
    /**
     * ユーザーがこのリクエストを行うことを承認されているか判定
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * リクエストに適用されるバリデーションルールを取得
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'technology_id' => ['sometimes', 'integer', 'exists:technologies,id'],
            'title' => ['sometimes', 'string', 'max:50'],
            'description' => ['nullable', 'string', 'max:500'],
            'status' => ['sometimes', Rule::in(['not_started', 'in_progress', 'completed'])],
        ];
    }
}
