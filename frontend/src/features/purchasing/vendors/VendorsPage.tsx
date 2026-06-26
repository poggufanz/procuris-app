import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useVendors, type Vendor } from './api'
import { VendorForm } from './VendorForm'
import { DataTable, type ColumnDef } from '@/components/shared/DataTable'
import { PageHeader } from '@/components/shared/PageHeader'
import { Pagination } from '@/components/shared/Pagination'
import { Modal } from '@/components/shared/Modal'
import { Button } from '@/components/ui/button'

export function VendorsPage() {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const { data, isLoading } = useVendors({ page, q: q || undefined })
  const columns: ColumnDef<Vendor>[] = [
    { accessorKey: 'code', header: 'Kode', cell: ({ row }) => <Link className="text-[var(--accent)]" to={`/purchasing/vendors/${row.original.id}`}>{row.original.code}</Link> },
    { accessorKey: 'name', header: 'Vendor' },
    { accessorKey: 'contact_person', header: 'PIC' },
    { accessorKey: 'phone', header: 'Telepon' },
    { id: 'active', header: 'Status', cell: ({ row }) => row.original.is_active ? 'Aktif' : 'Nonaktif' },
  ]
  return (
    <div>
      <PageHeader title="Vendor" actions={<Button onClick={() => setOpen(true)}>Tambah Vendor</Button>} />
      <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} placeholder="Cari nama / kode…"
        className="mb-3 w-64 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm" />
      <DataTable columns={columns} rows={data?.data ?? []} isLoading={isLoading} emptyText="Belum ada vendor" />
      {data && <Pagination page={data.current_page} total={data.total} perPage={data.per_page} onPage={setPage} />}
      <Modal open={open} title="Tambah Vendor" onClose={() => setOpen(false)}>
        <VendorForm onDone={() => setOpen(false)} />
      </Modal>
    </div>
  )
}
