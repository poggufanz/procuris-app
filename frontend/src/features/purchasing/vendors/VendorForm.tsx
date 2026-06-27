import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { vendorSchema, type VendorFormInput, type VendorInput } from './schema'
import { useSaveVendor, type Vendor } from './api'
import { Button } from '@/components/ui/button'
import { getApiError } from '@/lib/apiError'

export function VendorForm({ vendor, onDone }: { vendor?: Vendor; onDone: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<VendorFormInput, unknown, VendorInput>({
    resolver: zodResolver(vendorSchema),
    defaultValues: vendor ?? { payment_term_days: 30, email: '', npwp: '' },
  })
  const save = useSaveVendor(vendor?.id)

  const onSubmit = async (data: VendorInput) => {
    try {
      await save.mutateAsync(data)
      toast.success('Vendor disimpan')
      onDone()
    } catch (e) { toast.error(getApiError(e).message) }
  }

  const field = 'mb-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm'
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <label htmlFor="v-name">Nama</label>
      <input id="v-name" {...register('name')} className={field} />
      {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
      <label htmlFor="v-code">Kode</label>
      <input id="v-code" {...register('code')} className={field} />
      {errors.code && <p className="text-xs text-red-600">{errors.code.message}</p>}
      <label htmlFor="v-pic">PIC</label>
      <input id="v-pic" {...register('contact_person')} className={field} />
      {errors.contact_person && <p className="text-xs text-red-600">{errors.contact_person.message}</p>}
      <label htmlFor="v-phone">Telepon</label>
      <input id="v-phone" {...register('phone')} className={field} />
      {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
      <label htmlFor="v-email">Email</label>
      <input id="v-email" {...register('email')} className={field} />
      {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
      <label htmlFor="v-address">Alamat</label>
      <input id="v-address" {...register('address')} className={field} />
      {errors.address && <p className="text-xs text-red-600">{errors.address.message}</p>}
      <label htmlFor="v-npwp">NPWP</label>
      <input id="v-npwp" {...register('npwp')} className={field} />
      <label htmlFor="v-term">Termin (hari)</label>
      <input id="v-term" type="number" {...register('payment_term_days')} className={field} />
      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">Simpan</Button>
    </form>
  )
}
