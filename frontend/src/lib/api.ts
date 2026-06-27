import axios from 'axios'
import { env } from '@/config/env'
import { getAccessToken } from '@/lib/auth/tokens'

const api = axios.create({ baseURL: env.API_GATEWAY_URL })

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let refreshing: Promise<string> | null = null
api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config
    const status = error.response?.status
    const isAuthCall = typeof original?.url === 'string' && original.url.includes('/auth/')
    if (status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true
      try {
        const { refreshAccessToken } = await import('@/stores/auth.store')
        refreshing = refreshing ?? refreshAccessToken().finally(() => { refreshing = null })
        await refreshing
        return api(original)
      } catch {
        const { useAuthStore } = await import('@/stores/auth.store')
        await useAuthStore.getState().logout()
      }
    }
    return Promise.reject(error)
  },
)

export default api
