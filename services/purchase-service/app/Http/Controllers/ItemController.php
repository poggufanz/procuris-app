<?php

namespace App\Http\Controllers;

use App\Http\Requests\ItemIndexRequest;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Models\Item;
use Illuminate\Http\JsonResponse;

class ItemController extends Controller
{
    public function index(ItemIndexRequest $request): JsonResponse
    {
        $query = Item::query();
        $request->whenFilled('category', fn ($v) => $query->where('category', $v));
        $request->whenFilled('is_active', fn ($v) => $query->where('is_active', $request->boolean('is_active')));
        $request->whenFilled('search', fn ($v) => $query->where(fn ($q) =>
            $q->where('name', 'like', "%{$v}%")->orWhere('code', 'like', "%{$v}%")));

        return response()->json($query->paginate($request->integer('per_page', 15)));
    }

    public function show(int $id): JsonResponse
    {
        $item = Item::find($id);
        return $item ? response()->json($item) : response()->json(['message' => 'Not found'], 404);
    }

    public function store(StoreItemRequest $request): JsonResponse
    {
        return response()->json(Item::create($request->validated()), 201);
    }

    public function update(UpdateItemRequest $request, int $id): JsonResponse
    {
        $item = Item::find($id);
        if (! $item) return response()->json(['message' => 'Not found'], 404);
        $item->update($request->validated());
        return response()->json($item->fresh());
    }

    public function deactivate(int $id): JsonResponse
    {
        $item = Item::find($id);
        if (! $item) return response()->json(['message' => 'Not found'], 404);
        $item->update(['is_active' => false]);
        return response()->json($item->fresh());
    }
}
