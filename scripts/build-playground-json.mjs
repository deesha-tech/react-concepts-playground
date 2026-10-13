// Writes /playground.json: the whole series (from shell/episodes.ts) plus, for each live example, its
// challenges, interview question and concepts (from examples/<slug>/src/episode.ts). The learner portal
// reads this file, so an episode shipped here shows up there with no second edit.
//   node scripts/build-playground-json.mjs          write
//   node scripts/build-playground-json.mjs --check  fail if the file is out of date (for CI)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const root = path.resolve(import.meta.dirname, '..');
const check = process.argv.includes('--check');
const anyExample = fs.readdirSync(path.join(root, 'examples')).find((d) => fs.existsSync(path.join(root, 'examples', d, 'node_modules/typescript')));
if (!anyExample) { console.error('Run npm install inside one example first (TypeScript is needed to read the episode files).'); process.exit(1); }
const ts = createRequire(import.meta.url)(path.join(root, 'examples', anyExample, 'node_modules/typescript'));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'playground-json-'));

async function load(file, name) {
  let js = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, verbatimModuleSyntax: false } }).outputText;
  js = js.replace(/from '\.\/(brand|episodes)'/g, "from './$1.mjs'");
  const out = path.join(tmp, `${name}.mjs`);
  fs.writeFileSync(out, js);
  return import(pathToFileURL(out).href);
}

await load(path.join(root, 'shell/brand.ts'), 'brand');
const { EPISODES, CATEGORIES, stackblitzUrl } = await load(path.join(root, 'shell/episodes.ts'), 'episodes');

const episodes = [];
for (const e of EPISODES) {
  const live = Boolean(e.file);
  const entry = { n: e.n, slug: e.slug, title: e.title, category: e.category, live };
  if (live) {
    const { EPISODE } = await load(path.join(root, 'examples', e.slug, 'src/episode.ts'), `ep-${e.n}`);
    Object.assign(entry, {
      pattern: e.pattern,
      type: EPISODE.type,
      summary: EPISODE.summary,
      concepts: EPISODE.concepts,
      stackblitz: stackblitzUrl(e),
      github: `https://github.com/deesha-tech/react-concepts-playground/tree/main/examples/${e.slug}`,
      challenges: EPISODE.challenges ?? (EPISODE.challenge ? [{ level: 'Core', text: EPISODE.challenge }] : []),
      interviewQuestion: EPISODE.interview?.question ?? null,
      videoUrl: EPISODE.videoUrl || null,
    });
  }
  episodes.push(entry);
}
const json = JSON.stringify({ series: 'React Important Concepts, Questions & Patterns', categories: CATEGORIES, episodes }, null, 2) + '\n';
fs.rmSync(tmp, { recursive: true, force: true });

const target = path.join(root, 'playground.json');
if (check) {
  if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== json) { console.error('playground.json is out of date. Run `npm run sync` and commit the result.'); process.exit(1); }
} else {
  fs.writeFileSync(target, json);
  console.log(`wrote playground.json (${episodes.filter((e) => e.live).length} live of ${episodes.length})`);
}
