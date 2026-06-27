<?php

use App\Models\Item;
use App\Models\PurchaseOrder;
use App\Models\Vendor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;

uses(RefreshDatabase::class);

function poPayload(array $override = []): array
{
    $vendor = Vendor::factory()->create();
    $item = Item::factory()->create(['unit' => 'rim']);
    return array_merge([
        'branch_id' => 3,
        'vendor_id' => $vendor->id,
        'items' => [['item_id' => $item->id, 'quantity' => 2, 'unit_price' => 50000]],
    ], $override);
}

it('creates a PO, snapshots the branch, generates po_number and computes total', function () {
    $headers = actingAsRole('staff_purchasing', 3);
    fakeBranches([['id' => 3, 'name' => 'Bandung', 'code' => 'BDG']]);

    $this->postJson('/purchase-orders', poPayload(), $headers)
        ->assertStatus(201)
        ->assertJsonPath('status', 'draft')
        ->assertJsonPath('branch_name', 'Bandung')
        ->assertJsonPath('branch_code', 'BDG')
        ->assertJsonPath('po_number', 'PO/BDG/2026/0001')
        ->assertJsonPath('total_amount', '100000.00')
        ->assertJsonPath('requested_by', 1);
});

it('increments the per-branch-per-year sequence', function () {
    $headers = actingAsRole('superadmin');
    fakeBranches([['id' => 3, 'name' => 'Bandung', 'code' => 'BDG']]);
    $this->postJson('/purchase-orders', poPayload(), $headers)->assertJsonPath('po_number', 'PO/BDG/2026/0001');
    $this->postJson('/purchase-orders', poPayload(), $headers)->assertJsonPath('po_number', 'PO/BDG/2026/0002');
});

it('forbids a scoped role creating a PO for another branch', function () {
    $headers = actingAsRole('staff_purchasing', 3);
    fakeBranches([['id' => 5, 'name' => 'Jakarta', 'code' => 'JKT']]);
    $this->postJson('/purchase-orders', poPayload(['branch_id' => 5]), $headers)->assertStatus(403);
});

it('422s when the branch is not in the active list', function () {
    $headers = actingAsRole('superadmin');
    fakeBranches([['id' => 9, 'name' => 'Other', 'code' => 'OTH']]);
    $this->postJson('/purchase-orders', poPayload(['branch_id' => 3]), $headers)->assertStatus(422);
});

it('503s when Employee Service is down', function () {
    $headers = actingAsRole('superadmin');
    fakeBranchesDown();
    $this->postJson('/purchase-orders', poPayload(), $headers)->assertStatus(503);
});

it('401s when Employee rejects the forwarded token', function () {
    $headers = actingAsRole('superadmin');
    fakeBranchesUnauthorized();
    $this->postJson('/purchase-orders', poPayload(), $headers)->assertStatus(401);
});

it('resolves a branch from a bare-array /branches payload and forwards the bearer', function () {
    $headers = actingAsRole('superadmin');
    Http::fake([
        '*/auth/me' => fn () => Http::response($GLOBALS['__identity'], 200),
        '*/branches*' => Http::response([['id' => 3, 'name' => 'Bandung', 'code' => 'BDG']], 200),
    ]);

    $this->postJson('/purchase-orders', poPayload(), $headers)
        ->assertStatus(201)->assertJsonPath('branch_code', 'BDG');

    Http::assertSent(fn ($request) => str_contains($request->url(), '/branches')
        && $request->hasHeader('Authorization', 'Bearer test-token'));
});

it('ignores a client-sent total and recomputes from items', function () {
    $headers = actingAsRole('superadmin');
    fakeBranches([['id' => 3, 'name' => 'Bandung', 'code' => 'BDG']]);
    $this->postJson('/purchase-orders', poPayload(['total_amount' => 999999]), $headers)
        ->assertStatus(201)->assertJsonPath('total_amount', '100000.00');
});

it('edits items only while draft and recomputes the total', function () {
    $headers = actingAsRole('staff_purchasing', 3);
    fakeBranches([['id' => 3, 'name' => 'Bandung', 'code' => 'BDG']]);
    $id = $this->postJson('/purchase-orders', poPayload(), $headers)->json('id');

    $item = Item::factory()->create();
    $this->putJson("/purchase-orders/{$id}/items",
        ['items' => [['item_id' => $item->id, 'quantity' => 3, 'unit_price' => 10000]]], $headers)
        ->assertOk()->assertJsonPath('total_amount', '30000.00');

    PurchaseOrder::find($id)->update(['status' => 'submitted']);
    $this->putJson("/purchase-orders/{$id}/items",
        ['items' => [['item_id' => $item->id, 'quantity' => 1, 'unit_price' => 1]]], $headers)
        ->assertStatus(422);
});
