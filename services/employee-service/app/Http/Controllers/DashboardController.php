<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Employee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $identity = $request->identity();
        $scopedBranch = ($identity['role'] ?? null) === 'admin_cabang'
            ? (int) ($identity['branch_id'] ?? 0)
            : null;

        $active = fn () => Employee::query()
            ->where('status', 'aktif')
            ->when($scopedBranch !== null, fn ($q) => $q->where('branch_id', $scopedBranch));

        $totalActive = $active()->count();

        $totalBranches = Branch::where('is_active', true)
            ->when($scopedBranch !== null, fn ($q) => $q->where('id', $scopedBranch))
            ->count();

        $perDivision = $active()
            ->join('positions', 'employees.position_id', '=', 'positions.id')
            ->selectRaw('positions.division as division, count(*) as count')
            ->groupBy('positions.division')
            ->orderByDesc('count')
            ->get()
            ->map(fn ($r) => ['division' => $r->division, 'count' => (int) $r->count])
            ->all();

        $expiringContracts = $active()
            ->whereNotNull('tanggal_akhir_kontrak')
            ->whereBetween('tanggal_akhir_kontrak', [
                now()->toDateString(),
                now()->addDays(30)->toDateString(),
            ])
            ->orderBy('tanggal_akhir_kontrak')
            ->get(['id', 'nama_lengkap', 'tanggal_akhir_kontrak'])
            ->map(fn ($e) => [
                'id' => $e->id,
                'nama_lengkap' => $e->nama_lengkap,
                'tanggal_akhir_kontrak' => Carbon::parse($e->tanggal_akhir_kontrak)->toDateString(),
            ])
            ->all();

        return response()->json([
            'totalActive' => $totalActive,
            'totalBranches' => $totalBranches,
            'perDivision' => $perDivision,
            'expiringContracts' => $expiringContracts,
        ]);
    }
}
