@echo off
echo ========================================
echo    Expo Restart Script
echo ========================================
echo.

echo Stopping any running Metro processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 >nul

echo Clearing all caches...
if exist .expo rmdir /s /q .expo
if exist .metro rmdir /s /q .metro
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo Starting Expo with fresh cache...
npx expo start --clear --reset-cache

echo.
echo ========================================
echo App should now load without errors!
echo Scan the QR code with Expo Go SDK 51
echo ========================================
pause
