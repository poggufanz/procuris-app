import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'

const focusRing = 'focus-visible:outline-none focus-visible:border-[var(--accent)] focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_35%,transparent)]'
const iconBtn = `grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] text-[var(--muted)] transition hover:text-[var(--text)] ${focusRing}`

export function Topbar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const theme = useUiStore((s) => s.theme)
  const toggleTheme = useUiStore((s) => s.toggleTheme)
  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() ?? '?'

  return (
    <header className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-2.5">
      <div className="relative">
        <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" strokeLinecap="round" />
        </svg>
        <input
          aria-label="Cari"
          className="w-72 rounded-lg border border-[var(--border)] bg-[var(--bg)] py-2 pl-9 pr-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_35%,transparent)]"
          placeholder="Cari…"
        />
      </div>

      <button title="Notifikasi (segera)" disabled className={`ml-auto ${iconBtn} opacity-50`} aria-label="Notifikasi (segera)">
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10.5 19a1.5 1.5 0 0 0 3 0" strokeLinecap="round" />
        </svg>
      </button>

      <button onClick={toggleTheme} className={iconBtn} aria-label="Ganti tema">
        {theme === 'dark' ? (
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M20 13.5A8 8 0 0 1 10.5 4 7 7 0 1 0 20 13.5Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
          </svg>
        )}
      </button>

      <button onClick={() => void logout()} className={`flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 text-sm text-[var(--text)] transition hover:bg-[var(--bg)] ${focusRing}`} aria-label={user?.name ? `Keluar sebagai ${user.name}` : 'Keluar'}>
        <span aria-hidden className="grid h-7 w-7 place-items-center rounded-full bg-[var(--accent-weak)] text-xs font-semibold text-[var(--accent)]">{initial}</span>
        <span className="max-w-[10rem] truncate text-[var(--muted)]">{user?.name}</span>
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-[var(--muted)]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M15 17l5-5-5-5M20 12H9M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </header>
  )
}
