# Procuris local dev bring-up: MySQL per-schema + Redis + php -S + Node gateway.
# Brings up auth(8001) employee(8002) purchase(8003) notification(8004) + gateway(8080).
# Requires MySQL running on $DbHost:$DbPort with 4 schemas: db_auth / db_hrm / db_purchasing / db_notification.
# Notification inbox lives in Redis ($RedisPort); auto-started via docker if not already up
# (skip with -SkipRedis). Uses the predis client, so no phpredis PHP extension is needed.
# Usage:  powershell -ExecutionPolicy Bypass -File run-dev.ps1
#         powershell -ExecutionPolicy Bypass -File run-dev.ps1 -DbUser root -DbPass 12345

param(
  [string]$DbHost = '127.0.0.1',
  [string]$DbPort = '3306',
  [string]$DbUser = 'root',
  [string]$DbPass = '12345',       # ponytail: default dev lokal; override dengan -DbPass utk setup lain
  [int]$RedisPort = 6379,
  [switch]$SkipRedis
)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$services = @(
  @{ name='auth-service';         port=8001; seed=$true; db='db_auth' },
  @{ name='employee-service';     port=8002; seed=$true; db='db_hrm' },
  @{ name='purchase-service';     port=8003; seed=$true; db='db_purchasing' },
  @{ name='notification-service'; port=8004; seed=$true; db='db_notification' }
)

function Test-PortUp([int]$p) {
  try { (Test-NetConnection 127.0.0.1 -Port $p -WarningAction SilentlyContinue).TcpTestSucceeded } catch { $false }
}

# ponytail: docker-only Redis bring-up; for Memurai/WSL just leave Redis running and it's detected as already-up.
function Ensure-Redis([int]$port) {
  if (Test-PortUp $port) { Write-Host "==> Redis already up on :$port" -ForegroundColor Green; return }

  $docker = (Get-Command docker -ErrorAction SilentlyContinue).Source
  if (-not $docker) {
    $cand = 'C:\Program Files\Docker\Docker\resources\bin\docker.exe'
    if (Test-Path $cand) { $env:Path = (Split-Path $cand) + ';' + $env:Path; $docker = $cand }
  }
  if (-not $docker) {
    Write-Host "!! Redis down and docker not found. Start Redis manually (Memurai/WSL) or /notifications will fail." -ForegroundColor Yellow
    return
  }

  Write-Host "==> starting Redis via docker on :$port" -ForegroundColor Cyan
  & $docker start redis 2>$null | Out-Null
  if (-not (Test-PortUp $port)) {
    & $docker run -d --name redis --restart unless-stopped -p "$($port):6379" redis 2>$null | Out-Null
  }
  for ($i = 0; $i -lt 15 -and -not (Test-PortUp $port); $i++) { Start-Sleep -Seconds 1 }

  if (Test-PortUp $port) { Write-Host "    Redis -> 127.0.0.1:$port" -ForegroundColor Green }
  else { Write-Host "!! Redis still unreachable on :$port - check Docker Desktop engine." -ForegroundColor Yellow }
}

if (-not $SkipRedis) { Ensure-Redis $RedisPort }

foreach ($s in $services) {
  $dir = Join-Path $root "services/$($s.name)"
  Write-Host "==> preparing $($s.name)" -ForegroundColor Cyan
  Push-Location $dir
  if (-not (Test-Path .env)) { Copy-Item .env.example .env }

  $env_ = Get-Content .env | Where-Object { $_ -notmatch '^\s*#?\s*DB_(CONNECTION|HOST|PORT|DATABASE|USERNAME|PASSWORD)\b' }
  $env_ += @(
    'DB_CONNECTION=mysql',
    "DB_HOST=$DbHost",
    "DB_PORT=$DbPort",
    "DB_DATABASE=$($s.db)",
    "DB_USERNAME=$DbUser",
    "DB_PASSWORD=$DbPass"
  )
  Set-Content .env $env_

  # predis client = no phpredis extension required; pin Redis target for the notif inbox.
  if ($s.name -eq 'notification-service') {
    $renv = Get-Content .env | Where-Object { $_ -notmatch '^\s*#?\s*REDIS_(CLIENT|HOST|PORT)\b' }
    $renv += @('REDIS_CLIENT=predis', 'REDIS_HOST=127.0.0.1', "REDIS_PORT=$RedisPort")
    Set-Content .env $renv
  }

  if (-not (Select-String -Path .env -Pattern '^APP_KEY=base64' -Quiet)) { php artisan key:generate --force | Out-Null }
  if ($s.name -eq 'auth-service' -and -not (Select-String -Path .env -Pattern '^JWT_SECRET=.+' -Quiet)) { php artisan jwt:secret --force | Out-Null }

  php artisan migrate --force | Out-Null
  if ($s.seed) { php artisan db:seed --force | Out-Null }   # auth seeds super@procuris.test / password
  Pop-Location

  # php artisan serve fails to bind on some Windows PHP builds; use the built-in server directly.
  Start-Process php -ArgumentList '-S',"127.0.0.1:$($s.port)",'-t','public' -WorkingDirectory $dir -WindowStyle Minimized
  Write-Host "    $($s.name) -> http://127.0.0.1:$($s.port)  ($($s.db))" -ForegroundColor Green
}

Start-Process node -ArgumentList 'gateway.mjs' -WorkingDirectory (Join-Path $root 'gateway') -WindowStyle Minimized
Write-Host "==> gateway -> http://localhost:8080 (frontend VITE_API_GATEWAY_URL points here)" -ForegroundColor Green
Write-Host "Login: super@procuris.test / password" -ForegroundColor Yellow
Write-Host "Frontend: cd frontend; npm run dev" -ForegroundColor Yellow
