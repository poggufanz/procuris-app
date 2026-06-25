<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBranchRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $id = $this->route('id');
        return [
            'name' => ['required', 'string', 'max:100'],
            'code' => ['required', 'string', 'max:20', Rule::unique('branches', 'code')->ignore($id)],
            'parent_id' => ['nullable', 'integer', 'exists:branches,id'],
            'address' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ];
    }
}
