import { type ReactNode } from 'react'
export function Modal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="max-h-[85vh] w-96 overflow-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-3 font-bold">{title}</h2>
        {children}
      </div>
    </div>
  )
}
