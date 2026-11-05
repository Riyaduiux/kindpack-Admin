// Usage: node outline.mjs <frameId> [maxDepth]  -> compact outline of a Figma frame (skips Sidebar), text layers show their content.
import fs from 'fs';
const SRC = process.env.META;
const j = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const lines = j[0].text.split('\n');
const id = process.argv[2];
const maxDepth = +(process.argv[3] ?? 6);
const un = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
let start = lines.findIndex((l) => l.includes(`id="${id}"`));
if (start < 0) { console.log('not found'); process.exit(1); }
const ind = (l) => l.match(/^\s*/)[0].length;
const base = ind(lines[start]);
let skipUntil = -1;
const out = [];
for (let i = start; i < lines.length; i++) {
  const l = lines[i];
  if (i > start && ind(l) <= base) break;
  const m = l.match(/<(\w+) id="([^"]+)" name="([^"]*)" x="([^"]+)" y="([^"]+)" width="([^"]+)" height="([^"]+)"/);
  if (!m) continue;
  const d = (ind(l) - base) / 2;
  if (d > maxDepth) continue;
  const [, type, nid, name, x, y, w, h] = m;
  if (name === 'Sidebar' && d === 1) { skipUntil = ind(l); continue; }
  if (skipUntil >= 0) { if (ind(l) > skipUntil) continue; skipUntil = -1; }
  if (type === 'ellipse' || type === 'vector' || type === 'line' || type==='rectangle' && d>2) continue;
  const r = (v) => Math.round(+v);
  const label = type === 'text' ? `"${un(name)}"` : un(name);
  out.push(`${'  '.repeat(d)}${type === 'text' ? 'T' : type[0]} ${label} @${r(x)},${r(y)} ${r(w)}x${r(h)}`);
}
console.log(out.join('\n'));
