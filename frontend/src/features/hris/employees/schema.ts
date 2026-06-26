import { z } from 'zod'
export const employeeSchema = z.object({
  nama_lengkap: z.string().min(1, 'Nama wajib diisi'),
  nomor_induk_karyawan: z.string().min(1, 'NIK wajib diisi'),
  alamat: z.string().default(''),
  branch_id: z.coerce.number().int().positive('Cabang wajib dipilih'),
  position_id: z.coerce.number().int().positive('Jabatan wajib dipilih'),
  tanggal_gabung: z.string().min(1, 'Tanggal gabung wajib diisi'),
  tanggal_mulai_kontrak: z.string().min(1, 'Tanggal mulai kontrak wajib diisi'),
  tanggal_akhir_kontrak: z.string().nullable().default(null),
})
export type EmployeeInput = z.infer<typeof employeeSchema>
