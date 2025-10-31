// This PM2 ecosystem file solves the reliability requirements of Q1.
// It ensures the app restarts on crashes and on system reboot.

module.exports = {
  apps: [
    {
      name: 'converter-api',     // A name for your application
      script: 'converter.js',          // The entry point (our conversion app)
      instances: 1,              // Run a single instance
      
      // Q1 Requirement: Continuously available
      autorestart: true,       // Restart on crash
      watch: false,            // Do not watch files (more stable for prod)
      max_memory_restart: '1G', // Optional: restart if it exceeds 1GB RAM
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};

