<?php

namespace App\Support;

class PurchaseOrderState
{
    public const TRANSITIONS = [
        'submit'  => ['from' => ['draft'], 'to' => 'submitted'],
        'approve' => ['from' => ['submitted'], 'to' => 'approved'],
        'reject'  => ['from' => ['submitted'], 'to' => 'rejected'],
        'receive' => ['from' => ['approved'], 'to' => 'received'],
        'cancel'  => ['from' => ['draft', 'submitted'], 'to' => 'cancelled'],
    ];

    public static function target(string $action, string $current): string
    {
        $transition = self::TRANSITIONS[$action] ?? abort(422, "Unknown action: {$action}");
        abort_unless(in_array($current, $transition['from'], true), 422, "Invalid transition from {$current}");

        return $transition['to'];
    }
}
