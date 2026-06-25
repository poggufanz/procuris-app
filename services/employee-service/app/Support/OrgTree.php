<?php

namespace App\Support;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class OrgTree
{
    public static function build(Collection $rows, string $parentKey): array
    {
        $byParent = $rows->groupBy(fn ($r) => $r->{$parentKey} === null ? 0 : $r->{$parentKey});

        $attach = function ($parentId) use (&$attach, $byParent) {
            return $byParent->get($parentId, collect())->map(fn ($n) => array_merge(
                $n->toArray(),
                ['children' => $attach($n->id)],
            ))->values()->all();
        };

        return $attach(0);
    }

    public static function wouldCycle(string $table, string $parentKey, int $nodeId, ?int $newParentId): bool
    {
        if ($newParentId === null) return false;
        if ($newParentId === $nodeId) return true;

        $cursor = $newParentId;
        $seen = [];
        while ($cursor !== null) {
            if ((int) $cursor === $nodeId) return true;
            if (isset($seen[$cursor])) break;
            $seen[$cursor] = true;
            $cursor = DB::table($table)->where('id', $cursor)->value($parentKey);
        }
        return false;
    }
}
