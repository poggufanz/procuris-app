<?php

namespace Database\Factories;

use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;

class VendorFactory extends Factory
{
    protected $model = Vendor::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->company(),
            'code' => 'VND-'.$this->faker->unique()->numerify('####'),
            'contact_person' => $this->faker->name(),
            'phone' => $this->faker->numerify('08##########'),
            'email' => $this->faker->safeEmail(),
            'address' => $this->faker->address(),
            'npwp' => $this->faker->numerify('##.###.###.#-###.###'),
            'payment_term_days' => $this->faker->randomElement([14, 30, 45, 60]),
            'is_active' => true,
        ];
    }
}
