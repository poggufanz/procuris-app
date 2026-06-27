import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { positionSchema, type PositionFormInput, type PositionInput } from './positionSchema'
import { useSavePosition, usePositions, type Position } from './positionApi'
import { useBranches } from './branchApi'
import { Button } from '@/components/ui/button'
import { getApiError } from '@/lib/apiError'

const LEVELS: Record<number, string> = { 1: 'Staff', 2: 'Supervisor', 3: 'Manager', 4: 'Direktur' }
const nullableNumber = (v: unknown) => v === '' || v == null ? null : Number(v)

export function PositionForm({ position, onDone }: { position?: Position; onDone: () => void }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PositionFormInput, unknown, PositionInput>({
    resolver: zodResolver(positionSchema),
    defaultValues: position ?? { level: 1, parent_position_id: null, branch_id: null },
  })
  const positions = usePositions()
  const branches = useBranches()
  const save = useSavePosition(position?.id)
  // re-apply default once atasan/cabang <option>s exist, else those selects show blank on edit
  const optionsReady = !!positions.data && !!branches.data
  useEffect(() => {
    if (position && optionsReady) reset(position)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsReady])

  const onSubmit = async (data: PositionInput) => {
    try {
      await save.mutateAsync(data)
      toast.success('Jabatan disimpan')
      onDone()
    } catch (e) { toast.error(getApiError(e).message) }
  }

  const field = 'mb-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm'
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <label htmlFor="p-name">Nama</label>
      <input id="p-name" {...register('name')} className={field} />
      {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
      <label htmlFor="p-level">Level</label>
      <select id="p-level" {...register('level')} className={field}>
        {Object.entries(LEVELS).map(([v, label]) => <option key={v} value={v}>{label}</option>)}
      </select>
      <label htmlFor="p-division">Divisi</label>
      <input id="p-division" {...register('division')} className={field} />
      {errors.division && <p className="text-xs text-red-600">{errors.division.message}</p>}
      <label htmlFor="p-parent">Atasan</label>
      <select id="p-parent" {...register('parent_position_id', { setValueAs: nullableNumber })} className={field}>
        <option value="">Tanpa atasan</option>
        {positions.data?.filter((p) => p.id !== position?.id).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <label htmlFor="p-branch">Cabang</label>
      <select id="p-branch" {...register('branch_id', { setValueAs: nullableNumber })} className={field}>
        <option value="">Tanpa cabang</option>
        {branches.data?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
      </select>
      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">Simpan</Button>
    </form>
  )
}
