# Release APK (optimized size)

## PowerShell: `npm` blocked?

If you see *running scripts is disabled*, use either:

```powershell
npm.cmd start
```

Or allow scripts for your user (once):

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

## Quick build

From `ecommerce_mobile`:

```bash
npm run build:apk
```

**Windows (if Gradle says files are locked):**

```powershell
cd android
.\gradlew.bat --stop
Remove-Item -Recurse -Force app\build -ErrorAction SilentlyContinue
$env:NODE_ENV = "production"
.\gradlew.bat assembleRelease --no-daemon
```

Or run: `powershell -ExecutionPolicy Bypass -File scripts\build-release-apk.ps1`

**Smallest APK** (arm64 only — most phones from 2019+):

```bash
npm run build:apk:arm64
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

## Requirements

1. **Android SDK** — Install [Android Studio](https://developer.android.com/studio), then set:
   - Windows: `ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk`
   - Or the build script auto-detects `%LOCALAPPDATA%\Android\Sdk`

2. **JDK 17+** — Bundled with Android Studio is fine.

## Size optimizations applied

| Setting | Effect |
|--------|--------|
| **arm64-v8a + armeabi-v7a only** | Drops x86/x86_64 emulator libs (~35–45% smaller vs universal) |
| **R8 minify** | Shrinks Java/Kotlin bytecode |
| **Shrink resources** | Removes unused resources |
| **Bundle compression** | Compresses JS bundle in APK |
| **GIF support off** | Saves Fresco GIF decoder weight |
| **Hermes** | Already enabled (smaller than JSC) |

Use `build:apk:arm64` if you only target modern phones and want the minimum file size.

## Play Store

For Google Play, prefer **AAB** (smaller downloads per device):

```bash
cd android
gradlew.bat bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

## Production signing

Release builds currently use the **debug keystore** (fine for testing). For production:

1. Create a keystore: `keytool -genkey -v -keystore macquul-release.keystore -alias macquul -keyalg RSA -keysize 2048 -validity 10000`
2. Add `android/keystore.properties` (do not commit) and wire `signingConfigs.release` in `android/app/build.gradle`.

See [React Native signed APK](https://reactnative.dev/docs/signed-apk-android).
