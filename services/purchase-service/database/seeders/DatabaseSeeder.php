<?php

namespace Database\Seeders;

use App\Models\Item;
use App\Models\PurchaseOrder;
use App\Models\Vendor;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    // branch_* are snapshots of db_hrm branch id 2 (BDG). requested_by=6 (staff_purchasing),
    // approved_by=5 (admin_purchasing) — both auth-service user IDs.
    public function run(): void
    {
        $v1 = Vendor::updateOrCreate(['code' => 'VND-001'], [
            'name' => 'PT Sumber Makmur', 'contact_person' => 'Andi Wijaya', 'phone' => '022-4201234',
            'email' => 'sales@sumbermakmur.co.id', 'address' => 'Jl. Industri No. 12, Bandung',
            'npwp' => '01.234.567.8-901.000', 'payment_term_days' => 30, 'is_active' => true,
        ]);
        $v2 = Vendor::updateOrCreate(['code' => 'VND-002'], [
            'name' => 'CV Mitra Sejahtera', 'contact_person' => 'Bambang S.', 'phone' => '021-5550987',
            'email' => 'order@mitrasejahtera.co.id', 'address' => 'Jl. Mangga Dua No. 8, Jakarta',
            'npwp' => '02.345.678.9-012.000', 'payment_term_days' => 14, 'is_active' => true,
        ]);
        $v3 = Vendor::updateOrCreate(['code' => 'VND-003'], [
            'name' => 'PT Teknindo Jaya', 'contact_person' => 'Clara Tan', 'phone' => '031-7778899',
            'email' => 'cs@teknindojaya.co.id', 'address' => 'Jl. Rungkut No. 21, Surabaya',
            'npwp' => '03.456.789.0-123.000', 'payment_term_days' => 45, 'is_active' => true,
        ]);

        $i1 = Item::updateOrCreate(['code' => 'ITM-001'], ['name' => 'Kertas A4 80gsm', 'description' => 'Rim isi 500 lembar', 'category' => 'ATK', 'unit' => 'rim', 'default_vendor_id' => $v1->id, 'last_price' => 52000, 'is_active' => true]);
        $i2 = Item::updateOrCreate(['code' => 'ITM-002'], ['name' => 'Tinta Printer Hitam', 'description' => 'Botol 70ml', 'category' => 'ATK', 'unit' => 'botol', 'default_vendor_id' => $v1->id, 'last_price' => 120000, 'is_active' => true]);
        $i3 = Item::updateOrCreate(['code' => 'ITM-003'], ['name' => 'Laptop 14 inch', 'description' => 'Core i5, 16GB RAM, 512GB SSD', 'category' => 'Elektronik', 'unit' => 'unit', 'default_vendor_id' => $v3->id, 'last_price' => 8500000, 'is_active' => true]);
        $i4 = Item::updateOrCreate(['code' => 'ITM-004'], ['name' => 'Kursi Kantor Ergonomis', 'description' => 'Hydraulic, sandaran mesh', 'category' => 'Furnitur', 'unit' => 'unit', 'default_vendor_id' => $v2->id, 'last_price' => 950000, 'is_active' => true]);
        $i5 = Item::updateOrCreate(['code' => 'ITM-005'], ['name' => 'Pulpen Gel 0.5mm', 'description' => 'Box isi 12', 'category' => 'ATK', 'unit' => 'box', 'default_vendor_id' => $v2->id, 'last_price' => 25000, 'is_active' => true]);

        $bdg = ['branch_id' => 2, 'branch_name' => 'Cabang Bandung', 'branch_code' => 'BDG'];

        $makePO = function (array $po, array $lines) {
            $order = PurchaseOrder::updateOrCreate(['po_number' => $po['po_number']], $po);
            $order->items()->delete();
            $total = 0;
            foreach ($lines as $ln) {
                $subtotal = $ln['qty'] * $ln['price'];
                $total += $subtotal;
                $order->items()->create([
                    'item_id'    => $ln['item']->id,
                    'item_name'  => $ln['item']->name,
                    'quantity'   => $ln['qty'],
                    'unit'       => $ln['item']->unit,
                    'unit_price' => $ln['price'],
                    'subtotal'   => $subtotal,
                    'notes'      => $ln['notes'] ?? null,
                ]);
            }
            $order->update(['total_amount' => $total]);

            return $order;
        };

        // One PO per status to exercise the full state machine.
        $makePO(array_merge($bdg, [
            'po_number' => 'PO/BDG/2026/0001', 'vendor_id' => $v1->id, 'requested_by' => 6, 'status' => 'draft',
            'tanggal_po' => '2026-06-01', 'tanggal_dibutuhkan' => '2026-06-20', 'catatan' => 'Restok ATK bulanan',
        ]), [['item' => $i1, 'qty' => 10, 'price' => 52000], ['item' => $i5, 'qty' => 5, 'price' => 25000]]);

        $makePO(array_merge($bdg, [
            'po_number' => 'PO/BDG/2026/0002', 'vendor_id' => $v1->id, 'requested_by' => 6, 'status' => 'submitted',
            'tanggal_po' => '2026-06-03', 'tanggal_dibutuhkan' => '2026-06-18',
        ]), [['item' => $i2, 'qty' => 6, 'price' => 120000]]);

        $makePO(array_merge($bdg, [
            'po_number' => 'PO/BDG/2026/0003', 'vendor_id' => $v1->id, 'requested_by' => 6, 'status' => 'approved',
            'tanggal_po' => '2026-06-05', 'tanggal_dibutuhkan' => '2026-06-25',
            'approved_by' => 5, 'approved_at' => '2026-06-10 10:00:00',
        ]), [['item' => $i1, 'qty' => 20, 'price' => 51000], ['item' => $i5, 'qty' => 10, 'price' => 24000]]);

        $makePO(array_merge($bdg, [
            'po_number' => 'PO/BDG/2026/0004', 'vendor_id' => $v3->id, 'requested_by' => 6, 'status' => 'received',
            'tanggal_po' => '2026-05-15', 'tanggal_dibutuhkan' => '2026-05-30', 'tanggal_pengiriman' => '2026-05-28',
            'approved_by' => 5, 'approved_at' => '2026-05-18 09:00:00',
        ]), [['item' => $i3, 'qty' => 2, 'price' => 8400000]]);
        // State-machine rule: on `received`, item.last_price is updated from the PO line price.
        $i3->update(['last_price' => 8400000]);

        $makePO(array_merge($bdg, [
            'po_number' => 'PO/BDG/2026/0005', 'vendor_id' => $v2->id, 'requested_by' => 6, 'status' => 'rejected',
            'tanggal_po' => '2026-06-06', 'tanggal_dibutuhkan' => '2026-06-22',
            'approved_by' => 5, 'rejection_reason' => 'Budget cabang belum tersedia bulan ini.',
        ]), [['item' => $i4, 'qty' => 4, 'price' => 950000]]);

        $makePO(array_merge($bdg, [
            'po_number' => 'PO/BDG/2026/0006', 'vendor_id' => $v1->id, 'requested_by' => 6, 'status' => 'cancelled',
            'tanggal_po' => '2026-06-07', 'catatan' => 'Dibatalkan, salah input vendor',
        ]), [['item' => $i5, 'qty' => 2, 'price' => 25000]]);
    }
}
