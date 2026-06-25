<?php

use App\Models\Branch;
use App\Models\Employee;
use App\Models\Position;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('returns org tree with branches positions and employees', function () {
    $branch   = Branch::factory()->create();
    $position = Position::factory()->create(['branch_id' => $branch->id]);
    $employee = Employee::factory()->create([
        'branch_id'   => $branch->id,
        'position_id' => $position->id,
    ]);

    $response = $this->getJson('/employees/org-tree', actingAsRole('admin_hrd'))
        ->assertOk();

    $data = $response->json();
    expect($data)->toHaveCount(1)
        ->and($data[0]['id'])->toBe($branch->id)
        ->and($data[0]['positions'])->toHaveCount(1)
        ->and($data[0]['positions'][0]['employees'])->toHaveCount(1)
        ->and($data[0]['positions'][0]['employees'][0]['id'])->toBe($employee->id);
});

it('excludes inactive branches from org tree', function () {
    Branch::factory()->create(['is_active' => false]);
    $this->getJson('/employees/org-tree', actingAsRole('admin_hrd'))
        ->assertOk()->assertExactJson([]);
});

it('returns empty positions array when branch has no positions', function () {
    Branch::factory()->create();
    $data = $this->getJson('/employees/org-tree', actingAsRole('admin_hrd'))
        ->assertOk()->json();
    expect($data[0]['positions'])->toBeArray()->toHaveCount(0);
});
