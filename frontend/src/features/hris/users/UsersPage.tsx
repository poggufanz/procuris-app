import { useState } from 'react'
import { useUsers, useToggleUserActive, type UserAccount } from './api'
import { UserForm } from './UserForm'
import { DataTable, type ColumnDef } from '@/components/shared/DataTable'
import { PageHeader } from '@/components/shared/PageHeader'
import { Pagination } from '@/components/shared/Pagination'
import { Modal } from '@/components/shared/Modal'
import { Button } from '@/components/ui/button'

export function UsersPage() {
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const { data, isLoading } = useUsers(page)
  const toggle = useToggleUserActive()
  const columns: ColumnDef<UserAccount>[] = [
    { accessorKey: 'name', header: 'Nama' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Role' },
    { id: 'active', header: 'Aktif', cell: ({ row }) => (
      <Button variant="ghost" onClick={() => toggle.mutate(row.original.id)}>{row.original.is_active ? 'Nonaktifkan' : 'Aktifkan'}</Button>
    ) },
  ]
  return (
    <div>
      <PageHeader title="User & Akses" actions={<Button onClick={() => setOpen(true)}>Tambah User</Button>} />
      <Modal open={open} title="Tambah User" onClose={() => setOpen(false)}>
        <UserForm onDone={() => setOpen(false)} />
      </Modal>
      <DataTable columns={columns} rows={data?.data ?? []} isLoading={isLoading} emptyText="Belum ada user" />
      {data && <Pagination page={data.current_page} total={data.total} perPage={data.per_page} onPage={setPage} />}
    </div>
  )
}
