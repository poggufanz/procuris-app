import { z } from 'zod'
import { ROLES } from '@/config/roles'
export const userSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  email: z.string().email('Email tidak valid'),
  role: z.enum(ROLES),
  branch_id: z.coerce.number().int().nullable().default(null),
  password: z.string().min(6, 'Minimal 6 karakter').optional(),
})
export type UserFormInput = z.input<typeof userSchema>
export type UserInput = z.infer<typeof userSchema>
