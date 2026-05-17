# Waits until Docker published ports respond (after make up).
param([int]$TimeoutSec = 180)

$ErrorActionPreference = "SilentlyContinue"

function Test-PortPublished {
    param([string]$Container, [string]$HostPort)
    $out = docker port $Container 2>$null
    if (-not $out) { return $false }
    return ($out -match ":$HostPort")
}

$checks = @(
    @{ Container = "macquul_system-client-1"; HostPort = "3002"; Name = "Store";  Url = "http://127.0.0.1:3002/" },
    @{ Container = "macquul_system-admin-1";  HostPort = "3003"; Name = "Admin";  Url = "http://127.0.0.1:3003/" },
    @{ Container = "macquul_system-backend-1"; HostPort = "8001"; Name = "API";    Url = "http://127.0.0.1:8001/admin/" }
)

Write-Host "[wait] Checking Docker port bindings..."
$bindingOk = $true
foreach ($c in $checks) {
    if (-not (Test-PortPublished -Container $c.Container -HostPort $c.HostPort)) {
        Write-Host "[wait] FAIL: $($c.Container) is not published on host port $($c.HostPort)" -ForegroundColor Red
        $bindingOk = $false
    }
}

if (-not $bindingOk) {
    Write-Host ""
    Write-Host "Port mapping missing. Try:" -ForegroundColor Yellow
    Write-Host "  make down"
    Write-Host "  make up"
    Write-Host "If it persists, restart Docker Desktop, then run make up again."
    exit 1
}

Write-Host "[wait] Port bindings OK. Waiting for HTTP responses (up to ${TimeoutSec}s)..."
$deadline = (Get-Date).AddSeconds($TimeoutSec)
$allOk = $true

foreach ($c in $checks) {
    $ready = $false
    Write-Host "[wait] $($c.Name) $($c.Url) ..."
    while ((Get-Date) -lt $deadline) {
        try {
            $resp = Invoke-WebRequest -Uri $c.Url -UseBasicParsing -TimeoutSec 8
            if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 500) {
                Write-Host "[wait] $($c.Name) ready (HTTP $($resp.StatusCode))" -ForegroundColor Green
                $ready = $true
                break
            }
        } catch {
            # connection refused / empty response while Next.js compiles
        }
        Start-Sleep -Seconds 3
    }
    if (-not $ready) {
        Write-Host "[wait] FAIL: $($c.Name) did not respond in time" -ForegroundColor Red
        $allOk = $false
    }
}

if (-not $allOk) {
    Write-Host ""
    Write-Host "Services not ready. Check logs:" -ForegroundColor Yellow
    Write-Host "  make client-logs"
    Write-Host "  make admin-logs"
    exit 1
}

Write-Host ""
Write-Host "All services are reachable:" -ForegroundColor Green
Write-Host "  Store  http://localhost:3002"
Write-Host "  Admin  http://localhost:3003"
Write-Host "  API    http://localhost:8001"
exit 0
