// Usage: META=<file> node texts.mjs <frameId>  -> every text layer of the frame (no sidebar) as rows in reading order, x relative to Main area.
import fs from 'fs';
const j = JSON.parse(fs.readFileSync(process.env.META, 'utf8'));
const lines = j[0].text.split('\n');
const id = process.argv[2];
const un = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const ind = (l) => l.match(/^\s*/)[0].length;
const start = lines.findIndex((l) => l.includes(`id="${id}"`));
if (start < 0) { console.log('not found'); process.exit(1); }
const base = ind(lines[start]);
const stack = []; // {indent,x,y}
const items = [];
let skip = -1;
for (let i = start; i < lines.length; i++) {
  const l = lines[i];
  const m = l.match(/<(\w+) id="([^"]+)" name="([^"]*)" x="([^"]+)" y="([^"]+)" width="([^"]+)" height="([^"]+)"/);
  if (!m) continue;
  const indent = ind(l);
  if (i > start && indent <= base) break;
  while (stack.length && stack[stack.length - 1].indent >= indent) stack.pop();
  const px = stack.length ? stack[stack.length - 1].x : 0;
  const py = stack.length ? stack[stack.length - 1].y : 0;
  const [, type, , name, x, y, w, h] = m;
  const ax = px + +x, ay = py + +y;
  if (skip >= 0) { if (indent > skip) continue; skip = -1; }
  if (name === 'Sidebar') { skip = indent; continue; }
  stack.push({ indent, x: ax, y: ay });
  if (type === 'text') items.push({ x: ax - 320, y: ay, w: +w, h: +h, t: un(name) });
}
items.sort((a, b) => a.y - b.y || a.x - b.x);
const rows = [];
for (const it of items) {
  const r = rows[rows.length - 1];
  if (r && Math.abs(it.y + it.h / 2 - r.cy) < 9) { r.items.push(it); } else rows.push({ cy: it.y + it.h / 2, y: it.y, items: [it] });
}
for (const r of rows) console.log(`${String(Math.round(r.y)).padStart(4)} ` + r.items.sort((a, b) => a.x - b.x).map((i) => `${i.t}‹${Math.round(i.x)}›`).join(' | '));
