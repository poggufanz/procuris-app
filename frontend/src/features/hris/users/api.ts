import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { qk } from '@/lib/queryKeys'
import type { Role } from '@/config/roles'
import type { UserInput } from './schema'

export interface UserAccount { id: number; name: string; email: string; role: Role; branch_id: number | null; is_active: boolean }
interface Paginated<T> { data: T[]; total: number; per_page: number; current_page: number }

export function useUsers(page: number) {
  return useQuery({ queryKey: qk.users.list(page), queryFn: async () => (await api.get<Paginated<UserAccount>>('/auth/users', { params: { page } })).data })
}
export function useSaveUser(id?: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: UserInput) => id
      ? (await api.put<UserAccount>(`/auth/users/${id}`, input)).data
      : (await api.post<UserAccount>('/auth/users', input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users', 'list'] }),
  })
}
export function useToggleUserActive() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => (await api.patch(`/auth/users/${id}/deactivate`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users', 'list'] }),
  })
}
