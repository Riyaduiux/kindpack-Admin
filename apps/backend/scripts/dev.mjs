// Dev runner: `nest build --watch` + restart `node dist/main.js` after every successful compile.
// (`nest start --watch` runs the app through a shell, which breaks on paths with spaces or parentheses.)
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const nestBin = join(root, 'node_modules', '.bin', 'nest');
let app = null;

function startApp() {
  if (app) {
    app.removeAllListeners('exit');
    app.kill('SIGTERM');
  }
  app = spawn(process.execPath, ['--enable-source-maps', join(root, 'dist', 'main.js')], { cwd: root, stdio: 'inherit', env: process.env });
  app.on('exit', (code) => code && console.log(`\n[dev] API exited with code ${code}. Waiting for changes…`));
}

const { existsSync } = await import('node:fs');
const nest = spawn(existsSync(nestBin) ? nestBin : join(root, '..', '..', 'node_modules', '.bin', 'nest'), ['build', '--watch'], { cwd: root, env: process.env });
nest.stdout.on('data', (buf) => {
  const text = buf.toString();
  process.stdout.write(text);
  if (/Found 0 errors/.test(text)) startApp();
});
nest.stderr.pipe(process.stderr);

const stop = () => {
  app?.kill('SIGTERM');
  nest.kill('SIGTERM');
  process.exit(0);
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
