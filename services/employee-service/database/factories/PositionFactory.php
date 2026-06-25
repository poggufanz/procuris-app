<?php

namespace Database\Factories;

use App\Models\Position;
use Illuminate\Database\Eloquent\Factories\Factory;

class PositionFactory extends Factory
{
    protected $model = Position::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->jobTitle(),
            'level' => $this->faker->numberBetween(1, 4),
            'division' => $this->faker->randomElement(['IT', 'Operasional', 'Finance', 'Supporting']),
            'parent_position_id' => null,
            'branch_id' => null,
        ];
    }
}
