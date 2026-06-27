import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { itemSchema, type ItemFormInput, type ItemInput } from './schema'
import { useSaveItem, type Item } from './api'
import { useVendors } from '@/features/purchasing/vendors/api'
import { Button } from '@/components/ui/button'
import { getApiError } from '@/lib/apiError'

export function ItemForm({ item, onDone }: { item?: Item; onDone: () => void }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ItemFormInput, unknown, ItemInput>({
    resolver: zodResolver(itemSchema),
    defaultValues: item ?? { description: '', default_vendor_id: null },
  })
  const vendors = useVendors({})
  const save = useSaveItem(item?.id)
  // re-apply default once vendor <option>s exist, else the default-vendor select shows blank on edit
  useEffect(() => {
    if (item && vendors.data) reset(item)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendors.data])

  const onSubmit = async (data: ItemInput) => {
    try {
      await save.mutateAsync(data)
      toast.success('Item disimpan')
      onDone()
    } catch (e) { toast.error(getApiError(e).message) }
  }

  const field = 'mb-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm'
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <label htmlFor="i-code">Kode</label>
      <input id="i-code" {...register('code')} className={field} />
      {errors.code && <p className="text-xs text-red-600">{errors.code.message}</p>}
      <label htmlFor="i-name">Nama</label>
      <input id="i-name" {...register('name')} className={field} />
      {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
      <label htmlFor="i-category">Kategori</label>
      <input id="i-category" {...register('category')} className={field} />
      {errors.category && <p className="text-xs text-red-600">{errors.category.message}</p>}
      <label htmlFor="i-unit">Satuan</label>
      <input id="i-unit" {...register('unit')} className={field} />
      {errors.unit && <p className="text-xs text-red-600">{errors.unit.message}</p>}
      <label htmlFor="i-desc">Deskripsi</label>
      <input id="i-desc" {...register('description')} className={field} />
      <label htmlFor="i-vendor">Vendor default</label>
      <select id="i-vendor" {...register('default_vendor_id')} className={field}>
        <option value="">Tidak ada</option>
        {vendors.data?.data.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
      </select>
      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">Simpan</Button>
    </form>
  )
}
