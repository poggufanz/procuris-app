import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'

export function Topbar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const toggleTheme = useUiStore((s) => s.toggleTheme)
  return (
    <header className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-2.5">
      <input className="w-64 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-sm" placeholder="Cari…" />
      <button title="Notifikasi" disabled className="ml-auto h-7 w-7 rounded-lg border border-[var(--border)] opacity-50" aria-label="Notifikasi (segera)">🔔</button>
      <button onClick={toggleTheme} className="h-7 w-7 rounded-lg border border-[var(--border)]" aria-label="Ganti tema">◐</button>
      <button onClick={() => void logout()} className="text-sm text-[var(--muted)]">{user?.name} · Keluar</button>
    </header>
  )
}
