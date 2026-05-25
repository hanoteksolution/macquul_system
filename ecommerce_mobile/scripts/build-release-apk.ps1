# Release APK build (Windows) — stops daemons, cleans locks, builds optimized APK
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$android = Join-Path $root "android"

Set-Location $android

Write-Host "Stopping Gradle daemons..."
& .\gradlew.bat --stop 2>$null
Start-Sleep -Seconds 2

Write-Host "Cleaning app build folder (fixes locked .so files)..."
Remove-Item -Recurse -Force (Join-Path $android "app\build") -ErrorAction SilentlyContinue

if (-not (Test-Path (Join-Path $android "local.properties"))) {
    $sdk = "$env:LOCALAPPDATA\Android\Sdk"
    "sdk.dir=$($sdk -replace '\\','/')" | Out-File -Encoding ascii (Join-Path $android "local.properties")
}

$env:NODE_ENV = "production"
& .\gradlew.bat assembleRelease --no-daemon

$apk = Join-Path $android "app\build\outputs\apk\release\app-release.apk"
if (Test-Path $apk) {
    $mb = [math]::Round((Get-Item $apk).Length / 1MB, 2)
    Write-Host "`nRelease APK ($mb MB):`n  $apk`n"
} else {
    Write-Host "`nBuild finished. Check app\build\outputs\apk\release\`n"
}
