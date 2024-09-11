module.exports = {
    apps: [
      {
        name: 'nuxt-app',
        script: 'npm',
        args: 'run start',
        env: {
          NODE_ENV: 'production'
        }
      }
    ]
  };
  