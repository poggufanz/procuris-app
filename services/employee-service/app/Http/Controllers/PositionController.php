<?php

namespace App\Http\Controllers;

use App\Http\Requests\PositionIndexRequest;
use App\Http\Requests\StorePositionRequest;
use App\Http\Requests\UpdatePositionRequest;
use App\Models\Position;
use App\Support\OrgTree;
use Illuminate\Http\JsonResponse;

class PositionController extends Controller
{
    public function index(PositionIndexRequest $request): JsonResponse
    {
        $query = Position::query();

        if ($request->filled('branch_id')) {
            $query->where('branch_id', $request->integer('branch_id'));
        }
        if ($request->filled('division')) {
            $query->where('division', $request->input('division'));
        }
        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->input('search').'%');
        }

        return response()->json($query->paginate(15));
    }

    public function tree(): JsonResponse
    {
        return response()->json(OrgTree::build(Position::all(), 'parent_position_id'));
    }

    public function show(int $id): JsonResponse
    {
        $position = Position::find($id);
        return $position
            ? response()->json($position)
            : response()->json(['message' => 'Not found'], 404);
    }

    public function store(StorePositionRequest $request): JsonResponse
    {
        return response()->json(Position::create($request->validated()), 201);
    }

    public function update(UpdatePositionRequest $request, int $id): JsonResponse
    {
        $position = Position::find($id);
        if (! $position) return response()->json(['message' => 'Not found'], 404);

        $parentId = $request->input('parent_position_id');
        if ($parentId !== null && OrgTree::wouldCycle('positions', 'parent_position_id', $id, (int) $parentId)) {
            return response()->json(['message' => 'Parent would create a cycle'], 422);
        }

        $position->update($request->validated());
        return response()->json($position->fresh());
    }

    public function destroy(int $id): JsonResponse
    {
        $position = Position::find($id);
        if (! $position) return response()->json(['message' => 'Not found'], 404);

        $hasChildren = Position::where('parent_position_id', $id)->exists();
        $hasEmployees = $position->employees()->exists();
        if ($hasChildren || $hasEmployees) {
            return response()->json(['message' => 'Position has children or employees'], 422);
        }

        $position->delete();
        return response()->json(null, 204);
    }
}
