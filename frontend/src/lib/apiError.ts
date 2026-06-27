import { AxiosError } from 'axios'

export interface ApiError { message: string; status: number | null }

export function getApiError(err: unknown): ApiError {
  if (err instanceof AxiosError) {
    const status = err.response?.status ?? null
    const data = err.response?.data as { message?: string } | undefined
    return { message: data?.message ?? 'Terjadi kesalahan', status }
  }
  return { message: 'Terjadi kesalahan', status: null }
}
