import { z } from 'zod'
export const poItemSchema = z.object({
  item_id: z.coerce.number().int().positive('Item wajib dipilih'),
  quantity: z.coerce.number().positive('Qty harus > 0'),
  unit_price: z.coerce.number().nonnegative('Harga tidak valid'),
})
export const poCreateSchema = z.object({
  branch_id: z.coerce.number().int().positive('Cabang wajib dipilih'),
  vendor_id: z.coerce.number().int().positive('Vendor wajib dipilih'),
  tanggal_dibutuhkan: z.string().nullable().default(null),
  catatan: z.string().nullable().default(null),
  items: z.array(poItemSchema).min(1, 'Minimal satu item'),
})
export type POCreateInput = z.infer<typeof poCreateSchema>
