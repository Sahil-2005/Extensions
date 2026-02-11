import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const root = process.cwd()

export default defineConfig({
    plugins: [react()],
    define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
    },
    build: {
        emptyOutDir: false, // Do not clear dist, as main build runs first
        outDir: 'dist',
        lib: {
            entry: resolve(root, 'src/content/index.tsx'),
            name: 'ContentScript',
            formats: ['iife'],
            fileName: () => 'src/content/index.js',
        },
        rollupOptions: {
            output: {
                extend: true,
                inlineDynamicImports: true, // Forces dependencies into one file
            }
        }
    }
})
