<?php

use App\Models\Item;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Vendor;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('enforces unique vendor and item codes', function () {
    $v = Vendor::factory()->create();
    expect(fn () => Vendor::factory()->create(['code' => $v->code]))->toThrow(Exception::class);
    $i = Item::factory()->create();
    expect(fn () => Item::factory()->create(['code' => $i->code]))->toThrow(Exception::class);
});

it('relates a PO to its vendor and line items', function () {
    $po = PurchaseOrder::factory()->create();
    PurchaseOrderItem::factory()->create(['purchase_order_id' => $po->id]);
    expect($po->vendor)->not->toBeNull();
    expect($po->items)->toHaveCount(1);
});

it('enforces unique po_number', function () {
    $po = PurchaseOrder::factory()->create();
    expect(fn () => PurchaseOrder::factory()->create(['po_number' => $po->po_number]))->toThrow(Exception::class);
});

it('cascades line items when a PO is deleted', function () {
    $po = PurchaseOrder::factory()->create();
    PurchaseOrderItem::factory()->create(['purchase_order_id' => $po->id]);
    $po->delete();
    expect(PurchaseOrderItem::count())->toBe(0);
});
