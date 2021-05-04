import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
 plugins: [vue()],
 resolve: {
	alias: {
	  '@': require('path').resolve(__dirname, 'src')
	}
  },
 server: {
	port: 7777,
	host: "localhost",
	https: false,
	open: false,
	proxy: {
		"/api": {
			target: "http://localhost:3061",
			changeOrigin: true,
			ws:true,
			logLevel: 'debug'
		}
	}
 }
})
