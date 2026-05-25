/**
 * One-time helper: adds usePremiumTheme + useThemedStyles to screen/component files.
 * Run: node scripts/migrate-themed-styles.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIRS = [
  path.join(ROOT, 'screens'),
  path.join(ROOT, 'components'),
];
const SKIP = ['OldHomeScreen', 'TestHomeScreen', 'TestProductsScreen', 'TestOrdersScreen', 'TestProfileScreen', 'NewHomeScreen', 'OrderHistoryScreen', 'migrate-themed-styles'];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  if (dir.endsWith('.js') && fs.statSync(dir).isFile()) {
    files.push(dir);
    return files;
  }
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory() && name !== 'node_modules') walk(p, files);
    else if (name.endsWith('.js') && !SKIP.some((s) => p.includes(s))) files.push(p);
  }
  return files;
}

function depthToHooks(file) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const parts = rel.split('/').length - 1;
  return '../'.repeat(parts) + 'hooks/';
}

function migrateFile(file) {
  let src = fs.readFileSync(file, 'utf8');
  if (!/from ['"][^'"]*constants\/premiumTheme['"]/.test(src)) {
    return false;
  }
  if (src.includes('usePremiumTheme')) return false;

  const hookPath = depthToHooks(file);
  src = src.replace(/import \{ premium \} from ['"][^'"]*constants\/premiumTheme['"];\n/g, '');
  src = src.replace(/import premium from ['"][^'"]*constants\/premiumTheme['"];\n/g, '');

  const importHooks = `import usePremiumTheme from '${hookPath}usePremiumTheme';\nimport useThemedStyles from '${hookPath}useThemedStyles';\n`;

  const lastImport = src.lastIndexOf('\nimport ');
  const insertAt = src.indexOf('\n', lastImport) + 1;
  if (lastImport === -1) return false;
  src = src.slice(0, insertAt) + importHooks + src.slice(insertAt);

  src = src.replace(
    /const styles = StyleSheet\.create\(\{([\s\S]*?)\}\);/,
    'const createStyles = (premium) => ({\n$1});\n'
  );

  const funcMatch = src.match(/export default function (\w+)/);
  if (!funcMatch) return false;
  const hookLines = `  const premium = usePremiumTheme();\n  const styles = useThemedStyles(createStyles);\n\n`;
  src = src.replace(
    new RegExp(`export default function ${funcMatch[1]}\\([^)]*\\) \\{`),
    (m) => `${m}\n${hookLines}`
  );

  fs.writeFileSync(file, src);
  return true;
}

let count = 0;
for (const dir of DIRS) {
  const files = walk(dir);
  for (const f of files) {
    if (migrateFile(f)) {
      count++;
      console.log('Migrated:', path.relative(ROOT, f));
    }
  }
}
console.log('Done. Migrated', count, 'files.');
