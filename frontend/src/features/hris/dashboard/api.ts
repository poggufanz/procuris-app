import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { qk } from '@/lib/queryKeys'

export interface HrisDashboard {
  totalActive: number; totalBranches: number
  perDivision: { division: string; count: number }[]
  expiringContracts: { id: number; nama_lengkap: string; tanggal_akhir_kontrak: string }[]
}
export function useHrisDashboard() {
  return useQuery({ queryKey: qk.hrisDashboard(), queryFn: async () => (await api.get<HrisDashboard>('/hris/dashboard')).data })
}
