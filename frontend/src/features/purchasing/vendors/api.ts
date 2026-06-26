import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { qk } from '@/lib/queryKeys'
import type { VendorInput } from './schema'

export interface Vendor { id: number; name: string; code: string; contact_person: string; phone: string; email: string | null; address: string; npwp: string | null; payment_term_days: number; is_active: boolean }
interface Paginated<T> { data: T[]; total: number; per_page: number; current_page: number }
export interface VendorFilters { q?: string; is_active?: boolean; page?: number }

export function useVendors(filters: VendorFilters) {
  return useQuery({ queryKey: qk.vendors.list(filters), queryFn: async () => (await api.get<Paginated<Vendor>>('/vendors', { params: filters })).data })
}
export function useSaveVendor(id?: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: VendorInput) => id ? (await api.put<Vendor>(`/vendors/${id}`, input)).data : (await api.post<Vendor>('/vendors', input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vendors', 'list'] }),
  })
}
export function useDeactivateVendor() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: async (id: number) => (await api.patch(`/vendors/${id}/deactivate`)).data, onSuccess: () => qc.invalidateQueries({ queryKey: ['vendors', 'list'] }) })
}
