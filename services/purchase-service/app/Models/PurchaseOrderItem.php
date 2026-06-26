<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseOrderItem extends Model
{
    use HasFactory;

    protected $fillable = ['purchase_order_id', 'item_id', 'item_name', 'quantity', 'unit', 'unit_price', 'subtotal', 'notes'];
    protected $casts = ['quantity' => 'decimal:2', 'unit_price' => 'decimal:2', 'subtotal' => 'decimal:2'];

    public function purchaseOrder() { return $this->belongsTo(PurchaseOrder::class); }
    public function item() { return $this->belongsTo(Item::class); }
}
