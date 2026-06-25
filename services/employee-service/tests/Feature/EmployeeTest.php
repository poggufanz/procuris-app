<?php

use App\Models\Branch;
use App\Models\Employee;
use App\Models\Position;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function makeEmployee(array $override = []): Employee
{
    $branch   = Branch::factory()->create();
    $position = Position::factory()->create(['branch_id' => $branch->id]);
    return Employee::factory()->create(array_merge([
        'branch_id'   => $branch->id,
        'position_id' => $position->id,
    ], $override));
}

it('admin_hrd lists all employees', function () {
    makeEmployee();
    makeEmployee();
    $this->getJson('/employees', actingAsRole('admin_hrd'))
        ->assertOk()->assertJsonCount(2, 'data');
});

it('admin_cabang only sees own branch employees', function () {
    $branch = Branch::factory()->create();
    $pos    = Position::factory()->create(['branch_id' => $branch->id]);
    Employee::factory()->create(['branch_id' => $branch->id, 'position_id' => $pos->id]);
    makeEmployee(); // different branch
    $this->getJson('/employees', actingAsRole('admin_cabang', $branch->id))
        ->assertOk()->assertJsonCount(1, 'data');
});

it('filters employees by status', function () {
    makeEmployee(['status' => 'aktif']);
    makeEmployee(['status' => 'nonaktif']);
    $this->getJson('/employees?status=aktif', actingAsRole('admin_hrd'))
        ->assertOk()->assertJsonCount(1, 'data');
});

it('filters employees by search on nama_lengkap', function () {
    makeEmployee(['nama_lengkap' => 'Budi Santoso']);
    makeEmployee(['nama_lengkap' => 'Ani Wijaya']);
    $this->getJson('/employees?search=Budi', actingAsRole('admin_hrd'))
        ->assertOk()->assertJsonCount(1, 'data');
});

it('admin_hrd can create employee', function () {
    $branch   = Branch::factory()->create();
    $position = Position::factory()->create(['branch_id' => $branch->id]);
    $payload  = [
        'user_id'                => 99,
        'nama_lengkap'           => 'Test User',
        'nomor_induk_karyawan'   => 'NIK-001',
        'alamat'                 => 'Jl. Test No. 1',
        'branch_id'              => $branch->id,
        'position_id'            => $position->id,
        'tanggal_gabung'         => '2026-01-01',
        'tanggal_mulai_kontrak'  => '2026-01-01',
        'status'                 => 'aktif',
    ];
    $this->postJson('/employees', $payload, actingAsRole('admin_hrd'))
        ->assertStatus(201)->assertJsonPath('nama_lengkap', 'Test User');
});

it('admin_cabang can create employee in own branch', function () {
    $branch   = Branch::factory()->create();
    $position = Position::factory()->create(['branch_id' => $branch->id]);
    $payload  = [
        'user_id'                => 99,
        'nama_lengkap'           => 'Test User',
        'nomor_induk_karyawan'   => 'NIK-001',
        'alamat'                 => 'Jl. Test No. 1',
        'branch_id'              => $branch->id,
        'position_id'            => $position->id,
        'tanggal_gabung'         => '2026-01-01',
        'tanggal_mulai_kontrak'  => '2026-01-01',
        'status'                 => 'aktif',
    ];
    $this->postJson('/employees', $payload, actingAsRole('admin_cabang', $branch->id))
        ->assertStatus(201);
});

it('admin_cabang cannot create employee in other branch', function () {
    $branch   = Branch::factory()->create();
    $other    = Branch::factory()->create();
    $position = Position::factory()->create(['branch_id' => $other->id]);
    $payload  = [
        'user_id'                => 99,
        'nama_lengkap'           => 'Test User',
        'nomor_induk_karyawan'   => 'NIK-001',
        'alamat'                 => 'Jl. Test No. 1',
        'branch_id'              => $other->id,
        'position_id'            => $position->id,
        'tanggal_gabung'         => '2026-01-01',
        'tanggal_mulai_kontrak'  => '2026-01-01',
        'status'                 => 'aktif',
    ];
    $this->postJson('/employees', $payload, actingAsRole('admin_cabang', $branch->id))
        ->assertStatus(403);
});

it('admin_cabang cannot view employee from other branch', function () {
    $employee = makeEmployee();
    $this->getJson("/employees/{$employee->id}", actingAsRole('admin_cabang', $employee->branch_id + 99))
        ->assertStatus(403);
});

it('karyawan cannot mutate employees', function () {
    $this->postJson('/employees', [], actingAsRole('karyawan', 1))
        ->assertStatus(403);
});

it('soft deletes an employee', function () {
    $employee = makeEmployee();
    $this->deleteJson("/employees/{$employee->id}", [], actingAsRole('admin_hrd'))
        ->assertStatus(204);
    $this->assertSoftDeleted('employees', ['id' => $employee->id]);
});
