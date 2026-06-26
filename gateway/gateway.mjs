import http from 'node:http'

const PORT = Number(process.env.GATEWAY_PORT || 8080)
const T = {
  auth: process.env.AUTH_URL || 'http://127.0.0.1:8001',
  employee: process.env.EMPLOYEE_URL || 'http://127.0.0.1:8002',
  purchase: process.env.PURCHASE_URL || 'http://127.0.0.1:8003',
  notification: process.env.NOTIFICATION_URL || 'http://127.0.0.1:8004',
}

const ROUTES = [
  [/^\/auth(\/|$)/, T.auth],
  [/^\/(branches|positions|employees)(\/|$)/, T.employee],
  [/^\/(vendors|items|purchase-orders)(\/|$)/, T.purchase],
  [/^\/notifications(\/|$)/, T.notification],
]

const pick = (path) => (ROUTES.find(([re]) => re.test(path)) || [])[1]

const ALLOWED_ORIGINS = new Set(
  (process.env.GATEWAY_ALLOWED_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',').map((o) => o.trim()).filter(Boolean)
)

const cors = (req, res) => {
  const origin = req.headers.origin
  res.setHeader('Vary', 'Origin')
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type,Accept,X-Service-Secret')
}

http.createServer((req, res) => {
  cors(req, res)
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end() }

  const path = req.url.split('?')[0]
  if (path === '/' || path === '/up' || path === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ gateway: 'up', targets: T }))
  }

  const target = pick(path)
  if (!target) { res.writeHead(404, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ message: `no route for ${path}` })) }

  const u = new URL(req.url, target)
  const headers = { ...req.headers, host: u.host }
  const proxied = http.request(
    { hostname: u.hostname, port: u.port, path: u.pathname + u.search, method: req.method, headers },
    (pr) => { res.writeHead(pr.statusCode || 502, pr.headers); pr.pipe(res) }
  )
  proxied.on('error', (e) => { res.writeHead(502, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ message: 'gateway upstream error', detail: e.message, target })) })
  req.pipe(proxied)
}).listen(PORT, () => console.log(`gateway :${PORT} -> ${JSON.stringify(T)}`))
