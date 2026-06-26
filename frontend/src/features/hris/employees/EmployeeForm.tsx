import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { employeeSchema, type EmployeeFormInput, type EmployeeInput } from './schema'
import { useCreateEmployee, useUpdateEmployee, useBranchOptions, usePositionOptions, useUserOptions, type Employee } from './api'
import { Button } from '@/components/ui/button'
import { getApiError } from '@/lib/apiError'

export function EmployeeForm({ employee, onDone }: { employee?: Employee; onDone: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EmployeeFormInput, unknown, EmployeeInput>({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee ?? { tanggal_akhir_kontrak: null, status: 'aktif' },
  })
  const users = useUserOptions()
  const branches = useBranchOptions()
  const positions = usePositionOptions()
  const create = useCreateEmployee()
  const update = useUpdateEmployee(employee?.id ?? 0)

  const onSubmit = async (data: EmployeeInput) => {
    try {
      if (employee) await update.mutateAsync(data)
      else await create.mutateAsync(data)
      toast.success('Karyawan disimpan')
      onDone()
    } catch (e) { toast.error(getApiError(e).message) }
  }

  const field = 'mb-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm'
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <label htmlFor="user">User</label>
      {/* ponytail: plain select over active users; server supports ?q= search if the list outgrows this */}
      <select id="user" {...register('user_id')} className={field} disabled={!!employee}>
        <option value="">Pilih user…</option>
        {users.data?.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.email}) #{u.id}</option>)}
      </select>
      {errors.user_id && <p className="text-xs text-red-600">{errors.user_id.message}</p>}
      <label htmlFor="nama">Nama</label>
      <input id="nama" {...register('nama_lengkap')} className={field} />
      {errors.nama_lengkap && <p className="text-xs text-red-600">{errors.nama_lengkap.message}</p>}
      <label htmlFor="nik">NIK</label>
      <input id="nik" placeholder="2026.01.123" {...register('nomor_induk_karyawan')} className={field} />
      {errors.nomor_induk_karyawan && <p className="text-xs text-red-600">{errors.nomor_induk_karyawan.message}</p>}
      <label htmlFor="alamat">Alamat</label>
      <textarea id="alamat" {...register('alamat')} className={field} rows={2} />
      {errors.alamat && <p className="text-xs text-red-600">{errors.alamat.message}</p>}
      <label htmlFor="branch">Cabang</label>
      <select id="branch" {...register('branch_id')} className={field}>
        {branches.data?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
      </select>
      <label htmlFor="pos">Jabatan</label>
      <select id="pos" {...register('position_id')} className={field}>
        {positions.data?.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <label htmlFor="join">Tanggal gabung</label>
      <input id="join" type="date" {...register('tanggal_gabung')} className={field} />
      {errors.tanggal_gabung && <p className="text-xs text-red-600">{errors.tanggal_gabung.message}</p>}
      <label htmlFor="start">Mulai kontrak</label>
      <input id="start" type="date" {...register('tanggal_mulai_kontrak')} className={field} />
      {errors.tanggal_mulai_kontrak && <p className="text-xs text-red-600">{errors.tanggal_mulai_kontrak.message}</p>}
      <label htmlFor="end">Akhir kontrak</label>
      <input id="end" type="date" {...register('tanggal_akhir_kontrak')} className={field} />
      <label htmlFor="status">Status</label>
      <select id="status" {...register('status')} className={field}>
        <option value="aktif">Aktif</option>
        <option value="nonaktif">Nonaktif</option>
        <option value="kontrak_berakhir">Kontrak berakhir</option>
      </select>
      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">Simpan</Button>
    </form>
  )
}
