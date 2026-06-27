import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { userSchema, type UserFormInput, type UserInput } from './schema'
import { useSaveUser, type UserAccount } from './api'
import { useBranches } from '@/features/hris/organization/branchApi'
import { ROLES } from '@/config/roles'
import { Button } from '@/components/ui/button'
import { getApiError } from '@/lib/apiError'

export function UserForm({ user, onDone }: { user?: UserAccount; onDone: () => void }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UserFormInput, unknown, UserInput>({
    resolver: zodResolver(userSchema),
    defaultValues: user ?? { branch_id: null },
  })
  const branches = useBranches()
  const save = useSaveUser(user?.id)
  // re-apply default once cabang <option>s exist, else the branch select shows blank on edit
  useEffect(() => {
    if (user && branches.data) reset(user)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branches.data])

  const onSubmit = async (data: UserInput) => {
    try {
      await save.mutateAsync(data)
      toast.success('User disimpan')
      onDone()
    } catch (e) { toast.error(getApiError(e).message) }
  }

  const field = 'mb-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm'
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <label htmlFor="uname">Nama</label>
      <input id="uname" {...register('name')} className={field} />
      {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
      <label htmlFor="uemail">Email</label>
      <input id="uemail" type="email" {...register('email')} className={field} />
      {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
      <label htmlFor="urole">Role</label>
      <select id="urole" {...register('role')} className={field}>
        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
      <label htmlFor="ubranch">Cabang</label>
      <select id="ubranch" {...register('branch_id')} className={field}>
        <option value="">Tanpa cabang</option>
        {branches.data?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
      </select>
      {!user && <>
        <label htmlFor="upass">Password</label>
        <input id="upass" type="password" {...register('password')} className={field} />
        {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
      </>}
      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">Simpan</Button>
    </form>
  )
}
