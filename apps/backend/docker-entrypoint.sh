#!/bin/sh
# Applies database migrations (waiting for MySQL if needed), seeds an empty database
# (SEED_ON_START defaults to true; set it to false to skip), then starts the API.
set -e

APP_DIR="${APP_DIR:-/app}"
cd "$APP_DIR/packages/db"

attempt=0
echo "Running database migrations…"
until npx prisma migrate deploy; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 20 ]; then
    echo "Database is not reachable after $attempt attempts. Check DATABASE_URL." >&2
    exit 1
  fi
  echo "Waiting for the database ($attempt/20)…"
  sleep 3
done

if [ "${SEED_ON_START:-true}" = "true" ]; then
  echo "Seeding the database (skipped if it already has data)…"
  npx tsx prisma/seed/if-empty.ts
fi

echo "Starting the API…"

cd "$APP_DIR/apps/backend"
exec node dist/main.js
