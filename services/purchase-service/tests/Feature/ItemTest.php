<?php

use App\Models\Item;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('creates an item as admin_purchasing and ignores client last_price', function () {
    $this->postJson('/items', [
        'code' => 'ITM-0001', 'name' => 'Kertas A4', 'category' => 'ATK', 'unit' => 'rim',
        'last_price' => 99999,
    ], actingAsRole('admin_purchasing'))->assertStatus(201);
    expect(Item::first()->last_price)->toBeNull();
});

it('forbids item create for staff_purchasing but allows read', function () {
    Item::factory()->create();
    $this->getJson('/items', actingAsRole('staff_purchasing', 1))->assertOk();
    $this->postJson('/items', ['code' => 'X', 'name' => 'Y', 'category' => 'ATK', 'unit' => 'pcs'],
        actingAsRole('staff_purchasing', 1))->assertStatus(403);
});

it('403s HR roles on items', function () {
    $this->getJson('/items', actingAsRole('karyawan', 1))->assertStatus(403);
});

it('filters items by category, is_active and search', function () {
    Item::factory()->create(['name' => 'Pulpen', 'category' => 'ATK', 'is_active' => true]);
    Item::factory()->create(['name' => 'Laptop', 'category' => 'Elektronik', 'is_active' => false]);
    $this->getJson('/items?category=ATK', actingAsRole('admin_purchasing'))->assertOk()->assertJsonCount(1, 'data');
    $this->getJson('/items?is_active=0', actingAsRole('admin_purchasing'))->assertOk()->assertJsonCount(1, 'data');
    $this->getJson('/items?search=Pulp', actingAsRole('admin_purchasing'))->assertOk()->assertJsonCount(1, 'data');
});

it('rejects a duplicate item code', function () {
    Item::factory()->create(['code' => 'ITM-0001']);
    $this->postJson('/items', ['code' => 'ITM-0001', 'name' => 'X', 'category' => 'ATK', 'unit' => 'pcs'],
        actingAsRole('admin_purchasing'))->assertStatus(422);
});
