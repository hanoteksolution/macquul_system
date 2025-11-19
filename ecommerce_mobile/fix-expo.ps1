Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Expo SDK 54 Upgrade Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Cleaning old installation..." -ForegroundColor Yellow
Write-Host "Removing node_modules..." -ForegroundColor Gray
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
Write-Host "Removing package-lock.json..." -ForegroundColor Gray
if (Test-Path "package-lock.json") { Remove-Item -Force "package-lock.json" }
Write-Host "Removing .expo cache..." -ForegroundColor Gray
if (Test-Path ".expo") { Remove-Item -Recurse -Force ".expo" }
Write-Host "Done cleaning!" -ForegroundColor Green
Write-Host ""

Write-Host "Step 2: Installing SDK 54 dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
try {
    & npm install
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed"
    }
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: npm install failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

Write-Host "Step 3: Using Expo CLI to fix any remaining issues..." -ForegroundColor Yellow
& npx expo install --fix
Write-Host ""

Write-Host "Step 4: Starting Expo development server..." -ForegroundColor Yellow
Write-Host "Starting with clear cache..." -ForegroundColor Gray
& npx expo start --clear

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "If you still see SDK compatibility errors:" -ForegroundColor Yellow
Write-Host "1. Make sure Expo Go app is updated to latest version" -ForegroundColor White
Write-Host "2. Try restarting this script" -ForegroundColor White
Write-Host "3. Check that QR code shows SDK 54" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Read-Host "Press Enter to exit"
