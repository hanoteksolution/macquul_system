/**
 * Removes Metro / Expo caches (fixes stale bundle with bad packager hostname).
 * Usage: node scripts/clear-expo-cache.js
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function rm(target) {
  if (!fs.existsSync(target)) return;
  fs.rmSync(target, { recursive: true, force: true });
  console.log('  removed', path.relative(root, target));
}

console.log('\nClearing Expo / Metro caches...\n');
rm(path.join(root, '.expo'));
rm(path.join(root, 'node_modules', '.cache'));
try {
  const tmp = require('os').tmpdir();
  for (const name of fs.readdirSync(tmp)) {
    if (name.startsWith('metro-') || name.startsWith('haste-map-')) {
      rm(path.join(tmp, name));
    }
  }
} catch {
  /* ignore */
}
console.log('\nDone. Run: npm start\n');
