import { useState } from 'react'
import { useItems, type Item } from './api'
import { ItemForm } from './ItemForm'
import { DataTable, type ColumnDef } from '@/components/shared/DataTable'
import { PageHeader } from '@/components/shared/PageHeader'
import { Pagination } from '@/components/shared/Pagination'
import { Modal } from '@/components/shared/Modal'
import { Button } from '@/components/ui/button'
import { format } from '@/lib/format'

export function ItemsPage() {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const { data, isLoading } = useItems({ page, q: q || undefined })
  const columns: ColumnDef<Item>[] = [
    { accessorKey: 'code', header: 'Kode' },
    { accessorKey: 'name', header: 'Nama' },
    { accessorKey: 'category', header: 'Kategori' },
    { accessorKey: 'unit', header: 'Satuan' },
    { id: 'last', header: 'Harga terakhir', cell: ({ row }) => row.original.last_price != null ? format.rupiah(row.original.last_price) : '-' },
  ]
  return (
    <div>
      <PageHeader title="Item" actions={<Button onClick={() => setOpen(true)}>Tambah Item</Button>} />
      <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} placeholder="Cari nama / kode…"
        className="mb-3 w-64 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm" />
      <DataTable columns={columns} rows={data?.data ?? []} isLoading={isLoading} emptyText="Belum ada item" />
      {data && <Pagination page={data.current_page} total={data.total} perPage={data.per_page} onPage={setPage} />}
      <Modal open={open} title="Tambah Item" onClose={() => setOpen(false)}>
        <ItemForm onDone={() => setOpen(false)} />
      </Modal>
    </div>
  )
}
