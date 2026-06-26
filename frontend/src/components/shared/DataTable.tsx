import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { EmptyState } from './EmptyState'

export type { ColumnDef }

export function DataTable<T>({ columns, rows, isLoading, emptyText = 'Tidak ada data' }: {
  columns: ColumnDef<T>[]; rows: T[]; isLoading?: boolean; emptyText?: string
}) {
  const table = useReactTable({ data: rows, columns, getCoreRowModel: getCoreRowModel() })
  if (isLoading) return <div className="py-12 text-center text-sm text-[var(--muted)]">Memuat…</div>
  if (rows.length === 0) return <div className="rounded-xl border border-[var(--border)]"><EmptyState text={emptyText} /></div>
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--bg)] text-left text-xs uppercase tracking-wide text-[var(--muted)]">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>{hg.headers.map((h) => (
              <th key={h.id} className="px-3 py-2 font-semibold">{flexRender(h.column.columnDef.header, h.getContext())}</th>
            ))}</tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((r) => (
            <tr key={r.id} className="border-t border-[var(--border)]">
              {r.getVisibleCells().map((c) => (
                <td key={c.id} className="px-3 py-2">{flexRender(c.column.columnDef.cell ?? c.column.columnDef.header, c.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
