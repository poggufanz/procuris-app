<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePositionRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'level' => ['required', 'integer', 'between:1,4'],
            'division' => ['required', 'string', 'max:100'],
            'parent_position_id' => ['nullable', 'integer', 'exists:positions,id'],
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
        ];
    }
}
