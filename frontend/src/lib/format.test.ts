import { format } from './format'

test('rupiah formats with thousands separators', () => {
  expect(format.rupiah(14250000)).toBe('Rp 14.250.000')
})

test('date renders id-ID short', () => {
  expect(format.date('2026-07-12')).toMatch(/12 Jul 2026/)
})

test('dateInput returns yyyy-mm-dd for <input type=date>', () => {
  expect(format.dateInput('2026-07-12T00:00:00Z')).toBe('2026-07-12')
})
