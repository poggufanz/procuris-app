<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('id');

        return [
            'name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($userId)],
            'role' => ['required', 'in:superadmin,admin_hrd,admin_cabang,karyawan,admin_purchasing,staff_purchasing'],
            'branch_id' => ['nullable', 'integer'],
        ];
    }
}
