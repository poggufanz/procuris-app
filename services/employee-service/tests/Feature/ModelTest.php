<?php

use App\Models\Branch;
use App\Models\Employee;
use App\Models\Position;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('builds branch hierarchy', function () {
    $parent = Branch::factory()->create();
    $child = Branch::factory()->create(['parent_id' => $parent->id]);
    expect($parent->children->pluck('id'))->toContain($child->id);
    expect($child->parent->id)->toBe($parent->id);
});

it('soft deletes employees and positions', function () {
    $e = Employee::factory()->create();
    $e->delete();
    expect(Employee::count())->toBe(0);
    expect(Employee::withTrashed()->count())->toBe(1);
});

it('enforces unique user_id', function () {
    $e = Employee::factory()->create();
    expect(fn () => Employee::factory()->create(['user_id' => $e->user_id]))->toThrow(Exception::class);
});

it('relates employee to branch and position', function () {
    $e = Employee::factory()->create();
    expect($e->branch)->not->toBeNull();
    expect($e->position)->not->toBeNull();
});
