import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useVendors, type Vendor } from './api'
import { VendorForm } from './VendorForm'
import { DataTable, type ColumnDef } from '@/components/shared/DataTable'
import { PageHeader } from '@/components/shared/PageHeader'
import { Pagination } from '@/components/shared/Pagination'
import { Modal } from '@/components/shared/Modal'
import { Button } from '@/components/ui/button'

type ActiveFilter = 'all' | 'active' | 'inactive'

export function VendorsPage() {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [active, setActive] = useState<ActiveFilter>('all')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Vendor | null>(null)
  const isActive = active === 'all' ? undefined : active === 'active'
  const { data, isLoading } = useVendors({ page, q: q || undefined, is_active: isActive })
  const columns: ColumnDef<Vendor>[] = [
    { accessorKey: 'code', header: 'Kode', cell: ({ row }) => <Link className="text-[var(--accent)]" to={`/purchasing/vendors/${row.original.id}`}>{row.original.code}</Link> },
    { accessorKey: 'name', header: 'Vendor' },
    { accessorKey: 'contact_person', header: 'PIC' },
    { accessorKey: 'phone', header: 'Telepon' },
    { id: 'active', header: 'Status', cell: ({ row }) => row.original.is_active ? 'Aktif' : 'Nonaktif' },
    { id: 'actions', header: '', cell: ({ row }) => <button type="button" className="text-sm text-[var(--accent)]" onClick={() => setEditing(row.original)}>Edit</button> },
  ]
  const control = 'rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm'
  return (
    <div>
      <PageHeader title="Vendor" actions={<Button onClick={() => setOpen(true)}>Tambah Vendor</Button>} />
      <div className="mb-3 flex flex-wrap gap-2">
        <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} placeholder="Cari nama / kode…" className={`${control} w-64`} />
        <select aria-label="Filter status" value={active} onChange={(e) => { setActive(e.target.value as ActiveFilter); setPage(1) }} className={control}>
          <option value="all">Semua status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Nonaktif</option>
        </select>
      </div>
      <DataTable columns={columns} rows={data?.data ?? []} isLoading={isLoading} emptyText="Belum ada vendor" />
      {data && <Pagination page={data.current_page} total={data.total} perPage={data.per_page} onPage={setPage} />}
      <Modal open={open} title="Tambah Vendor" onClose={() => setOpen(false)}>
        <VendorForm onDone={() => setOpen(false)} />
      </Modal>
      <Modal open={!!editing} title="Edit Vendor" onClose={() => setEditing(null)}>
        {editing && <VendorForm vendor={editing} onDone={() => setEditing(null)} />}
      </Modal>
    </div>
  )
}
