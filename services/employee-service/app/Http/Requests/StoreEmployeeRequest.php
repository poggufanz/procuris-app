<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'user_id'                 => ['required', 'integer', 'unique:employees,user_id'],
            'nama_lengkap'            => ['required', 'string', 'max:150'],
            'nomor_induk_karyawan'    => ['required', 'string', 'max:30', 'unique:employees,nomor_induk_karyawan'],
            'alamat'                  => ['required', 'string'],
            'branch_id'               => ['required', 'integer', 'exists:branches,id'],
            'position_id'             => ['required', 'integer', 'exists:positions,id'],
            'tanggal_gabung'          => ['required', 'date'],
            'tanggal_mulai_kontrak'   => ['required', 'date'],
            'tanggal_akhir_kontrak'   => ['nullable', 'date'],
            'status'                  => ['required', 'in:aktif,nonaktif,kontrak_berakhir'],
        ];
    }
}
