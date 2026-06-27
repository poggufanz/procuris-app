import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { qk } from '@/lib/queryKeys'
import type { BranchInput } from './branchSchema'

export interface Branch { id: number; name: string; code: string; parent_id: number | null; address: string | null; is_active: boolean }

export function useBranches() {
  return useQuery({ queryKey: qk.branches.list(), queryFn: async () => (await api.get<{ data: Branch[] }>('/branches')).data.data })
}
export function useSaveBranch(id?: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: BranchInput) => id
      ? (await api.put<Branch>(`/branches/${id}`, input)).data
      : (await api.post<Branch>('/branches', input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.branches.list() }),
  })
}
export function useDeactivateBranch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => (await api.patch(`/branches/${id}/deactivate`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.branches.list() }),
  })
}
