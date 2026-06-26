const rupiahFmt = new Intl.NumberFormat('id-ID')
const dateFmt = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })

export const format = {
  rupiah: (n: number) => `Rp ${rupiahFmt.format(n)}`,
  date: (iso: string) => dateFmt.format(new Date(iso)),
  dateInput: (iso: string) => new Date(iso).toISOString().slice(0, 10),
}
