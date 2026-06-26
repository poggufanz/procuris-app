<?php

use App\Models\Branch;
use App\Models\Employee;
use App\Models\Position;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('returns the org tree scoped to a specific employee', function () {
    $branch  = Branch::factory()->create();
    $manager = Position::factory()->create(['branch_id' => $branch->id]);
    $staff   = Position::factory()->create(['branch_id' => $branch->id, 'parent_position_id' => $manager->id]);
    $junior  = Position::factory()->create(['branch_id' => $branch->id, 'parent_position_id' => $staff->id]);

    $employee = Employee::factory()->create([
        'branch_id'   => $branch->id,
        'position_id' => $staff->id,
    ]);

    $data = $this->getJson("/employees/{$employee->id}/org-tree", actingAsRole('admin_hrd'))
        ->assertOk()->json();

    expect($data['employee']['id'])->toBe($employee->id)
        ->and($data['position']['id'])->toBe($staff->id)
        ->and($data['position']['employees'][0]['id'])->toBe($employee->id)
        ->and($data['superiors'])->toHaveCount(1)
        ->and($data['superiors'][0]['id'])->toBe($manager->id)
        ->and($data['subordinates'])->toHaveCount(1)
        ->and($data['subordinates'][0]['id'])->toBe($junior->id);
});

it('404s the org tree for a missing employee', function () {
    $this->getJson('/employees/9999/org-tree', actingAsRole('admin_hrd'))
        ->assertStatus(404);
});

it('forbids admin_cabang from another branch employee org tree', function () {
    $branch   = Branch::factory()->create();
    $position = Position::factory()->create(['branch_id' => $branch->id]);
    $employee = Employee::factory()->create(['branch_id' => $branch->id, 'position_id' => $position->id]);

    $this->getJson("/employees/{$employee->id}/org-tree", actingAsRole('admin_cabang', $branch->id + 99))
        ->assertStatus(403);
});
