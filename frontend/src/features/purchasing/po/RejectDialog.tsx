import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function RejectDialog({ open, onConfirm, onCancel }: { open: boolean; onConfirm: (reason: string) => void; onCancel: () => void }) {
  const [reason, setReason] = useState('')
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" onClick={onCancel}>
      <div className="w-96 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-2 font-bold">Tolak PO</h2>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Alasan penolakan (wajib)"
          className="mb-3 h-24 w-full rounded-lg border border-[var(--border)] p-2 text-sm" />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>Batal</Button>
          <Button variant="danger" disabled={!reason.trim()} onClick={() => onConfirm(reason.trim())}>Tolak</Button>
        </div>
      </div>
    </div>
  )
}
