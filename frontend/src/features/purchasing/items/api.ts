import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { qk } from '@/lib/queryKeys'
import type { ItemInput } from './schema'

export interface Item { id: number; code: string; name: string; description: string | null; category: string; unit: string; default_vendor_id: number | null; last_price: number | null; is_active: boolean }
interface Paginated<T> { data: T[]; total: number; per_page: number; current_page: number }
export interface ItemFilters { q?: string; category?: string; is_active?: boolean; page?: number }

export function useItems(filters: ItemFilters) {
  return useQuery({ queryKey: qk.items.list(filters), queryFn: async () => (await api.get<Paginated<Item>>('/items', { params: filters })).data })
}
export function useSaveItem(id?: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: ItemInput) => id ? (await api.put<Item>(`/items/${id}`, input)).data : (await api.post<Item>('/items', input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['items', 'list'] }),
  })
}
export function useDeactivateItem() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: async (id: number) => (await api.patch(`/items/${id}/deactivate`)).data, onSuccess: () => qc.invalidateQueries({ queryKey: ['items', 'list'] }) })
}
