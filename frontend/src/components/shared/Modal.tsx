import { type ReactNode, useEffect } from 'react'

export function Modal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog" aria-modal="true" aria-labelledby="modal-title"
        className="max-h-[85vh] w-96 max-w-full overflow-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_24px_64px_rgba(0,0,0,.28)] motion-safe:animate-[login-rise_.22s_cubic-bezier(.16,1,.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id="modal-title" className="text-lg font-semibold tracking-tight text-[var(--text)]">{title}</h2>
          <button onClick={onClose} aria-label="Tutup" className="-mr-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--bg)] hover:text-[var(--text)]">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
