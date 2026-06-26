import { Button } from '@/components/ui/button'
export function ConfirmDialog({ open, title, message, onConfirm, onCancel }: {
  open: boolean; title: string; message?: string; onConfirm: () => void; onCancel: () => void
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" onClick={onCancel}>
      <div className="w-80 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-2 font-bold">{title}</h2>
        {message && <p className="mb-4 text-sm text-[var(--muted)]">{message}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>Batal</Button>
          <Button variant="danger" onClick={onConfirm}>Ya</Button>
        </div>
      </div>
    </div>
  )
}
