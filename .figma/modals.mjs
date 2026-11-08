// Usage: META=<file> node modals.mjs <from-id> <to-id>  -> text of the "Modal"/dialog frame inside each top-level frame between the two sections.
import fs from 'fs';
const L = JSON.parse(fs.readFileSync(process.env.META, 'utf8'))[0].text.split('\n');
const un = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const ind = (l) => l.match(/^\s*/)[0].length;
const re = /<(\w+) id="([^"]+)" name="([^"]*)" x="([^"]+)" y="([^"]+)" width="([^"]+)" height="([^"]+)"/;
let on = false;
for (let i = 0; i < L.length; i++) {
  const m = L[i].match(re);
  if (!m) continue;
  if (m[2] === process.argv[2]) on = true;
  if (m[2] === process.argv[3]) break;
  if (!on || ind(L[i]) !== 4 || m[1] !== 'frame' || !m[3].startsWith('[')) continue;
  console.log(`\n### ${m[2]} ${un(m[3])}`);
  const base = 4;
  let j = i + 1, inModal = -1, mx = 0, my = 0;
  const out = [];
  const stack = [];
  for (; j < L.length; j++) {
    const n = ind(L[j]);
    if (n <= base) break;
    const q = L[j].match(re);
    if (!q) continue;
    while (stack.length && stack[stack.length - 1].n >= n) stack.pop();
    const px = stack.length ? stack[stack.length - 1].x : 0, py = stack.length ? stack[stack.length - 1].y : 0;
    const ax = px + +q[4], ay = py + +q[5];
    stack.push({ n, x: ax, y: ay });
    if (n === base + 2 && q[3] === 'Modal') { inModal = n; }
    else if (inModal >= 0 && n <= inModal) inModal = -1;
    if (inModal >= 0 && q[1] === 'text') out.push({ y: ay, x: ax, t: un(q[3]) });
  }
  out.sort((a, b) => a.y - b.y || a.x - b.x);
  let cy = -1, row = [];
  for (const o of out) { if (Math.abs(o.y - cy) > 6) { if (row.length) console.log(row.join(' | ')); row = []; cy = o.y; } row.push(o.t); }
  if (row.length) console.log(row.join(' | '));
}
