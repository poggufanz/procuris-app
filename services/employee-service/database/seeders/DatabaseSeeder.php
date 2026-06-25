<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Employee;
use App\Models\Position;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $pusat = Branch::create([
            'name'      => 'Kantor Pusat',
            'code'      => 'PUSAT',
            'is_active' => true,
        ]);
        $bandung = Branch::create([
            'name'      => 'Cabang Bandung',
            'code'      => 'BDG',
            'parent_id' => $pusat->id,
            'is_active' => true,
        ]);

        $managerHR = Position::create([
            'name'      => 'Manager HRD',
            'level'     => 2,
            'division'  => 'HR',
            'branch_id' => $pusat->id,
        ]);
        $adminCabang = Position::create([
            'name'      => 'Admin Cabang',
            'level'     => 3,
            'division'  => 'Operasional',
            'branch_id' => $bandung->id,
        ]);

        Employee::create([
            'user_id'               => 1,
            'nama_lengkap'          => 'Siti Rahayu',
            'nomor_induk_karyawan'  => 'NIK-2026-001',
            'alamat'                => 'Jl. Sudirman No. 1, Jakarta',
            'branch_id'             => $pusat->id,
            'position_id'           => $managerHR->id,
            'tanggal_gabung'        => '2020-01-15',
            'tanggal_mulai_kontrak' => '2020-01-15',
            'status'                => 'aktif',
        ]);
        Employee::create([
            'user_id'               => 2,
            'nama_lengkap'          => 'Budi Santoso',
            'nomor_induk_karyawan'  => 'NIK-2026-002',
            'alamat'                => 'Jl. Asia Afrika No. 5, Bandung',
            'branch_id'             => $bandung->id,
            'position_id'           => $adminCabang->id,
            'tanggal_gabung'        => '2022-03-01',
            'tanggal_mulai_kontrak' => '2022-03-01',
            'status'                => 'aktif',
        ]);
    }
}
