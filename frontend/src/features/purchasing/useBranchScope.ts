import { useAuthStore } from '@/stores/auth.store'
import { isBranchScoped } from '@/config/roles'

export function useBranchScope(): { scoped: boolean; branchId: number | null } {
  const user = useAuthStore((s) => s.user)
  if (!user) return { scoped: true, branchId: null }
  return { scoped: isBranchScoped(user.role), branchId: user.branch_id }
}
