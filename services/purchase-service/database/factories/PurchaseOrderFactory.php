<?php

namespace Database\Factories;

use App\Models\PurchaseOrder;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;

class PurchaseOrderFactory extends Factory
{
    protected $model = PurchaseOrder::class;

    public function definition(): array
    {
        $code = strtoupper($this->faker->lexify('???'));
        return [
            'po_number' => "PO/{$code}/2026/".$this->faker->unique()->numerify('####'),
            'branch_id' => $this->faker->numberBetween(1, 10),
            'branch_name' => $this->faker->city(),
            'branch_code' => $code,
            'vendor_id' => Vendor::factory(),
            'requested_by' => $this->faker->numberBetween(1, 1000),
            'status' => 'draft',
            'tanggal_po' => '2026-06-26',
            'tanggal_dibutuhkan' => null,
            'tanggal_pengiriman' => null,
            'total_amount' => 0,
            'catatan' => null,
            'rejection_reason' => null,
            'approved_by' => null,
            'approved_at' => null,
        ];
    }
}
