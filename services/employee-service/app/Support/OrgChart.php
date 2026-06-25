<?php

namespace App\Support;

use App\Models\Branch;
use App\Models\Employee;
use App\Models\Position;

class OrgChart
{
    public static function build(): array
    {
        $branches  = Branch::where('is_active', true)->get()->keyBy('id');
        $positions = Position::all()->groupBy('branch_id');
        $employees = Employee::all()->groupBy('position_id');

        return $branches->map(function ($branch) use ($positions, $employees) {
            $branchPositions = $positions->get($branch->id, collect());
            return [
                'id'        => $branch->id,
                'name'      => $branch->name,
                'code'      => $branch->code,
                'positions' => $branchPositions->map(function ($pos) use ($employees) {
                    return [
                        'id'        => $pos->id,
                        'name'      => $pos->name,
                        'level'     => $pos->level,
                        'division'  => $pos->division,
                        'employees' => $employees->get($pos->id, collect())->map(fn ($e) => [
                            'id'           => $e->id,
                            'nama_lengkap' => $e->nama_lengkap,
                            'status'       => $e->status,
                        ])->values()->all(),
                    ];
                })->values()->all(),
            ];
        })->values()->all();
    }
}
