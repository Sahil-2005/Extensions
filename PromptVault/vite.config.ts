import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const root = process.cwd()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(root, 'src/popup/index.html'),
        background: resolve(root, 'src/background/index.ts'),
        content: resolve(root, 'src/content/index.tsx'),
      },
      output: {
        entryFileNames: 'src/[name]/index.js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
})
