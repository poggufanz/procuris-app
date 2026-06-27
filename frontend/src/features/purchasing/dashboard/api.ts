import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { qk } from '@/lib/queryKeys'
import type { PurchaseOrder } from '../po/api'

export interface PurchasingDashboard {
  poThisMonth: number; pendingApproval: number; totalValue: number
  byStatus: { status: string; count: number }[]; recent: PurchaseOrder[]
}
export function usePurchasingDashboard() {
  return useQuery({ queryKey: qk.purchasingDashboard(), queryFn: async () => (await api.get<PurchasingDashboard>('/purchasing/dashboard')).data })
}
