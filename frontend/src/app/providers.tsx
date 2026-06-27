import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { Toaster, toast } from 'sonner'
import { getApiError } from '@/lib/apiError'

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (err) => {
      const { status, message } = getApiError(err)
      if (status === 401) return
      if (status === 403) toast.error('Akses ditolak.')
      else if (status == null || status >= 500) toast.error(message)
    },
  }),
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
})
export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  )
}
