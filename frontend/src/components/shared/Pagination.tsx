import { Button } from '@/components/ui/button'

export function Pagination({ page, total, perPage, onPage }: { page: number; total: number; perPage: number; onPage: (p: number) => void }) {
  const last = Math.max(1, Math.ceil(total / perPage))
  return (
    <nav aria-label="Paginasi" className="flex items-center justify-end gap-3 py-3 text-sm">
      <span className="text-[var(--muted)] tabular-nums">Hal {page} / {last}</span>
      <div className="flex gap-2">
        <Button variant="ghost" disabled={page <= 1} onClick={() => onPage(page - 1)}>Sebelumnya</Button>
        <Button variant="ghost" disabled={page >= last} onClick={() => onPage(page + 1)}>Berikutnya</Button>
      </div>
    </nav>
  )
}
