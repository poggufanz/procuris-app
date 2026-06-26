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

    public static function forEmployee(Employee $employee): array
    {
        $position = $employee->position;

        $superiors = [];
        $current = $position?->parent;
        while ($current) {
            $superiors[] = self::positionNode($current);
            $current = $current->parent;
        }

        $subordinates = $position
            ? Position::where('parent_position_id', $position->id)
                ->where('branch_id', $employee->branch_id)
                ->get()
                ->map(fn ($p) => self::positionNode($p))
                ->all()
            : [];

        return [
            'employee' => [
                'id'           => $employee->id,
                'nama_lengkap' => $employee->nama_lengkap,
                'status'       => $employee->status,
                'branch_id'    => $employee->branch_id,
            ],
            'position'     => $position ? self::positionNode($position) : null,
            'superiors'    => $superiors,
            'subordinates' => $subordinates,
        ];
    }

    private static function positionNode(Position $position): array
    {
        return [
            'id'        => $position->id,
            'name'      => $position->name,
            'level'     => $position->level,
            'division'  => $position->division,
            'employees' => $position->employees()->get()->map(fn ($e) => [
                'id'           => $e->id,
                'nama_lengkap' => $e->nama_lengkap,
                'status'       => $e->status,
            ])->values()->all(),
        ];
    }
}
