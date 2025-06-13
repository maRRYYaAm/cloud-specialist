module.exports = {
    apps: [{
      name: 'nodeapp',
      script: 'app.js',
      cwd: '/var/www/nodeapp',
      watch: false,
      autorestart: true,
      instances: 1,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }]
  };
  