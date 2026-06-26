import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { qk } from '@/lib/queryKeys'
import type { POStatus } from '@/components/shared/StatusBadge'
import type { POCreateInput } from './schema'

export interface POItem { id?: number; item_id: number; item_name: string; quantity: number; unit: string; unit_price: number; subtotal: number; notes?: string | null }
export interface PurchaseOrder {
  id: number; po_number: string; branch_id: number; branch_name: string; branch_code: string
  vendor_id: number; requested_by: number; status: POStatus; tanggal_po: string; tanggal_dibutuhkan: string | null
  total_amount: number; catatan: string | null; rejection_reason: string | null; items: POItem[]
}
interface Paginated<T> { data: T[]; total: number; per_page: number; current_page: number }
export interface POFilters { status?: string; vendor_id?: number; branch_id?: number; date_from?: string; date_to?: string; page?: number }

export function usePOList(filters: POFilters) {
  return useQuery({ queryKey: qk.po.list(filters), queryFn: async () => (await api.get<Paginated<PurchaseOrder>>('/purchase-orders', { params: filters })).data })
}

export function useCreatePO() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: POCreateInput) => (await api.post<PurchaseOrder>('/purchase-orders', input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['po', 'list'] }),
  })
}
