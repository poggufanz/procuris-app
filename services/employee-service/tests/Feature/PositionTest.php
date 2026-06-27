<?php

use App\Models\Branch;
use App\Models\Employee;
use App\Models\Position;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('lists positions for any role', function () {
    Position::factory()->count(3)->create();
    $this->getJson('/positions', actingAsRole('karyawan', 1))
        ->assertOk()->assertJsonCount(3, 'data');
});

it('filters positions by branch', function () {
    $b1 = Branch::factory()->create();
    $b2 = Branch::factory()->create();
    Position::factory()->create(['branch_id' => $b1->id]);
    Position::factory()->create(['branch_id' => $b2->id]);
    $this->getJson("/positions?branch_id={$b1->id}", actingAsRole('karyawan', 1))
        ->assertOk()->assertJsonCount(1, 'data');
});

it('filters positions by division', function () {
    Position::factory()->create(['division' => 'HR']);
    Position::factory()->create(['division' => 'IT']);
    $this->getJson('/positions?division=HR', actingAsRole('karyawan', 1))
        ->assertOk()->assertJsonCount(1, 'data');
});

it('filters positions by search', function () {
    Position::factory()->create(['name' => 'Manager HRD']);
    Position::factory()->create(['name' => 'Staff IT']);
    $this->getJson('/positions?search=Manager', actingAsRole('karyawan', 1))
        ->assertOk()->assertJsonCount(1, 'data');
});

it('forbids create for non-HR roles', function () {
    $this->postJson('/positions', [], actingAsRole('karyawan', 1))
        ->assertStatus(403);
});

it('creates a position as admin_hrd', function () {
    $this->postJson('/positions', [
        'name' => 'Manager',
        'level' => 2,
        'division' => 'HR',
    ], actingAsRole('admin_hrd'))
        ->assertStatus(201)->assertJsonPath('name', 'Manager');
});

it('rejects a cyclic parent_position_id', function () {
    $a = Position::factory()->create();
    $b = Position::factory()->create(['parent_position_id' => $a->id]);
    $this->putJson("/positions/{$a->id}", [
        'name' => $a->name,
        'level' => $a->level,
        'division' => $a->division,
        'parent_position_id' => $b->id,
    ], actingAsRole('admin_hrd'))->assertStatus(422);
});

it('guards delete when children exist', function () {
    $parent = Position::factory()->create();
    Position::factory()->create(['parent_position_id' => $parent->id]);
    $this->deleteJson("/positions/{$parent->id}", [], actingAsRole('admin_hrd'))
        ->assertStatus(422);
});

it('guards delete when employees assigned', function () {
    $position = Position::factory()->create();
    Employee::factory()->create(['position_id' => $position->id]);
    $this->deleteJson("/positions/{$position->id}", [], actingAsRole('admin_hrd'))
        ->assertStatus(422);
});

it('soft deletes a position with no dependencies', function () {
    $position = Position::factory()->create();
    $this->deleteJson("/positions/{$position->id}", [], actingAsRole('admin_hrd'))
        ->assertStatus(204);
    $this->assertSoftDeleted('positions', ['id' => $position->id]);
});

it('returns a position tree', function () {
    $a = Position::factory()->create(['parent_position_id' => null]);
    Position::factory()->create(['parent_position_id' => $a->id]);
    $this->getJson('/positions/tree', actingAsRole('karyawan', 1))
        ->assertOk()->assertJsonPath('0.children.0.parent_position_id', $a->id);
});
