// PM2 process file for running the API without Docker (e.g. a CloudPanel Node.js site).
//   pm2 start ecosystem.config.cjs     # first time
//   pm2 reload ecosystem.config.cjs    # after a deploy (scripts/deploy.sh does this)
// Configuration comes from the root .env (loaded by apps/backend/src/config/env.ts).
module.exports = {
  apps: [
    {
      name: 'app-api',
      cwd: './apps/backend',
      script: 'dist/main.js',
      node_args: '--enable-source-maps',
      env: { NODE_ENV: 'production' },
      instances: 1, // Socket.IO rooms live in memory: keep a single instance
      autorestart: true,
      max_memory_restart: '600M',
      time: true,
    },
  ],
};
