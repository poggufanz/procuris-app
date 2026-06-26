import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { qk } from '@/lib/queryKeys'

export interface Employee {
  id: number; user_id: number; nama_lengkap: string; nomor_induk_karyawan: string; alamat: string
  branch_id: number; position_id: number; branch_name?: string; position_name?: string
  tanggal_gabung: string; tanggal_mulai_kontrak: string; tanggal_akhir_kontrak: string | null
  status: 'aktif' | 'nonaktif' | 'kontrak_berakhir'
}
export interface Paginated<T> { data: T[]; total: number; per_page: number; current_page: number }
export interface EmployeeFilters { status?: string; branch_id?: number; division?: string; page?: number }

export function useEmployees(filters: EmployeeFilters) {
  return useQuery({
    queryKey: qk.employees.list(filters),
    queryFn: async () => (await api.get<Paginated<Employee>>('/employees', { params: filters })).data,
  })
}
