import { z } from 'zod'
export const employeeSchema = z.object({
  user_id: z.coerce.number().int().positive('User wajib diisi'),
  nama_lengkap: z.string().min(1, 'Nama wajib diisi'),
  nomor_induk_karyawan: z
    .string()
    .regex(/^\d{4}\.\d{2}\.\d+$/, 'Format NIK: YYYY.MM.XXXXX (contoh 2026.01.123)'),
  alamat: z.string().min(1, 'Alamat wajib diisi'),
  branch_id: z.coerce.number().int().positive('Cabang wajib dipilih'),
  position_id: z.coerce.number().int().positive('Jabatan wajib dipilih'),
  tanggal_gabung: z.string().min(1, 'Tanggal gabung wajib diisi'),
  tanggal_mulai_kontrak: z.string().min(1, 'Tanggal mulai kontrak wajib diisi'),
  tanggal_akhir_kontrak: z.string().nullable().default(null),
  status: z.enum(['aktif', 'nonaktif', 'kontrak_berakhir']).default('aktif'),
})
export type EmployeeFormInput = z.input<typeof employeeSchema>
export type EmployeeInput = z.infer<typeof employeeSchema>
