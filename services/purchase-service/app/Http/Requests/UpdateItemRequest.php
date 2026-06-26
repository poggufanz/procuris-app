<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateItemRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $id = $this->route('id');
        return [
            'code' => ['required', 'string', 'max:50', Rule::unique('items', 'code')->ignore($id)],
            'name' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'category' => ['required', 'string', 'max:100'],
            'unit' => ['required', 'string', 'max:30'],
            'default_vendor_id' => ['nullable', 'integer', 'exists:vendors,id'],
            'is_active' => ['boolean'],
        ];
    }
}
