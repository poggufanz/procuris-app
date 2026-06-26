<?php

namespace Database\Factories;

use App\Models\Item;
use Illuminate\Database\Eloquent\Factories\Factory;

class ItemFactory extends Factory
{
    protected $model = Item::class;

    public function definition(): array
    {
        return [
            'code' => 'ITM-'.$this->faker->unique()->numerify('#####'),
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->sentence(),
            'category' => $this->faker->randomElement(['ATK', 'Elektronik', 'Furnitur', 'Kebersihan']),
            'unit' => $this->faker->randomElement(['pcs', 'box', 'rim', 'unit', 'kg']),
            'default_vendor_id' => null,
            'last_price' => null,
            'is_active' => true,
        ];
    }
}
