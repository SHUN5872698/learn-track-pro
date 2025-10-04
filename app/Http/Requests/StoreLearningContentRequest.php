<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLearningContentRequest extends FormRequest
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
            'technology_id' => ['required', 'integer', 'exists:technologies,id'],
            'title' => ['required', 'string', 'max:50'],
            'description' => ['nullable', 'string', 'max:500'],
            'sections' => ['required', 'array', 'min:1'],
            'sections.*.title' => ['required', 'string', 'max:50'],
            'startImmediately' => ['boolean'],
        ];
    }
}
