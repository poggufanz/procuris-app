<?php

use App\Models\Item;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function poInStatus(string $status, int $branchId = 3): PurchaseOrder
{
    $po = PurchaseOrder::factory()->create(['status' => $status, 'branch_id' => $branchId]);
    PurchaseOrderItem::factory()->create(['purchase_order_id' => $po->id]);
    return $po;
}

it('walks the happy path draft->submitted->approved->received', function () {
    $po = poInStatus('draft');

    $this->patchJson("/purchase-orders/{$po->id}/submit", [], actingAsRole('staff_purchasing', 3))
        ->assertOk()->assertJsonPath('status', 'submitted');
    $this->patchJson("/purchase-orders/{$po->id}/approve", [], actingAsRole('admin_purchasing'))
        ->assertOk()->assertJsonPath('status', 'approved');
    $this->patchJson("/purchase-orders/{$po->id}/receive", [], actingAsRole('staff_purchasing', 3))
        ->assertOk()->assertJsonPath('status', 'received');
});

it('rejects an illegal transition with 422', function () {
    $po = poInStatus('draft');
    $this->patchJson("/purchase-orders/{$po->id}/approve", [], actingAsRole('admin_purchasing'))->assertStatus(422);
    $received = poInStatus('received');
    $this->patchJson("/purchase-orders/{$received->id}/submit", [], actingAsRole('superadmin'))->assertStatus(422);
});

it('refuses to submit a PO with no items', function () {
    $po = PurchaseOrder::factory()->create(['status' => 'draft', 'branch_id' => 3]);
    $this->patchJson("/purchase-orders/{$po->id}/submit", [], actingAsRole('staff_purchasing', 3))->assertStatus(422);
});

it('requires a reason to reject and stamps approver on approve', function () {
    $po = poInStatus('submitted');
    $this->patchJson("/purchase-orders/{$po->id}/reject", [], actingAsRole('admin_purchasing'))->assertStatus(422);
    $this->patchJson("/purchase-orders/{$po->id}/reject", ['rejection_reason' => 'over budget'], actingAsRole('admin_purchasing'))
        ->assertOk()->assertJsonPath('status', 'rejected')->assertJsonPath('rejection_reason', 'over budget');

    $po2 = poInStatus('submitted');
    $this->patchJson("/purchase-orders/{$po2->id}/approve", [], actingAsUser(77, 'admin_purchasing'))
        ->assertOk()->assertJsonPath('approved_by', 77);
});

it('updates items.last_price on receive', function () {
    $item = Item::factory()->create(['last_price' => null]);
    $po = PurchaseOrder::factory()->create(['status' => 'approved', 'branch_id' => 3]);
    PurchaseOrderItem::factory()->create(['purchase_order_id' => $po->id, 'item_id' => $item->id, 'unit_price' => 12345]);

    $this->patchJson("/purchase-orders/{$po->id}/receive", [], actingAsRole('admin_cabang', 3))->assertOk();
    expect($item->fresh()->last_price)->toBe('12345.00');
});

it('forbids approve for staff_purchasing and 404s other-branch POs for scoped roles', function () {
    $po = poInStatus('submitted', branchId: 5);
    $this->patchJson("/purchase-orders/{$po->id}/approve", [], actingAsRole('staff_purchasing', 3))->assertStatus(403);
    $this->patchJson("/purchase-orders/{$po->id}/submit", [], actingAsRole('staff_purchasing', 3))->assertStatus(404);
});

it('cancels from draft and returns scoped vendor purchase-history', function () {
    $po = poInStatus('draft', branchId: 3);
    $this->patchJson("/purchase-orders/{$po->id}/cancel", [], actingAsRole('staff_purchasing', 3))
        ->assertOk()->assertJsonPath('status', 'cancelled');

    $this->getJson("/vendors/{$po->vendor_id}/purchase-history", actingAsRole('admin_purchasing'))
        ->assertOk()->assertJsonCount(1, 'data');
});
