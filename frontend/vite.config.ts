import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/HOME-PPK/',
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  assetsInclude: ['**/*.svg', '**/*.csv', '**/*.woff', '**/*.woff2'],
  server: {
    port: 5173,
    open: true,
    strictPort: false,
    cors: true,
  },
  preview: {
    port: 4173,
    strictPort: false,
  },
  build: {
    target: ['es2020', 'edge90', 'firefox88', 'chrome90', 'safari14'],
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    reportCompressedSize: true,
  },
  css: {
    postcss: './postcss.config.mjs',
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
    ],
  },
})
