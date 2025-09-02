import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './resources/js'),
      '@Components': path.resolve(__dirname, './resources/js/Components'),
      '@GuestComponents': path.resolve(__dirname, './resources/js/Components/Guest'),
      '@Modules': path.resolve(__dirname, './resources/js/Modules'),
      '@Const': path.resolve(__dirname, './resources/js/Const'),
      '@Enums': path.resolve(__dirname, './resources/js/Enums'),
      '@Pages': path.resolve(__dirname, './resources/js/Pages'),
      '@Stores': path.resolve(__dirname, './resources/js/Stores'),
      '@Utils': path.resolve(__dirname, './resources/js/Utils'),
      '@Types': path.resolve(__dirname, './resources/js/Types'),
      '@Layouts': path.resolve(__dirname, './resources/js/Layouts')
    }
  },
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
