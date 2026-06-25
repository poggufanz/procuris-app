<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBranchRequest;
use App\Http\Requests\UpdateBranchRequest;
use App\Models\Branch;
use App\Support\OrgTree;
use Illuminate\Http\JsonResponse;

class BranchController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Branch::where('is_active', true)->paginate(15));
    }

    public function tree(): JsonResponse
    {
        return response()->json(OrgTree::build(Branch::all(), 'parent_id'));
    }

    public function show(int $id): JsonResponse
    {
        $branch = Branch::find($id);
        return $branch ? response()->json($branch) : response()->json(['message' => 'Not found'], 404);
    }

    public function store(StoreBranchRequest $request): JsonResponse
    {
        return response()->json(Branch::create($request->validated()), 201);
    }

    public function update(UpdateBranchRequest $request, int $id): JsonResponse
    {
        $branch = Branch::find($id);
        if (! $branch) return response()->json(['message' => 'Not found'], 404);

        $parentId = $request->input('parent_id');
        if ($parentId !== null && OrgTree::wouldCycle('branches', 'parent_id', $id, (int) $parentId)) {
            return response()->json(['message' => 'Parent would create a cycle'], 422);
        }
        $branch->update($request->validated());
        return response()->json($branch->fresh());
    }

    public function deactivate(int $id): JsonResponse
    {
        $branch = Branch::find($id);
        if (! $branch) return response()->json(['message' => 'Not found'], 404);

        $hasActiveChildren = Branch::where('parent_id', $id)->where('is_active', true)->exists();
        $hasEmployees = $branch->employees()->exists();
        if ($hasActiveChildren || $hasEmployees) {
            return response()->json(['message' => 'Branch has active children or employees'], 422);
        }
        $branch->update(['is_active' => false]);
        return response()->json($branch->fresh());
    }
}
