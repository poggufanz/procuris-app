<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Employee;
use App\Models\Position;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    // user_id values must match the auth-service users (1..6). Branch IDs 1=PUSAT, 2=BDG, 3=SBY
    // are referenced by auth users.branch_id and purchase POs (snapshotted there).
    public function run(): void
    {
        $pusat = Branch::updateOrCreate(['code' => 'PUSAT'], [
            'name' => 'Kantor Pusat', 'parent_id' => null,
            'address' => 'Jl. Sudirman No. 1, Jakarta', 'is_active' => true,
        ]);
        $bdg = Branch::updateOrCreate(['code' => 'BDG'], [
            'name' => 'Cabang Bandung', 'parent_id' => $pusat->id,
            'address' => 'Jl. Asia Afrika No. 5, Bandung', 'is_active' => true,
        ]);
        $sby = Branch::updateOrCreate(['code' => 'SBY'], [
            'name' => 'Cabang Surabaya', 'parent_id' => $pusat->id,
            'address' => 'Jl. Pemuda No. 10, Surabaya', 'is_active' => true,
        ]);

        $direktur = Position::updateOrCreate(['name' => 'Direktur', 'branch_id' => $pusat->id],
            ['level' => 1, 'division' => 'Manajemen', 'parent_position_id' => null]);
        $mgrHrd = Position::updateOrCreate(['name' => 'Manager HRD', 'branch_id' => $pusat->id],
            ['level' => 2, 'division' => 'HR', 'parent_position_id' => $direktur->id]);
        $mgrPur = Position::updateOrCreate(['name' => 'Manager Purchasing', 'branch_id' => $pusat->id],
            ['level' => 2, 'division' => 'Purchasing', 'parent_position_id' => $direktur->id]);
        $adminCabang = Position::updateOrCreate(['name' => 'Admin Cabang', 'branch_id' => $bdg->id],
            ['level' => 3, 'division' => 'Operasional', 'parent_position_id' => $mgrHrd->id]);
        $staffPur = Position::updateOrCreate(['name' => 'Staff Purchasing', 'branch_id' => $bdg->id],
            ['level' => 4, 'division' => 'Purchasing', 'parent_position_id' => $mgrPur->id]);
        $staffOps = Position::updateOrCreate(['name' => 'Staff Operasional', 'branch_id' => $sby->id],
            ['level' => 4, 'division' => 'Operasional', 'parent_position_id' => null]);

        $employees = [
            ['user_id' => 2, 'nama' => 'Dewi Lestari',  'nik' => 'NIK-2026-002', 'alamat' => 'Jl. Melati No. 2, Jakarta',        'branch' => $pusat, 'pos' => $mgrHrd],
            ['user_id' => 3, 'nama' => 'Budi Santoso',  'nik' => 'NIK-2026-003', 'alamat' => 'Jl. Asia Afrika No. 5, Bandung',   'branch' => $bdg,   'pos' => $adminCabang],
            ['user_id' => 4, 'nama' => 'Rina Wijaya',   'nik' => 'NIK-2026-004', 'alamat' => 'Jl. Pemuda No. 10, Surabaya',      'branch' => $sby,   'pos' => $staffOps],
            ['user_id' => 5, 'nama' => 'Agus Pratama',  'nik' => 'NIK-2026-005', 'alamat' => 'Jl. Gatot Subroto No. 8, Jakarta', 'branch' => $pusat, 'pos' => $mgrPur],
            ['user_id' => 6, 'nama' => 'Siti Rahayu',   'nik' => 'NIK-2026-006', 'alamat' => 'Jl. Braga No. 3, Bandung',         'branch' => $bdg,   'pos' => $staffPur],
        ];

        foreach ($employees as $e) {
            Employee::updateOrCreate(['user_id' => $e['user_id']], [
                'nama_lengkap'          => $e['nama'],
                'nomor_induk_karyawan'  => $e['nik'],
                'alamat'                => $e['alamat'],
                'branch_id'             => $e['branch']->id,
                'position_id'           => $e['pos']->id,
                'tanggal_gabung'        => '2024-01-15',
                'tanggal_mulai_kontrak' => '2024-01-15',
                'tanggal_akhir_kontrak' => '2027-01-15',
                'status'                => 'aktif',
            ]);
        }
    }
}
