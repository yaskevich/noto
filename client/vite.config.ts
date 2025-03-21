import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Checker from 'vite-plugin-checker';

import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';

export default defineConfig({
  plugins: [
    vue(), Checker({ typescript: true }),
    Components({
      resolvers: [
        PrimeVueResolver()
      ]
    })],
  server: {
    port: 7777,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    }
  }
})
