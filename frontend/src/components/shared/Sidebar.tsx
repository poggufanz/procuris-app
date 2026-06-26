import { NavLink } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'
import { navForRole } from '@/config/nav'

export function Sidebar() {
  const user = useAuthStore((s) => s.user)
  const activeSystem = useUiStore((s) => s.activeSystem)
  const setActiveSystem = useUiStore((s) => s.setActiveSystem)
  if (!user) return null
  const items = navForRole(user.role, activeSystem)
  return (
    <aside className="flex w-52 flex-col border-r border-[var(--border)] bg-[var(--surface)]">
      <div className="flex items-center gap-2.5 px-4 py-4">
        <span aria-hidden className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--accent)] text-white">
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.1">
            <path d="M5 20V5.5A1.5 1.5 0 0 1 6.5 4H13a5 5 0 0 1 0 10H7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="font-semibold tracking-tight text-[var(--text)]">Procuris</span>
      </div>

      <div className="mx-3 mb-3 flex gap-1 rounded-lg bg-[var(--bg)] p-1">
        {(['hris', 'purchasing'] as const).map((sys) => (
          <button key={sys} onClick={() => setActiveSystem(sys)} aria-pressed={activeSystem === sys}
            className={`flex-1 rounded-md px-2 py-1.5 text-xs font-semibold transition ${activeSystem === sys ? 'bg-[var(--surface)] text-[var(--accent)] shadow-[var(--shadow)]' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}>
            {sys === 'hris' ? 'HRIS' : 'Purchasing'}
          </button>
        ))}
      </div>

      <nav aria-label="Navigasi utama" className="flex flex-col gap-0.5 px-3">
        {items.map((i) => (
          <NavLink key={i.path} to={i.path}
            className={({ isActive }) => `relative rounded-lg px-3 py-2 text-sm transition ${isActive ? 'bg-[var(--accent-weak)] font-semibold text-[var(--accent)]' : 'text-[var(--text)] hover:bg-[var(--bg)]'}`}>
            {({ isActive }) => (
              <>
                {isActive && <span aria-hidden className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-[var(--accent)]" />}
                {i.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
