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
    <aside className="flex w-44 flex-col border-r border-[var(--border)] bg-[var(--surface)]">
      <div className="px-3 py-3 font-bold">Procuris</div>
      <div className="mx-3 mb-2 flex gap-1 rounded-lg bg-[var(--bg)] p-0.5">
        {(['hris','purchasing'] as const).map((sys) => (
          <button key={sys} onClick={() => setActiveSystem(sys)}
            className={`flex-1 rounded-md px-2 py-1 text-xs font-semibold ${activeSystem === sys ? 'bg-[var(--surface)] text-[var(--accent)] shadow' : 'text-[var(--muted)]'}`}>
            {sys === 'hris' ? 'HRIS' : 'Purchasing'}
          </button>
        ))}
      </div>
      <nav className="flex flex-col gap-0.5 px-2">
        {items.map((i) => (
          <NavLink key={i.path} to={i.path}
            className={({ isActive }) => `rounded-lg px-2 py-1.5 text-sm ${isActive ? 'bg-[var(--accent-weak)] font-semibold text-[var(--accent)]' : 'text-[var(--text)]'}`}>
            {i.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
