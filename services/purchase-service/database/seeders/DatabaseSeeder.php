<?php

namespace Database\Seeders;

use App\Models\Item;
use App\Models\Vendor;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $vendor = Vendor::factory()->create(['name' => 'PT Sumber Makmur', 'code' => 'VND-001']);
        Item::factory()->count(3)->create(['default_vendor_id' => $vendor->id]);
    }
}
