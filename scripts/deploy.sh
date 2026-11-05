#!/usr/bin/env bash
# Deploys the API on a server without Docker (CloudPanel Node.js site + PM2).
# Run from the repository root as the site user:  bash scripts/deploy.sh
#   1. pulls the latest code (skip with NO_PULL=1)
#   2. installs dependencies and builds the API (db:generate → @app/db → @app/backend)
#   3. applies database migrations
#   4. seeds the database only if it is empty and SEED_ON_START=true in .env
#   5. starts or reloads the API with PM2
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "Missing .env in $(pwd). Copy .env.example to .env and fill it in first." >&2
  exit 1
fi

if ! command -v pm2 >/dev/null 2>&1; then
  echo "PM2 is not installed. Run: npm install -g pm2" >&2
  exit 1
fi

if [ "${NO_PULL:-0}" != "1" ] && [ -d .git ]; then
  echo "→ Pulling latest code…"
  git pull --ff-only
fi

echo "→ Installing dependencies…"
npm ci --no-audit --no-fund

echo "→ Building the API…"
npx turbo run build --filter=@app/backend

echo "→ Applying database migrations…"
npm run db:deploy

if grep -Eq '^SEED_ON_START=true' .env; then
  echo "→ Seeding (skipped if the database already has data)…"
  npm run db:seed:if-empty
fi

echo "→ Starting the API…"
if pm2 describe app-api >/dev/null 2>&1; then
  pm2 reload ecosystem.config.cjs --update-env
else
  pm2 start ecosystem.config.cjs
fi
pm2 save

echo "✓ Deployed. Logs: pm2 logs app-api"
