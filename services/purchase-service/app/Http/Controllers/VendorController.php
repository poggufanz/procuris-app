<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVendorRequest;
use App\Http\Requests\UpdateVendorRequest;
use App\Http\Requests\VendorIndexRequest;
use App\Models\Vendor;
use App\Support\PurchaseScope;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    public function index(VendorIndexRequest $request): JsonResponse
    {
        $query = Vendor::query();
        $request->whenFilled('is_active', fn ($v) => $query->where('is_active', $request->boolean('is_active')));
        $request->whenFilled('search', fn ($v) => $query->where(fn ($q) =>
            $q->where('name', 'like', "%{$v}%")->orWhere('code', 'like', "%{$v}%")));

        return response()->json($query->paginate($request->integer('per_page', 15)));
    }

    public function show(int $id): JsonResponse
    {
        $vendor = Vendor::find($id);
        return $vendor ? response()->json($vendor) : response()->json(['message' => 'Not found'], 404);
    }

    public function store(StoreVendorRequest $request): JsonResponse
    {
        return response()->json(Vendor::create($request->validated()), 201);
    }

    public function update(UpdateVendorRequest $request, int $id): JsonResponse
    {
        $vendor = Vendor::find($id);
        if (! $vendor) return response()->json(['message' => 'Not found'], 404);
        $vendor->update($request->validated());
        return response()->json($vendor->fresh());
    }

    public function deactivate(int $id): JsonResponse
    {
        $vendor = Vendor::find($id);
        if (! $vendor) return response()->json(['message' => 'Not found'], 404);
        $vendor->update(['is_active' => false]);
        return response()->json($vendor->fresh());
    }

    public function purchaseHistory(int $id, Request $request): JsonResponse
    {
        if (! Vendor::whereKey($id)->exists()) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $pos = PurchaseScope::query($request->identity())
            ->where('vendor_id', $id)
            ->orderByDesc('id')
            ->paginate(15);

        return response()->json($pos);
    }
}
