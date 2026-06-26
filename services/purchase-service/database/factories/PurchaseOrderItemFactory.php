<?php

namespace Database\Factories;

use App\Models\Item;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class PurchaseOrderItemFactory extends Factory
{
    protected $model = PurchaseOrderItem::class;

    public function definition(): array
    {
        $qty = $this->faker->numberBetween(1, 20);
        $price = $this->faker->numberBetween(1000, 500000);
        return [
            'purchase_order_id' => PurchaseOrder::factory(),
            'item_id' => Item::factory(),
            'item_name' => $this->faker->words(3, true),
            'quantity' => $qty,
            'unit' => 'pcs',
            'unit_price' => $price,
            'subtotal' => bcmul((string) $qty, (string) $price, 2),
            'notes' => null,
        ];
    }
}
