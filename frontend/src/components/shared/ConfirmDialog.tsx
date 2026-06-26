import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export function ConfirmDialog({ open, title, message, onConfirm, onCancel }: {
  open: boolean; title: string; message?: string; onConfirm: () => void; onCancel: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm" onClick={onCancel}>
      <div
        role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby={message ? 'confirm-msg' : undefined}
        className="w-80 max-w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_24px_64px_rgba(0,0,0,.28)] motion-safe:animate-[login-rise_.22s_cubic-bezier(.16,1,.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start gap-3">
          <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
              <path d="M12 8.5v4.5M12 16.5v.01M10.3 3.8 2.4 18a1.8 1.8 0 0 0 1.6 2.7h16a1.8 1.8 0 0 0 1.6-2.7L13.7 3.8a1.8 1.8 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h2 id="confirm-title" className="pt-1 text-base font-semibold tracking-tight text-[var(--text)]">{title}</h2>
        </div>
        {message && <p id="confirm-msg" className="mb-5 text-sm leading-relaxed text-[var(--muted)]">{message}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>Batal</Button>
          <Button variant="danger" onClick={onConfirm}>Ya</Button>
        </div>
      </div>
    </div>
  )
}
