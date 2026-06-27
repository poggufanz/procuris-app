import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useEmployees, useBranchOptions, type Employee } from './api'
import { EmployeeForm } from './EmployeeForm'
import { DataTable, type ColumnDef } from '@/components/shared/DataTable'
import { PageHeader } from '@/components/shared/PageHeader'
import { Pagination } from '@/components/shared/Pagination'
import { Modal } from '@/components/shared/Modal'
import { Button } from '@/components/ui/button'

const LEVELS: Record<number, string> = { 1: 'Staff', 2: 'Supervisor', 3: 'Manager', 4: 'Direktur' }

export function EmployeesPage() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [branchId, setBranchId] = useState('')
  const [division, setDivision] = useState('')
  const [level, setLevel] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Employee | null>(null)
  const branches = useBranchOptions()
  const { data, isLoading } = useEmployees({
    page,
    status: status || undefined,
    branch_id: branchId ? Number(branchId) : undefined,
    division: division || undefined,
    level: level ? Number(level) : undefined,
  })

  const columns: ColumnDef<Employee>[] = [
    { accessorKey: 'nomor_induk_karyawan', header: 'NIK', cell: ({ row }) => <Link className="text-[var(--accent)]" to={`/hris/employees/${row.original.id}`}>{row.original.nomor_induk_karyawan}</Link> },
    { accessorKey: 'nama_lengkap', header: 'Nama' },
    { accessorKey: 'branch_name', header: 'Cabang' },
    { accessorKey: 'position_name', header: 'Jabatan' },
    { accessorKey: 'status', header: 'Status' },
    { id: 'aksi', header: '', cell: ({ row }) => <Button variant="ghost" onClick={() => setEditing(row.original)}>Edit</Button> },
  ]

  const resetPage = () => setPage(1)
  const control = 'rounded-lg border border-[var(--border)] px-2 py-1.5 text-sm'
  return (
    <div>
      <PageHeader title="Karyawan" actions={<Button onClick={() => setOpen(true)}>Tambah Karyawan</Button>} />
      <Modal open={open} title="Tambah Karyawan" onClose={() => setOpen(false)}>
        <EmployeeForm onDone={() => setOpen(false)} />
      </Modal>
      <Modal open={!!editing} title="Edit Karyawan" onClose={() => setEditing(null)}>
        {editing && <EmployeeForm employee={editing} onDone={() => setEditing(null)} />}
      </Modal>
      <div className="mb-3 flex flex-wrap gap-2">
        <select value={status} onChange={(e) => { setStatus(e.target.value); resetPage() }} className={control}>
          <option value="">Semua status</option>
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
          <option value="kontrak_berakhir">Kontrak berakhir</option>
        </select>
        <select value={branchId} onChange={(e) => { setBranchId(e.target.value); resetPage() }} className={control}>
          <option value="">Semua cabang</option>
          {branches.data?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select value={level} onChange={(e) => { setLevel(e.target.value); resetPage() }} className={control}>
          <option value="">Semua level</option>
          {Object.entries(LEVELS).map(([v, label]) => <option key={v} value={v}>{label}</option>)}
        </select>
        <input value={division} onChange={(e) => { setDivision(e.target.value); resetPage() }} placeholder="Divisi…" className={control} />
      </div>
      <DataTable columns={columns} rows={data?.data ?? []} isLoading={isLoading} emptyText="Belum ada karyawan" />
      {data && <Pagination page={data.current_page} total={data.total} perPage={data.per_page} onPage={setPage} />}
    </div>
  )
}
