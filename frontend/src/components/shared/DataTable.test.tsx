import { render, screen } from '@testing-library/react'
import { DataTable } from './DataTable'
import type { ColumnDef } from '@tanstack/react-table'

interface Row { id: number; name: string }
const columns: ColumnDef<Row>[] = [{ accessorKey: 'name', header: 'Nama' }]

test('renders rows', () => {
  render(<DataTable columns={columns} rows={[{ id: 1, name: 'Budi' }]} />)
  expect(screen.getByText('Budi')).toBeInTheDocument()
})

test('shows empty text when no rows', () => {
  render(<DataTable columns={columns} rows={[]} emptyText="Tidak ada data" />)
  expect(screen.getByText('Tidak ada data')).toBeInTheDocument()
})
