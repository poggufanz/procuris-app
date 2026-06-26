import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { qk } from '@/lib/queryKeys'
import type { EmployeeInput } from './schema'
import type { TreeNode } from '@/components/shared/TreeView'

export interface Employee {
  id: number; user_id: number; nama_lengkap: string; nomor_induk_karyawan: string; alamat: string
  branch_id: number; position_id: number; branch_name?: string; position_name?: string
  tanggal_gabung: string; tanggal_mulai_kontrak: string; tanggal_akhir_kontrak: string | null
  status: 'aktif' | 'nonaktif' | 'kontrak_berakhir'
}
export interface Paginated<T> { data: T[]; total: number; per_page: number; current_page: number }
export interface EmployeeFilters { status?: string; branch_id?: number; division?: string; level?: number; page?: number }

export function useEmployees(filters: EmployeeFilters) {
  return useQuery({
    queryKey: qk.employees.list(filters as Record<string, unknown>),
    queryFn: async () => (await api.get<Paginated<Employee>>('/employees', { params: filters })).data,
  })
}

export function useCreateEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: EmployeeInput) => (await api.post<Employee>('/employees', input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employees', 'list'] }),
  })
}
export function useUpdateEmployee(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: EmployeeInput) => (await api.put<Employee>(`/employees/${id}`, input)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['employees', 'list'] }); qc.invalidateQueries({ queryKey: qk.employees.detail(id) }) },
  })
}
export function useDeactivateEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => (await api.patch(`/employees/${id}/deactivate`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employees', 'list'] }),
  })
}
export function useBranchOptions() {
  return useQuery({ queryKey: qk.branches.list(), queryFn: async () => (await api.get<Paginated<{ id: number; name: string }>>('/branches')).data.data })
}
export function usePositionOptions() {
  return useQuery({ queryKey: qk.positions.list(), queryFn: async () => (await api.get<Paginated<{ id: number; name: string }>>('/positions')).data.data })
}
export function useEmployee(id: number) {
  return useQuery({ queryKey: qk.employees.detail(id), queryFn: async () => (await api.get<Employee>(`/employees/${id}`)).data })
}
export function useOrgTree(id: number) {
  return useQuery({ queryKey: qk.employees.orgTree(id), queryFn: async () => (await api.get<TreeNode>(`/employees/${id}/org-tree`)).data })
}
