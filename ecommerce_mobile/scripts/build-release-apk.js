/**
 * Build a optimized release APK (arm only, minified, shrunk resources).
 * Requires: Node, JDK 17+, Android SDK (ANDROID_HOME).
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const androidDir = path.join(root, 'android');
const localProps = path.join(androidDir, 'local.properties');

function resolveSdkDir() {
  const env = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
  if (env && fs.existsSync(env)) return env;
  const win = process.env.LOCALAPPDATA
    ? path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk')
    : null;
  if (win && fs.existsSync(win)) return win;
  const mac = path.join(process.env.HOME || '', 'Library', 'Android', 'sdk');
  if (mac && fs.existsSync(mac)) return mac;
  return null;
}

function writeLocalProperties(sdkDir) {
  const content = `sdk.dir=${sdkDir.replace(/\\/g, '/')}\n`;
  fs.writeFileSync(localProps, content, 'utf8');
  console.log(`Wrote ${localProps}`);
}

function run(cmd, args, cwd) {
  console.log(`\n> ${cmd} ${args.join(' ')}\n`);
  const r = spawnSync(cmd, args, {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

const sdk = resolveSdkDir();
if (!sdk) {
  console.error(
    'Android SDK not found. Install Android Studio, then set ANDROID_HOME to your Sdk folder.'
  );
  process.exit(1);
}
writeLocalProperties(sdk);

const arm64Only = process.argv.includes('--arm64-only');

console.log(
  arm64Only
    ? 'Smallest build: arm64-v8a only (~30% smaller than arm64+armv7)\n'
    : 'Building release APK (arm64 + armeabi-v7a, minify, shrink resources)...\n'
);

// Avoid "Unable to delete libreactnative.so" when a Gradle daemon holds files (Windows)
const gradlewStop = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
if (fs.existsSync(androidDir)) {
  run(gradlewStop, ['--stop'], androidDir);
  const appBuild = path.join(androidDir, 'app', 'build');
  if (fs.existsSync(appBuild)) {
    fs.rmSync(appBuild, { recursive: true, force: true });
  }
}

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

run('npx', ['expo', 'prebuild', '--platform', 'android', '--no-install'], root);

if (arm64Only) {
  const propsPath = path.join(androidDir, 'gradle.properties');
  let props = fs.readFileSync(propsPath, 'utf8');
  props = props.replace(/reactNativeArchitectures=.*/, 'reactNativeArchitectures=arm64-v8a');
  fs.writeFileSync(propsPath, props);
}

const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
run(gradlew, ['assembleRelease', '--no-daemon'], androidDir);

const apkDir = path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'release');
const apk = path.join(apkDir, 'app-release.apk');
if (fs.existsSync(apk)) {
  const mb = (fs.statSync(apk).size / (1024 * 1024)).toFixed(2);
  console.log(`\nRelease APK (${mb} MB):\n  ${apk}\n`);
} else {
  console.log(`\nBuild finished. Check: ${apkDir}\n`);
}
