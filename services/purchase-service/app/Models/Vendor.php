<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'code', 'contact_person', 'phone', 'email', 'address', 'npwp', 'payment_term_days', 'is_active'];
    protected $casts = ['is_active' => 'boolean', 'payment_term_days' => 'integer'];

    public function items() { return $this->hasMany(Item::class, 'default_vendor_id'); }
    public function purchaseOrders() { return $this->hasMany(PurchaseOrder::class); }
}
