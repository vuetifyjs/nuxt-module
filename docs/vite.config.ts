import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'

export default defineConfig({
  optimizeDeps: {
    exclude: [
      'vitepress',
    ],
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
  plugins: [Unocss()],
})
