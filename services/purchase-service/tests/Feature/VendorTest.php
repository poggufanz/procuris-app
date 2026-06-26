<?php

use App\Models\Vendor;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

$validVendor = [
    'name' => 'PT Sumber', 'code' => 'VND-001', 'contact_person' => 'Budi',
    'phone' => '0812', 'address' => 'Jl. A', 'payment_term_days' => 30,
];

it('lets purchasing roles read vendors', function () {
    Vendor::factory()->create();
    $this->getJson('/vendors', actingAsRole('staff_purchasing', 1))->assertOk();
});

it('403s HR roles on vendor reads', function () {
    Vendor::factory()->create();
    $this->getJson('/vendors', actingAsRole('admin_hrd'))->assertStatus(403);
    $this->getJson('/vendors', actingAsRole('karyawan', 1))->assertStatus(403);
});

it('forbids vendor create for staff_purchasing', function () use ($validVendor) {
    $this->postJson('/vendors', $validVendor, actingAsRole('staff_purchasing', 1))->assertStatus(403);
});

it('creates a vendor as admin_purchasing', function () use ($validVendor) {
    $this->postJson('/vendors', $validVendor, actingAsRole('admin_purchasing'))
        ->assertStatus(201)->assertJsonPath('code', 'VND-001');
});

it('rejects a duplicate vendor code', function () use ($validVendor) {
    Vendor::factory()->create(['code' => 'VND-001']);
    $this->postJson('/vendors', $validVendor, actingAsRole('admin_purchasing'))->assertStatus(422);
});

it('filters vendors by is_active and search', function () {
    Vendor::factory()->create(['name' => 'Alpha', 'is_active' => true]);
    Vendor::factory()->create(['name' => 'Beta', 'is_active' => false]);
    $this->getJson('/vendors?is_active=0', actingAsRole('admin_purchasing'))
        ->assertOk()->assertJsonCount(1, 'data');
    $this->getJson('/vendors?search=Alph', actingAsRole('admin_purchasing'))
        ->assertOk()->assertJsonCount(1, 'data');
});

it('deactivates a vendor', function () {
    $v = Vendor::factory()->create();
    $this->patchJson("/vendors/{$v->id}/deactivate", [], actingAsRole('admin_purchasing'))->assertOk();
    expect($v->fresh()->is_active)->toBeFalse();
});
