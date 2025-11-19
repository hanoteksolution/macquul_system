@echo off
echo ========================================
echo    Expo SDK 51 Fix Script
echo ========================================
echo.

echo Step 1: Cleaning old installation...
echo Removing node_modules...
if exist node_modules rmdir /s /q node_modules
echo Removing package-lock.json...
if exist package-lock.json del package-lock.json
echo Removing .expo cache...
if exist .expo rmdir /s /q .expo
echo Removing metro cache...
if exist .metro rmdir /s /q .metro
echo Done cleaning!
echo.

echo Step 2: Installing SDK 51 dependencies...
echo This may take a few minutes...
npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)
echo Dependencies installed successfully!
echo.

echo Step 3: Starting Expo development server...
echo Starting with clear cache...
npx expo start --clear --reset-cache

echo.
echo ========================================
echo For SDK 51 compatibility:
echo 1. Download Expo Go for SDK 51 from the Play Store
echo 2. Or use: https://expo.dev/go?sdkVersion=51
echo 3. Scan the QR code with the SDK 51 compatible Expo Go
echo ========================================
pause
