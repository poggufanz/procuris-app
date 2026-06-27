import type { Role } from '@/config/roles'
import type { POStatus } from '@/components/shared/StatusBadge'

export type POAction = 'edit' | 'submit' | 'cancel' | 'approve' | 'reject' | 'receive'

interface POish { status: POStatus; branch_id: number; requested_by: number }
interface Userish { id: number; role: Role; branch_id: number | null }

const isSuper = (u: Userish) => u.role === 'superadmin'
const isApprover = (u: Userish) => u.role === 'admin_purchasing' || isSuper(u)
const ofBranch = (u: Userish, branchId: number) => isSuper(u) || u.branch_id === branchId
const isRequester = (u: Userish, po: POish) => u.id === po.requested_by

export function poActions(po: POish, user: Userish): POAction[] {
  const out: POAction[] = []
  switch (po.status) {
    case 'draft':
      if (isRequester(user, po) || ofBranch(user, po.branch_id)) out.push('edit', 'submit', 'cancel')
      break
    case 'submitted':
      if (isApprover(user)) out.push('approve', 'reject')
      if (isRequester(user, po)) out.push('cancel')
      break
    case 'approved':
      if ((user.role === 'admin_cabang' || user.role === 'staff_purchasing') && ofBranch(user, po.branch_id)) out.push('receive')
      else if (isSuper(user)) out.push('receive')
      break
    default:
      break // rejected / received / cancelled → terminal
  }
  return out
}
