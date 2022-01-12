// vite.config.js
const { resolve } = require('path');
const { defineConfig } = require('vite');

module.exports = defineConfig({
  publicDir: 'example/public',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'example/index.html'),
      },
    },
  },
});
