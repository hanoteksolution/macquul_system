# Quick Fix for Metro/TurboModule Error

## The Problem
You're getting a TurboModuleRegistry error because of version conflicts between React Native and Expo.

## Solution Options

### Option 1: Use SDK 51 Compatible Expo Go
Since your project is now configured for SDK 51, you need the SDK 51 version of Expo Go:

1. **Download Expo Go for SDK 51**: https://expo.dev/go?sdkVersion=51&platform=android
2. **Or search** "Expo Go SDK 51" in Play Store

### Option 2: Clean Install (Run these commands one by one)
Open Command Prompt in the mobile folder and run:

```cmd
rmdir /s /q node_modules
del package-lock.json
rmdir /s /q .expo
npm install --legacy-peer-deps
npx expo start --clear --reset-cache --tunnel
```

### Option 3: Use the Fix Script
Double-click `fix-expo.bat` - it will do all the above automatically.

### Option 4: Alternative Start Command
If still having issues, try:
```cmd
npx expo start --dev-client --clear
```

## Expected Result
- No more TurboModule errors
- QR code will work with SDK 51 Expo Go
- App should load successfully

## If Still Having Issues
1. Make sure you're using Expo Go SDK 51 (not SDK 54)
2. Try the tunnel option: `npx expo start --tunnel`
3. Restart your phone and try again
4. Clear Expo Go app cache on your phone
