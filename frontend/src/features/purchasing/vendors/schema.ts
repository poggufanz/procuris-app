import { z } from 'zod'
export const vendorSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  code: z.string().min(1, 'Kode wajib diisi'),
  contact_person: z.string().min(1, 'PIC wajib diisi'),
  phone: z.string().min(1, 'Telepon wajib diisi'),
  email: z.string().email('Email tidak valid').nullable().or(z.literal('')).default(null),
  address: z.string().min(1, 'Alamat wajib diisi'),
  npwp: z.string().nullable().default(null),
  payment_term_days: z.coerce.number().int().min(0).default(30),
})
export type VendorInput = z.infer<typeof vendorSchema>
export type VendorFormInput = z.input<typeof vendorSchema>
