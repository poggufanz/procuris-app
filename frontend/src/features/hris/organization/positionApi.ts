import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { qk } from '@/lib/queryKeys'
import type { PositionInput } from './positionSchema'

export interface Position { id: number; name: string; level: 1|2|3|4; division: string; parent_position_id: number | null; branch_id: number | null }

export function usePositions() {
  return useQuery({ queryKey: qk.positions.list(), queryFn: async () => (await api.get<{ data: Position[] }>('/positions')).data.data })
}
export function useSavePosition(id?: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: PositionInput) => id
      ? (await api.put<Position>(`/positions/${id}`, input)).data
      : (await api.post<Position>('/positions', input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.positions.list() }),
  })
}
