import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import type { Role } from '@/config/roles'

export function RequireRole({ roles }: { roles: Role[] }) {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role)) return <Navigate to="/403" replace />
  return <Outlet />
}
