import { useState } from 'react'
import { useItems, type Item } from './api'
import { ItemForm } from './ItemForm'
import { DataTable, type ColumnDef } from '@/components/shared/DataTable'
import { PageHeader } from '@/components/shared/PageHeader'
import { Pagination } from '@/components/shared/Pagination'
import { Modal } from '@/components/shared/Modal'
import { Button } from '@/components/ui/button'
import { format } from '@/lib/format'

type ActiveFilter = 'all' | 'active' | 'inactive'

export function ItemsPage() {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [active, setActive] = useState<ActiveFilter>('all')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Item | null>(null)
  const isActive = active === 'all' ? undefined : active === 'active'
  const { data, isLoading } = useItems({ page, q: q || undefined, category: category || undefined, is_active: isActive })
  const columns: ColumnDef<Item>[] = [
    { accessorKey: 'code', header: 'Kode' },
    { accessorKey: 'name', header: 'Nama' },
    { accessorKey: 'category', header: 'Kategori' },
    { accessorKey: 'unit', header: 'Satuan' },
    { id: 'last', header: 'Harga terakhir', cell: ({ row }) => row.original.last_price != null ? format.rupiah(row.original.last_price) : '-' },
    { id: 'actions', header: '', cell: ({ row }) => <button type="button" className="text-sm text-[var(--accent)]" onClick={() => setEditing(row.original)}>Edit</button> },
  ]
  const control = 'rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm'
  return (
    <div>
      <PageHeader title="Item" actions={<Button onClick={() => setOpen(true)}>Tambah Item</Button>} />
      <div className="mb-3 flex flex-wrap gap-2">
        <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} placeholder="Cari nama / kode…" className={`${control} w-64`} />
        <input aria-label="Filter kategori" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1) }} placeholder="Kategori…" className={`${control} w-40`} />
        <select aria-label="Filter status" value={active} onChange={(e) => { setActive(e.target.value as ActiveFilter); setPage(1) }} className={control}>
          <option value="all">Semua status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Nonaktif</option>
        </select>
      </div>
      <DataTable columns={columns} rows={data?.data ?? []} isLoading={isLoading} emptyText="Belum ada item" />
      {data && <Pagination page={data.current_page} total={data.total} perPage={data.per_page} onPage={setPage} />}
      <Modal open={open} title="Tambah Item" onClose={() => setOpen(false)}>
        <ItemForm onDone={() => setOpen(false)} />
      </Modal>
      <Modal open={!!editing} title="Edit Item" onClose={() => setEditing(null)}>
        {editing && <ItemForm item={editing} onDone={() => setEditing(null)} />}
      </Modal>
    </div>
  )
}
