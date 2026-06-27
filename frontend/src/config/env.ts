const url = import.meta.env.VITE_API_GATEWAY_URL
if (!url) throw new Error('VITE_API_GATEWAY_URL is not set')
export const env = { API_GATEWAY_URL: url as string }
