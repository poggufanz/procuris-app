<?php

namespace App\Http\Controllers;

use App\Support\PurchaseScope;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $identity = $request->identity();

        $poThisMonth = PurchaseScope::query($identity)
            ->whereYear('tanggal_po', now()->year)
            ->whereMonth('tanggal_po', now()->month)
            ->count();

        $pendingApproval = PurchaseScope::query($identity)
            ->where('status', 'submitted')
            ->count();

        // ponytail: total nilai semua PO yang masih hidup (selain cancelled/rejected); sempitkan kalau butuh
        $totalValue = (float) PurchaseScope::query($identity)
            ->whereNotIn('status', ['cancelled', 'rejected'])
            ->sum('total_amount');

        $byStatus = PurchaseScope::query($identity)
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->get()
            ->map(fn ($r) => ['status' => $r->status, 'count' => (int) $r->count])
            ->all();

        $recent = PurchaseScope::query($identity)
            ->orderByDesc('id')
            ->limit(10)
            ->get(['id', 'po_number', 'branch_name', 'total_amount', 'status'])
            ->map(fn ($po) => [
                'id' => $po->id,
                'po_number' => $po->po_number,
                'branch_name' => $po->branch_name,
                'total_amount' => (float) $po->total_amount,
                'status' => $po->status,
            ])
            ->all();

        return response()->json([
            'poThisMonth' => $poThisMonth,
            'pendingApproval' => $pendingApproval,
            'totalValue' => $totalValue,
            'byStatus' => $byStatus,
            'recent' => $recent,
        ]);
    }
}
