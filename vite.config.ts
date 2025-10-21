import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const base = mode === 'production'
      ? (env.VITE_BASE || '/map-app/')
      : '/'

  return {
    base,
    build: {
      outDir: 'docs',
      // Добавляем обработку 404 страниц для SPA
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    },
    plugins: [
      vue(),
      vueDevTools(),
      vuetify({ autoImport: true }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})