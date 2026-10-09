// Copies /shell (logo, brand config, menu, course promos, timeline) into every example's src/shell/.
// Each example must be self-contained so StackBlitz can open its folder on its own.
//   node scripts/sync-shell.mjs          copy
//   node scripts/sync-shell.mjs --check  fail if any example is out of date (for CI)
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const shell = path.join(root, 'shell');
const examples = path.join(root, 'examples');
const check = process.argv.includes('--check');
const banner = (ext) => (ext === '.css' ? '/* Copied from /shell by scripts/sync-shell.mjs. Edit the original there. */\n' : '// Copied from /shell by scripts/sync-shell.mjs. Edit the original there.\n');

let stale = 0;
for (const ex of fs.readdirSync(examples)) {
  const dest = path.join(examples, ex, 'src', 'shell');
  if (!fs.existsSync(path.join(examples, ex, 'package.json'))) continue;
  fs.mkdirSync(dest, { recursive: true });
  for (const file of fs.readdirSync(shell)) {
    const ext = path.extname(file);
    const src = fs.readFileSync(path.join(shell, file));
    const out = ['.ts', '.tsx', '.css'].includes(ext) ? Buffer.from(banner(ext) + src.toString()) : src;
    const target = path.join(dest, file);
    const same = fs.existsSync(target) && fs.readFileSync(target).equals(out);
    if (same) continue;
    if (check) { console.error(`out of date: examples/${ex}/src/shell/${file}`); stale++; }
    else fs.writeFileSync(target, out);
  }
  if (!check) console.log(`synced examples/${ex}`);
}
if (check && stale) { console.error('Run `npm run sync` and commit the result.'); process.exit(1); }
