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

    /** Branch position hierarchy as TreeNode[] (id, name, meta, children), employee's own position flagged. */
    public static function forEmployee(Employee $employee): array
    {
        $positions = Position::where('branch_id', $employee->branch_id)->get();
        $ids = $positions->pluck('id')->flip();
        $byParent = $positions->groupBy(fn ($p) =>
            ($p->parent_position_id !== null && $ids->has($p->parent_position_id)) ? $p->parent_position_id : 0
        );

        $build = function ($parentId) use (&$build, $byParent, $employee) {
            return $byParent->get($parentId, collect())->map(fn ($p) => [
                'id'       => $p->id,
                'name'     => $p->name,
                'meta'     => $p->id === $employee->position_id ? $employee->nama_lengkap : $p->division,
                'children' => $build($p->id),
            ])->values()->all();
        };

        return $build(0);
    }
}
