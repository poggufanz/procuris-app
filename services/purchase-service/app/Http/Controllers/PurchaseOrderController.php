<?php

namespace App\Http\Controllers;

use App\Http\Requests\PurchaseOrderIndexRequest;
use App\Http\Requests\RejectPurchaseOrderRequest;
use App\Http\Requests\StorePurchaseOrderRequest;
use App\Http\Requests\UpdatePurchaseOrderItemsRequest;
use App\Models\Item;
use App\Models\PurchaseOrder;
use App\Models\Vendor;
use App\Support\BranchUnauthorizedException;
use App\Support\EmployeeClient;
use App\Support\PoNumber;
use App\Support\PurchaseOrderState;
use App\Support\PurchaseScope;
use Illuminate\Database\QueryException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PurchaseOrderController extends Controller
{
    public function __construct(private EmployeeClient $employee) {}

    public function index(PurchaseOrderIndexRequest $request): JsonResponse
    {
        $query = PurchaseScope::query($request->identity())->with('vendor');
        $request->whenFilled('status', fn ($v) => $query->where('status', $v));
        $request->whenFilled('branch_id', fn ($v) => $query->where('purchase_orders.branch_id', $v));
        $request->whenFilled('vendor_id', fn ($v) => $query->where('vendor_id', $v));
        $request->whenFilled('date_from', fn ($v) => $query->whereDate('tanggal_po', '>=', $v));
        $request->whenFilled('date_to', fn ($v) => $query->whereDate('tanggal_po', '<=', $v));

        return response()->json($query->orderByDesc('id')->paginate($request->integer('per_page', 15)));
    }

    public function show(int $id, PurchaseOrderIndexRequest $request): JsonResponse
    {
        $po = PurchaseScope::query($request->identity())->with(['vendor', 'items'])->find($id);
        return $po ? response()->json($po) : response()->json(['message' => 'Not found'], 404);
    }

    public function store(StorePurchaseOrderRequest $request): JsonResponse
    {
        $identity = $request->identity();
        $data = $request->validated();

        if (in_array($identity['role'], ['staff_purchasing', 'admin_cabang'], true)) {
            $branchId = $identity['branch_id'] ?? null;
            abort_if($branchId === null, 403, 'No branch assigned');
            abort_if((int) $data['branch_id'] !== (int) $branchId, 403, 'Cannot create PO for another branch');
        }

        try {
            $branches = $this->employee->activeBranches($request->header('Authorization'));
        } catch (BranchUnauthorizedException) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        } catch (ConnectionException) {
            return response()->json(['message' => 'Employee service unavailable'], 503);
        }

        $branch = collect($branches)->first(fn ($b) => (int) ($b['id'] ?? 0) === (int) $data['branch_id']);
        abort_if(! $branch || empty($branch['code']) || empty($branch['name']), 422, 'Branch is not active');

        $vendor = Vendor::where('id', $data['vendor_id'])->where('is_active', true)->first();
        abort_if(! $vendor, 422, 'Vendor is not active');

        $po = $this->createWithUniquePoNumber($data, $identity, $branch);

        return response()->json($po->load(['vendor', 'items']), 201);
    }

    private function createWithUniquePoNumber(array $data, array $identity, array $branch): PurchaseOrder
    {
        $tanggalPo = $data['tanggal_po'] ?? now()->toDateString();
        $year = (int) date('Y', strtotime($tanggalPo));
        $attempts = 0;

        while (true) {
            try {
                return DB::transaction(function () use ($data, $identity, $branch, $tanggalPo, $year) {
                    $po = PurchaseOrder::create([
                        'po_number' => PoNumber::next($branch['code'], $year),
                        'branch_id' => $branch['id'],
                        'branch_name' => $branch['name'],
                        'branch_code' => $branch['code'],
                        'vendor_id' => $data['vendor_id'],
                        'requested_by' => $identity['id'],
                        'status' => 'draft',
                        'tanggal_po' => $tanggalPo,
                        'tanggal_dibutuhkan' => $data['tanggal_dibutuhkan'] ?? null,
                        'catatan' => $data['catatan'] ?? null,
                        'total_amount' => 0,
                    ]);
                    $this->syncItems($po, $data['items']);

                    return $po;
                });
            } catch (QueryException $e) {
                if ($e->getCode() === '23000' && $attempts++ < 2) {
                    continue;
                }
                throw $e;
            }
        }
    }

    public function updateItems(UpdatePurchaseOrderItemsRequest $request, int $id): JsonResponse
    {
        $po = PurchaseScope::query($request->identity())->find($id);
        if (! $po) return response()->json(['message' => 'Not found'], 404);
        abort_unless($po->status === 'draft', 422, 'Items editable only while draft');

        DB::transaction(fn () => $this->syncItems($po, $request->validated()['items']));

        return response()->json($po->fresh()->load(['vendor', 'items']));
    }

    private function syncItems(PurchaseOrder $po, array $lines): void
    {
        $po->items()->delete();
        $total = '0';

        foreach ($lines as $line) {
            $item = Item::where('id', $line['item_id'])->where('is_active', true)->first();
            abort_if(! $item, 422, 'Item is not active');
            $subtotal = bcmul((string) $line['quantity'], (string) $line['unit_price'], 2);

            $po->items()->create([
                'item_id' => $item->id,
                'item_name' => $item->name,
                'quantity' => $line['quantity'],
                'unit' => $item->unit,
                'unit_price' => $line['unit_price'],
                'subtotal' => $subtotal,
                'notes' => $line['notes'] ?? null,
            ]);
            $total = bcadd($total, $subtotal, 2);
        }

        $po->update(['total_amount' => $total]);
    }

    public function submit(Request $request, int $id): JsonResponse
    {
        $po = $this->scopedOr404($request, $id);
        if (! $po instanceof PurchaseOrder) return $po;
        $target = PurchaseOrderState::target('submit', $po->status);
        abort_if($po->items()->count() === 0, 422, 'PO has no items');
        $po->update(['status' => $target]);
        return response()->json($po->fresh()->load(['vendor', 'items']));
    }

    public function approve(Request $request, int $id): JsonResponse
    {
        $po = $this->scopedOr404($request, $id);
        if (! $po instanceof PurchaseOrder) return $po;
        $target = PurchaseOrderState::target('approve', $po->status);
        $po->update(['status' => $target, 'approved_by' => $request->identity()['id'], 'approved_at' => now()]);
        return response()->json($po->fresh()->load(['vendor', 'items']));
    }

    public function reject(RejectPurchaseOrderRequest $request, int $id): JsonResponse
    {
        $po = $this->scopedOr404($request, $id);
        if (! $po instanceof PurchaseOrder) return $po;
        $target = PurchaseOrderState::target('reject', $po->status);
        $po->update(['status' => $target, 'rejection_reason' => $request->validated()['rejection_reason']]);
        return response()->json($po->fresh()->load(['vendor', 'items']));
    }

    public function receive(Request $request, int $id): JsonResponse
    {
        $request->validate(['tanggal_pengiriman' => ['nullable', 'date']]);
        $po = $this->scopedOr404($request, $id);
        if (! $po instanceof PurchaseOrder) return $po;
        $target = PurchaseOrderState::target('receive', $po->status);

        DB::transaction(function () use ($po, $target, $request) {
            foreach ($po->items as $line) {
                Item::whereKey($line->item_id)->update(['last_price' => $line->unit_price]);
            }
            $po->update([
                'status' => $target,
                'tanggal_pengiriman' => $request->input('tanggal_pengiriman') ?? now()->toDateString(),
            ]);
        });

        return response()->json($po->fresh()->load(['vendor', 'items']));
    }

    public function cancel(Request $request, int $id): JsonResponse
    {
        $po = $this->scopedOr404($request, $id);
        if (! $po instanceof PurchaseOrder) return $po;
        $target = PurchaseOrderState::target('cancel', $po->status);
        $po->update(['status' => $target]);
        return response()->json($po->fresh()->load(['vendor', 'items']));
    }

    private function scopedOr404(Request $request, int $id): PurchaseOrder|JsonResponse
    {
        $po = PurchaseScope::query($request->identity())->find($id);
        return $po ?: response()->json(['message' => 'Not found'], 404);
    }
}
