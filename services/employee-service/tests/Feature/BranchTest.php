<?php

use App\Models\Branch;
use App\Models\Employee;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('lists active branches for any role', function () {
    Branch::factory()->create();
    Branch::factory()->create(['is_active' => false]);
    $this->getJson('/branches', actingAsRole('karyawan', 1))
        ->assertOk()->assertJsonCount(1, 'data');
});

it('forbids create for non-HR roles', function () {
    $this->postJson('/branches', ['name' => 'X', 'code' => 'XXX'], actingAsRole('admin_cabang', 1))
        ->assertStatus(403);
});

it('creates a branch as admin_hrd', function () {
    $this->postJson('/branches', ['name' => 'Bandung', 'code' => 'BDG'], actingAsRole('admin_hrd'))
        ->assertStatus(201)->assertJsonPath('code', 'BDG');
});

it('rejects a cyclic parent', function () {
    $a = Branch::factory()->create();
    $b = Branch::factory()->create(['parent_id' => $a->id]);
    $this->putJson("/branches/{$a->id}",
        ['name' => $a->name, 'code' => $a->code, 'parent_id' => $b->id],
        actingAsRole('admin_hrd'))->assertStatus(422);
});

it('guards deactivation when children or employees exist', function () {
    $a = Branch::factory()->create();
    Employee::factory()->create(['branch_id' => $a->id]);
    $this->patchJson("/branches/{$a->id}/deactivate", [], actingAsRole('admin_hrd'))
        ->assertStatus(422);
});

it('returns a branch tree', function () {
    $a = Branch::factory()->create();
    Branch::factory()->create(['parent_id' => $a->id]);
    $this->getJson('/branches/tree', actingAsRole('karyawan', 1))
        ->assertOk()->assertJsonPath('0.children.0.parent_id', $a->id);
});
