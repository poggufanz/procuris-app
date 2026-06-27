<?php

namespace App\Support;

use App\Models\PurchaseOrder;
use Illuminate\Database\Eloquent\Builder;

class PurchaseScope
{
    public static function query(array $identity): Builder
    {
        $role = $identity['role'] ?? null;
        $query = PurchaseOrder::query();

        if (in_array($role, ['superadmin', 'admin_purchasing'], true)) {
            return $query;
        }
        if (in_array($role, ['staff_purchasing', 'admin_cabang'], true)) {
            $branchId = $identity['branch_id'] ?? null;
            abort_if($branchId === null, 403, 'No branch assigned');
            return $query->where('purchase_orders.branch_id', $branchId);
        }
        abort(403, 'Forbidden');
    }
}
