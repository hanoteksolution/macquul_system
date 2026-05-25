const fs = require('fs');
const path = require('path');

function walk(dir, acc = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      if (f === 'node_modules' || f.startsWith('.')) continue;
      walk(p, acc);
    } else if (f.endsWith('.js')) acc.push(p);
  }
  return acc;
}

const hits = [];
for (const file of walk('.')) {
  const src = fs.readFileSync(file, 'utf8');
  if (!/\bpremium\b/.test(src)) continue;
  // Module-level const/object literals (before main component body)
  const idxExport = src.search(/export default function/);
  if (idxExport < 0) continue;
  const top = src.slice(0, idxExport);
  const importEnd = top.lastIndexOf('\nimport ');
  const bodyStart = importEnd >= 0 ? importEnd : 0;
  const moduleBody = top.slice(bodyStart);
  if (/\bpremium\./.test(moduleBody) && !/lightPremium|premiumTheme|function\s+\w+\(\s*premium/.test(moduleBody)) {
    hits.push(file.replace(/\\/g, '/'));
  }
}
console.log(hits.join('\n') || 'none');
