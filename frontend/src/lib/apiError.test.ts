import { AxiosError } from 'axios'
import { getApiError } from './apiError'

test('extracts message + status from an axios error body', () => {
  const err = new AxiosError('req failed')
  // @ts-expect-error minimal shape
  err.response = { status: 422, data: { message: 'Branch is not active' } }
  expect(getApiError(err)).toEqual({ message: 'Branch is not active', status: 422 })
})

test('falls back to a generic message for non-axios errors', () => {
  expect(getApiError(new Error('boom'))).toEqual({ message: 'Terjadi kesalahan', status: null })
})
