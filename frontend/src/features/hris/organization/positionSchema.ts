import { z } from 'zod'
export const positionSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  level: z.coerce.number().int().min(1).max(4),
  division: z.string().min(1, 'Divisi wajib diisi'),
  parent_position_id: z.coerce.number().int().nullable().default(null),
  branch_id: z.coerce.number().int().nullable().default(null),
})
export type PositionFormInput = z.input<typeof positionSchema>
export type PositionInput = z.infer<typeof positionSchema>
