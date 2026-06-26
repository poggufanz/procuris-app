# Procuris local dev bring-up (no Docker): MySQL per-schema + php -S + Node gateway.
# Brings up auth(8001) employee(8002) purchase(8003) notification(8004) + gateway(8080).
# Requires MySQL running on $DbHost:$DbPort with 4 schemas: db_auth / db_hrm / db_purchasing / db_notification.
# Notification inbox lives in Redis (+phpredis); its MySQL schema only holds Laravel framework tables.
# Usage:  powershell -ExecutionPolicy Bypass -File run-dev.ps1
#         powershell -ExecutionPolicy Bypass -File run-dev.ps1 -DbUser root -DbPass 12345

param(
  [string]$DbHost = '127.0.0.1',
  [string]$DbPort = '3306',
  [string]$DbUser = 'root',
  [string]$DbPass = '12345'        # ponytail: default dev lokal; override dengan -DbPass utk setup lain
)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$services = @(
  @{ name='auth-service';         port=8001; seed=$true;  db='db_auth' },
  @{ name='employee-service';     port=8002; seed=$false; db='db_hrm' },
  @{ name='purchase-service';     port=8003; seed=$false; db='db_purchasing' },
  @{ name='notification-service'; port=8004; seed=$false; db='db_notification' }
)

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
