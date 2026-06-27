import { decodeExp } from './jwt'

function makeJwt(exp: number) {
  const body = btoa(JSON.stringify({ exp }))
  return `h.${body}.s`
}

test('decodeExp reads exp claim', () => {
  expect(decodeExp(makeJwt(1750000000))).toBe(1750000000)
})

test('decodeExp returns null on garbage', () => {
  expect(decodeExp('not-a-jwt')).toBeNull()
})
