<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'name', 'description', 'category', 'unit', 'default_vendor_id', 'last_price', 'is_active'];
    protected $casts = ['is_active' => 'boolean', 'last_price' => 'decimal:2'];

    public function defaultVendor() { return $this->belongsTo(Vendor::class, 'default_vendor_id'); }
}
