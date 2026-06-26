export const branches = [
  { id: 1, name: 'Bandung', code: 'BDG', parent_id: null, address: null, is_active: true },
  { id: 2, name: 'Garut', code: 'GRT', parent_id: 1, address: null, is_active: true },
]
export const positions = [
  { id: 1, name: 'Manager IT', level: 3, division: 'IT', parent_position_id: null, branch_id: null },
  { id: 2, name: 'Staff IT', level: 1, division: 'IT', parent_position_id: 1, branch_id: 1 },
]
export const employees = [
  { id: 1, user_id: 5, nama_lengkap: 'Budi Santoso', nomor_induk_karyawan: '2026.01.00001', alamat: 'Bandung', branch_id: 1, position_id: 2, branch_name: 'Bandung', position_name: 'Staff IT', tanggal_gabung: '2026-01-10', tanggal_mulai_kontrak: '2026-01-10', tanggal_akhir_kontrak: '2026-07-10', status: 'aktif' as const },
]
export const users = [
  { id: 1, name: 'Super Admin', email: 'admin@procuris.test', role: 'superadmin' as const, branch_id: null, is_active: true },
]
