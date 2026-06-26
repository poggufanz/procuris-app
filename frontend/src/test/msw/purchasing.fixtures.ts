export const vendors = [
  { id: 1, name: 'Maju Jaya', code: 'VND-001', contact_person: 'Andi', phone: '0811', email: null, address: 'Bandung', npwp: null, payment_term_days: 30, is_active: true },
]
export const items = [
  { id: 1, code: 'ITM-0001', name: 'Kertas A4 80gsm', description: null, category: 'ATK', unit: 'rim', default_vendor_id: 1, last_price: 52000, is_active: true },
]
export const purchaseOrders = [
  { id: 1, po_number: 'PO/BDG/2026/0001', branch_id: 1, branch_name: 'Bandung', branch_code: 'BDG', vendor_id: 1, requested_by: 5, status: 'submitted' as const, tanggal_po: '2026-07-10', tanggal_dibutuhkan: '2026-07-12', total_amount: 2600000, catatan: null, rejection_reason: null,
    items: [{ id: 1, item_id: 1, item_name: 'Kertas A4 80gsm', quantity: 50, unit: 'rim', unit_price: 52000, subtotal: 2600000, notes: null }] },
]
