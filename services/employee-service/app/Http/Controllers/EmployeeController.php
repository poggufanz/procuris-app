<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeIndexRequest;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Employee;
use App\Support\AuthClient;
use App\Support\OrgChart;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    private function branchScope(Request $request): ?int
    {
        $identity = $request->identity();
        return $identity['role'] === 'admin_cabang' ? (int) $identity['branch_id'] : null;
    }

    public function index(EmployeeIndexRequest $request): JsonResponse
    {
        $query = Employee::query()->with(['branch:id,name', 'position:id,name']);

        $scopedBranch = $this->branchScope($request);
        if ($scopedBranch !== null) {
            $query->where('branch_id', $scopedBranch);
        } elseif ($request->filled('branch_id')) {
            $query->where('branch_id', $request->integer('branch_id'));
        }

        if ($request->filled('position_id')) {
            $query->where('position_id', $request->integer('position_id'));
        }
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }
        if ($request->filled('division') || $request->filled('level')) {
            $query->whereHas('position', function ($q) use ($request) {
                if ($request->filled('division')) {
                    $q->where('division', $request->input('division'));
                }
                if ($request->filled('level')) {
                    $q->where('level', $request->integer('level'));
                }
            });
        }
        if ($request->filled('search')) {
            $query->where('nama_lengkap', 'like', '%'.$request->input('search').'%');
        }

        $page = $query->paginate(15);
        $names = (new AuthClient())->namesByIds((string) $request->header('Authorization'), $page->pluck('user_id')->all());
        $page->getCollection()->each(fn ($e) => $e->setAttribute('user_name', $names[$e->user_id] ?? null));

        return response()->json($page);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $employee = Employee::with(['branch:id,name', 'position:id,name'])->find($id);
        if (! $employee) return response()->json(['message' => 'Not found'], 404);

        $scopedBranch = $this->branchScope($request);
        if ($scopedBranch !== null && $employee->branch_id !== $scopedBranch) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $names = (new AuthClient())->namesByIds((string) $request->header('Authorization'), [$employee->user_id]);
        $employee->setAttribute('user_name', $names[$employee->user_id] ?? null);

        return response()->json($employee);
    }

    public function store(StoreEmployeeRequest $request): JsonResponse
    {
        $scopedBranch = $this->branchScope($request);
        $data = $request->validated();

        if ($scopedBranch !== null && (int) $data['branch_id'] !== $scopedBranch) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json(Employee::create($data), 201);
    }

    public function update(UpdateEmployeeRequest $request, int $id): JsonResponse
    {
        $employee = Employee::find($id);
        if (! $employee) return response()->json(['message' => 'Not found'], 404);

        $scopedBranch = $this->branchScope($request);
        if ($scopedBranch !== null && $employee->branch_id !== $scopedBranch) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validated();
        if ($scopedBranch !== null && (int) $data['branch_id'] !== $scopedBranch) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $employee->update($data);
        return response()->json($employee->fresh());
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $employee = Employee::find($id);
        if (! $employee) return response()->json(['message' => 'Not found'], 404);

        $scopedBranch = $this->branchScope($request);
        if ($scopedBranch !== null && $employee->branch_id !== $scopedBranch) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $employee->delete();
        return response()->json(null, 204);
    }

    public function orgTree(Request $request, int $id): JsonResponse
    {
        $employee = Employee::with('position')->find($id);
        if (! $employee) return response()->json(['message' => 'Not found'], 404);

        $scopedBranch = $this->branchScope($request);
        if ($scopedBranch !== null && $employee->branch_id !== $scopedBranch) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json(OrgChart::forEmployee($employee));
    }
}
