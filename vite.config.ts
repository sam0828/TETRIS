import { defineConfig } from 'vite'

export default defineConfig({
  base: '/TETRIS/',
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
  server: {
    port: 5173,
    open: true,
  },
})
