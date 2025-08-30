import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.js'],
      refresh: true,
    }),
    tailwindcss(),
    svelte({
      preprocess: vitePreprocess(),
      compilerOptions: {
        dev: process.env.NODE_ENV === 'development'
      }
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      host: 'localhost',
      port: 5173
    },
    watch: {
      usePolling: true,
      interval: 1000
    }
  },
  define: {
    __VITE_HMR_PROTOCOL__: JSON.stringify('ws'),
    __VITE_HMR_HOSTNAME__: JSON.stringify('localhost'),
    __VITE_HMR_PORT__: JSON.stringify('5173')
  },
  build: {
    rollupOptions: {
      external: []
    }
  }
})
