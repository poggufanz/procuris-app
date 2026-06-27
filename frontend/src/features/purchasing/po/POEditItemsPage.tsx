import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { usePO, useUpdatePOItems } from './api'
import { useItems } from '@/features/purchasing/items/api'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { format } from '@/lib/format'
import { getApiError } from '@/lib/apiError'

interface Row { item_id: number; quantity: number; unit_price: number }

export function POEditItemsPage() {
  const id = Number(useParams().id)
  const nav = useNavigate()
  const { data: po } = usePO(id)
  const items = useItems({})
  const update = useUpdatePOItems(id)
  const [rows, setRows] = useState<Row[]>([])
  const [seeded, setSeeded] = useState(false)

  useEffect(() => {
    if (po && !seeded) {
      setRows(po.items.map((it) => ({ item_id: it.item_id, quantity: it.quantity, unit_price: it.unit_price })))
      setSeeded(true)
    }
  }, [po, seeded])

  const total = useMemo(() => rows.reduce((s, r) => s + r.quantity * r.unit_price, 0), [rows])
  const addRow = () => setRows((r) => [...r, { item_id: items.data?.data[0]?.id ?? 0, quantity: 0, unit_price: 0 }])
  const setRow = (i: number, patch: Partial<Row>) => setRows((rs) => rs.map((r, j) => j === i ? { ...r, ...patch } : r))
  const removeRow = (i: number) => setRows((rs) => rs.filter((_, j) => j !== i))

  if (!po) return <div>Memuat…</div>

  if (po.status !== 'draft') {
    return (
      <div>
        <PageHeader title={`Edit Item · ${po.po_number}`} />
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-sm">
          <p className="mb-3 flex items-center gap-2 text-[var(--muted)]">
            Item hanya dapat diubah saat status draft. Status saat ini: <StatusBadge status={po.status} />
          </p>
          <Link to={`/purchasing/purchase-orders/${id}`}><Button variant="ghost">Kembali ke PO</Button></Link>
        </div>
      </div>
    )
  }

  const save = async () => {
    if (rows.length === 0) { toast.error('Minimal satu item'); return }
    try {
      await update.mutateAsync(rows)
      toast.success('Item PO disimpan')
      nav(`/purchasing/purchase-orders/${id}`)
    } catch (e) { toast.error(getApiError(e).message) }
  }

  const field = 'rounded-lg border border-[var(--border)] px-3 py-2 text-sm'
  return (
    <div>
      <PageHeader title={`Edit Item · ${po.po_number}`} actions={<Link to={`/purchasing/purchase-orders/${id}`}><Button variant="ghost">Kembali</Button></Link>} />
      <Button variant="ghost" onClick={addRow}>Tambah Item</Button>
      <div className="mt-3 space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-2">
            <select className={field} value={r.item_id} onChange={(e) => setRow(i, { item_id: Number(e.target.value) })}>
              {items.data?.data.map((it) => <option key={it.id} value={it.id}>{it.name}</option>)}
            </select>
            <input aria-label="Qty" type="number" className={field} value={r.quantity || ''} onChange={(e) => setRow(i, { quantity: Number(e.target.value) })} />
            <input aria-label="Harga" type="number" className={field} value={r.unit_price || ''} onChange={(e) => setRow(i, { unit_price: Number(e.target.value) })} />
            <div className="text-right font-mono text-sm">{format.rupiah(r.quantity * r.unit_price)}</div>
            <button type="button" aria-label="Hapus baris" className="text-sm text-red-600" onClick={() => removeRow(i)}>Hapus</button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-end gap-4">
        <span className="text-sm text-[var(--muted)]">Total</span>
        <span className="text-lg font-bold">{format.rupiah(total)}</span>
      </div>
      <div className="mt-4 flex justify-end"><Button onClick={save} disabled={update.isPending}>Simpan Item</Button></div>
    </div>
  )
}
