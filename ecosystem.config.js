// created by Yivani yivani.dev
module.exports = {
  apps: [
    {
      name: 'ViewGram',
      script: 'node_modules/.bin/next',
      args: 'start -p 3002',
      cwd: '/var/www/ViewGram',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
      error_file: '/var/www/ViewGram/logs/pm2-error.log',
      out_file: '/var/www/ViewGram/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1G',
    },
  ],
};

