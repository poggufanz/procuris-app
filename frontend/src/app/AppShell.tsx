import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { Sidebar } from '@/components/shared/Sidebar'
import { Topbar } from '@/components/shared/Topbar'
import { useUiStore } from '@/stores/ui.store'

export function AppShell() {
  const theme = useUiStore((s) => s.theme)
  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark') }, [theme])
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-auto p-4"><Outlet /></main>
      </div>
    </div>
  )
}
