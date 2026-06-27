import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { branchSchema, type BranchFormInput, type BranchInput } from './branchSchema'
import { useSaveBranch, useBranches, type Branch } from './branchApi'
import { Button } from '@/components/ui/button'
import { getApiError } from '@/lib/apiError'

const nullableNumber = (v: unknown) => v === '' || v == null ? null : Number(v)

export function BranchForm({ branch, onDone }: { branch?: Branch; onDone: () => void }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BranchFormInput, unknown, BranchInput>({
    resolver: zodResolver(branchSchema),
    defaultValues: branch ?? { parent_id: null, address: null, is_active: true },
  })
  const branches = useBranches()
  const save = useSaveBranch(branch?.id)
  // re-apply default once parent <option>s exist, else the parent select shows blank on edit
  useEffect(() => {
    if (branch && branches.data) reset(branch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branches.data])

  const onSubmit = async (data: BranchInput) => {
    try {
      await save.mutateAsync(data)
      toast.success('Cabang disimpan')
      onDone()
    } catch (e) { toast.error(getApiError(e).message) }
  }

  const field = 'mb-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm'
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <label htmlFor="b-name">Nama</label>
      <input id="b-name" {...register('name')} className={field} />
      {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
      <label htmlFor="b-code">Kode</label>
      <input id="b-code" {...register('code')} className={field} />
      {errors.code && <p className="text-xs text-red-600">{errors.code.message}</p>}
      <label htmlFor="b-parent">Induk cabang</label>
      <select id="b-parent" {...register('parent_id', { setValueAs: nullableNumber })} className={field}>
        <option value="">Tanpa induk</option>
        {branches.data?.filter((b) => b.id !== branch?.id).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
      </select>
      <label htmlFor="b-address">Alamat</label>
      <input id="b-address" {...register('address')} className={field} />
      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">Simpan</Button>
    </form>
  )
}
