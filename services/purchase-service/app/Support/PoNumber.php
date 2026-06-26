<?php

namespace App\Support;

use Illuminate\Support\Facades\DB;

class PoNumber
{
    public static function next(string $branchCode, int $year): string
    {
        $prefix = "PO/{$branchCode}/{$year}/";
        $like = str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $prefix).'%';
        $count = DB::table('purchase_orders')
            ->where('po_number', 'like', $like)
            ->lockForUpdate()
            ->count();

        return $prefix.str_pad((string) ($count + 1), 4, '0', STR_PAD_LEFT);
    }
}
