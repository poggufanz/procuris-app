<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'po_number', 'branch_id', 'branch_name', 'branch_code', 'vendor_id', 'requested_by',
        'status', 'tanggal_po', 'tanggal_dibutuhkan', 'tanggal_pengiriman', 'total_amount',
        'catatan', 'rejection_reason', 'approved_by', 'approved_at',
    ];
    protected $casts = [
        'tanggal_po' => 'date',
        'tanggal_dibutuhkan' => 'date',
        'tanggal_pengiriman' => 'date',
        'total_amount' => 'decimal:2',
        'approved_at' => 'datetime',
    ];

    public function vendor() { return $this->belongsTo(Vendor::class); }
    public function items() { return $this->hasMany(PurchaseOrderItem::class); }
}
