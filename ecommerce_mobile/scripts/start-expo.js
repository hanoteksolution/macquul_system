/**
 * Starts Expo with LAN/tunnel. Usage: node scripts/start-expo.js [lan|tunnel|localhost]
 *
 * IMPORTANT: Never set REACT_NATIVE_PACKAGER_HOSTNAME in .env or Windows user env —
 * it gets embedded in the JS bundle and causes Hermes "protocol getter" red screen.
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const root = path.join(__dirname, '..');
const envFile = path.join(root, '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (key.startsWith('EXPO_PUBLIC_') && !process.env[key]) {
      process.env[key] = val;
    }
  }
}

function getLanIps() {
  const nets = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        ips.push({ name, address: net.address });
      }
    }
  }
  return ips;
}

function pickLanHost(ips) {
  const isVirtual = (name) =>
    /virtual|vmware|hyper-v|vethernet|loopback|docker|wsl|bluetooth/i.test(name);
  const candidates = ips.filter((i) => !isVirtual(i.name) && !i.address.startsWith('169.254.'));
  const score = (ip) => {
    let s = 0;
    if (ip.address.startsWith('192.168.') && !ip.address.endsWith('.1')) s += 30;
    if (ip.address.startsWith('192.168.')) s += 20;
    if (ip.address.startsWith('10.')) s += 25;
    if (/wi-?fi|wlan|wireless/i.test(ip.name)) s += 15;
    return s;
  };
  const sorted = [...candidates].sort((a, b) => score(b) - score(a));
  return sorted[0]?.address;
}

const mode = (process.argv[2] || 'lan').toLowerCase();
const ips = getLanIps();
const suggestedHost = pickLanHost(ips);

console.log('\n📱 Expo device connection');
if (ips.length) {
  console.log('   Detected IPv4:');
  ips.forEach((i) => console.log(`   - ${i.name}: ${i.address}`));
}
if (mode === 'lan' && suggestedHost) {
  console.log(`   Suggested Expo Go URL: exp://${suggestedHost}:8081`);
  console.log('   Scan the QR code from the terminal (use Expo Go, not Chrome).\n');
} else if (mode === 'tunnel') {
  console.log('   Using tunnel — scan the exp.direct QR code in Expo Go.\n');
}

// Build child env: strip packager hostname vars so they never reach Metro / the app bundle
const env = { ...process.env };
delete env.REACT_NATIVE_PACKAGER_HOSTNAME;
delete env.EXPO_PACKAGER_HOSTNAME;
delete env.CI;
env.EXPO_NO_INTERACTIVE = '1';
// Avoid SDK 54 lazy-bundle URL bugs on device (protocol getter crash)
env.EXPO_NO_METRO_LAZY = '1';

const expoArgs = ['start', '--go', '--clear'];

if (mode === 'tunnel') {
  expoArgs.push('--tunnel');
} else if (mode === 'localhost') {
  expoArgs.push('--localhost');
} else {
  expoArgs.push('--lan');
}

function spawnExpo() {
  if (process.platform === 'win32') {
    const quoted = expoArgs.map((a) => (/\s/.test(a) ? `"${a}"` : a)).join(' ');
    // Clear packager hostname in cmd session (Windows user env may still set it)
    const prelude =
      'set REACT_NATIVE_PACKAGER_HOSTNAME=& set EXPO_PACKAGER_HOSTNAME=& set EXPO_NO_METRO_LAZY=1& set EXPO_NO_INTERACTIVE=1& ';
    return spawn('cmd.exe', ['/d', '/s', '/c', `${prelude}npx expo ${quoted}`], {
      stdio: 'inherit',
      env,
      cwd: root,
    });
  }
  return spawn('npx', ['expo', ...expoArgs], { stdio: 'inherit', env, cwd: root });
}

spawnExpo().on('exit', (code) => process.exit(code ?? 0));
