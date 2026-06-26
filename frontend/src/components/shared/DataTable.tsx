import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { EmptyState } from './EmptyState'
import { Skeleton } from './Skeleton'

export type { ColumnDef }

const cardClass = 'overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]'

export function DataTable<T>({ columns, rows, isLoading, emptyText = 'Tidak ada data' }: {
  columns: ColumnDef<T>[]; rows: T[]; isLoading?: boolean; emptyText?: string
}) {
  const table = useReactTable({ data: rows, columns, getCoreRowModel: getCoreRowModel() })

  if (isLoading) {
    return (
      <div className={cardClass} role="status" aria-busy="true" aria-label="Memuat data">
        <div className="space-y-3.5 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              {columns.map((_, j) => <Skeleton key={j} className="h-4 flex-1" />)}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (rows.length === 0) return <div className={cardClass}><EmptyState text={emptyText} /></div>

  return (
    <div className={`${cardClass} motion-safe:animate-[login-rise_.4s_cubic-bezier(.16,1,.3,1)]`}>
      <table className="w-full text-sm">
        <thead className="border-b border-[var(--border)] bg-[var(--bg)] text-left text-[11px] uppercase tracking-wider text-[var(--muted)]">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>{hg.headers.map((h) => (
              <th key={h.id} className="px-4 py-2.5 font-semibold">{flexRender(h.column.columnDef.header, h.getContext())}</th>
            ))}</tr>
          ))}
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {table.getRowModel().rows.map((r) => (
            <tr key={r.id} className="transition-colors hover:bg-[var(--bg)]">
              {r.getVisibleCells().map((c) => (
                <td key={c.id} className="px-4 py-2.5 text-[var(--text)]">{flexRender(c.column.columnDef.cell, c.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
