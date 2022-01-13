import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Checker from 'vite-plugin-checker'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), Checker({ typescript: true })],
  resolve: {
    alias: {
      '@': require('path').resolve(__dirname, 'src')
    }
  },
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
});
