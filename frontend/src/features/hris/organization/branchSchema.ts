import { z } from 'zod'
export const branchSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  code: z.string().min(1, 'Kode wajib diisi'),
  parent_id: z.coerce.number().int().nullable().default(null),
  address: z.string().nullable().default(null),
  is_active: z.boolean().default(true),
})
export type BranchInput = z.infer<typeof branchSchema>
