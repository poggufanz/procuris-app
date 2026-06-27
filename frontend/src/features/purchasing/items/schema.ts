import { z } from 'zod'
export const itemSchema = z.object({
  code: z.string().min(1, 'Kode wajib diisi'),
  name: z.string().min(1, 'Nama wajib diisi'),
  description: z.string().nullable().default(null),
  category: z.string().min(1, 'Kategori wajib diisi'),
  unit: z.string().min(1, 'Satuan wajib diisi'),
  default_vendor_id: z.coerce.number().int().nullable().default(null),
})
export type ItemInput = z.infer<typeof itemSchema>
export type ItemFormInput = z.input<typeof itemSchema>
