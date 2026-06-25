<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBranchRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'code' => ['required', 'string', 'max:20', 'unique:branches,code'],
            'parent_id' => ['nullable', 'integer', 'exists:branches,id'],
            'address' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ];
    }
}
