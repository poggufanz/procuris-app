import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePOList, type PurchaseOrder } from './api'
import { useBranchScope } from '../useBranchScope'
import { DataTable, type ColumnDef } from '@/components/shared/DataTable'
import { PageHeader } from '@/components/shared/PageHeader'
import { Pagination } from '@/components/shared/Pagination'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { format } from '@/lib/format'

export function POListPage() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const { scoped, branchId } = useBranchScope()
  const { data, isLoading } = usePOList({ page, status: status || undefined, branch_id: scoped ? branchId ?? undefined : undefined })
  const columns: ColumnDef<PurchaseOrder>[] = [
    { accessorKey: 'po_number', header: 'No. PO', cell: ({ row }) => <Link className="font-mono text-[var(--accent)]" to={`/purchasing/purchase-orders/${row.original.id}`}>{row.original.po_number}</Link> },
    { accessorKey: 'branch_name', header: 'Cabang' },
    { id: 'total', header: 'Total', cell: ({ row }) => format.rupiah(row.original.total_amount) },
    { id: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ]
  return (
    <div>
      <PageHeader title="Purchase Order" actions={<Link to="/purchasing/purchase-orders/new"><Button>Buat PO</Button></Link>} />
      <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className="mb-3 rounded-lg border border-[var(--border)] px-2 py-1.5 text-sm">
        <option value="">Semua status</option>
        {['draft','submitted','approved','rejected','received','cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <DataTable columns={columns} rows={data?.data ?? []} isLoading={isLoading} emptyText="Belum ada PO" />
      {data && <Pagination page={data.current_page} total={data.total} perPage={data.per_page} onPage={setPage} />}
    </div>
  )
}
