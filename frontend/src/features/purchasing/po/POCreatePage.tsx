import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useCreatePO } from './api'
import { useBranchScope } from '../useBranchScope'
import { useBranchOptions } from '@/features/hris/employees/api'
import { useVendors } from '@/features/purchasing/vendors/api'
import { useItems } from '@/features/purchasing/items/api'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/PageHeader'
import { format } from '@/lib/format'
import { getApiError } from '@/lib/apiError'

interface Row { item_id: number; quantity: number; unit_price: number }

export function POCreatePage() {
  const nav = useNavigate()
  const { scoped, branchId } = useBranchScope()
  const branches = useBranchOptions()
  const vendors = useVendors({})
  const items = useItems({})
  const create = useCreatePO()

  const [branch, setBranch] = useState<number | ''>(scoped ? (branchId ?? '') : '')
  const [vendor, setVendor] = useState<number | ''>('')
  const [rows, setRows] = useState<Row[]>([])

  const total = useMemo(() => rows.reduce((s, r) => s + r.quantity * r.unit_price, 0), [rows])
  const addRow = () => setRows((r) => [...r, { item_id: items.data?.data[0]?.id ?? 0, quantity: 0, unit_price: 0 }])
  const setRow = (i: number, patch: Partial<Row>) => setRows((rs) => rs.map((r, j) => j === i ? { ...r, ...patch } : r))

  const submit = async () => {
    if (!branch || !vendor || rows.length === 0) { toast.error('Lengkapi cabang, vendor, dan minimal satu item'); return }
    try {
      const po = await create.mutateAsync({ branch_id: Number(branch), vendor_id: Number(vendor), tanggal_dibutuhkan: null, catatan: null, items: rows })
      toast.success('PO dibuat sebagai draft')
      nav(`/purchasing/purchase-orders/${po.id}`)
    } catch (e) { toast.error(getApiError(e).message) }
  }

  const field = 'rounded-lg border border-[var(--border)] px-3 py-2 text-sm'
  return (
    <div>
      <PageHeader title="Buat Purchase Order" />
      <div className="mb-4 grid gap-3 md:grid-cols-2">
        <label>Cabang
          <select className={`${field} w-full`} value={branch} disabled={scoped} onChange={(e) => setBranch(Number(e.target.value))}>
            <option value="">Pilih cabang</option>
            {branches.data?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </label>
        <label>Vendor
          <select className={`${field} w-full`} value={vendor} onChange={(e) => setVendor(Number(e.target.value))}>
            <option value="">Pilih vendor</option>
            {vendors.data?.data.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </label>
      </div>
      <Button variant="ghost" onClick={addRow}>Tambah Item</Button>
      <div className="mt-3 space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-2">
            <select className={field} value={r.item_id} onChange={(e) => setRow(i, { item_id: Number(e.target.value) })}>
              {items.data?.data.map((it) => <option key={it.id} value={it.id}>{it.name}</option>)}
            </select>
            <input aria-label="Qty" type="number" className={field} value={r.quantity || ''} onChange={(e) => setRow(i, { quantity: Number(e.target.value) })} />
            <input aria-label="Harga" type="number" className={field} value={r.unit_price || ''} onChange={(e) => setRow(i, { unit_price: Number(e.target.value) })} />
            <div className="text-right font-mono text-sm">{format.rupiah(r.quantity * r.unit_price)}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-end gap-4">
        <span className="text-sm text-[var(--muted)]">Total</span>
        <span className="text-lg font-bold">{format.rupiah(total)}</span>
      </div>
      <div className="mt-4 flex justify-end"><Button onClick={submit} disabled={create.isPending}>Simpan Draft</Button></div>
    </div>
  )
}
