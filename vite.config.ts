import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/upbit': {
        target: 'https://api.upbit.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/upbit/, '/v1/candles/days'),
      },
      '/api/feargreed': {
        target: 'https://api.alternative.me',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/feargreed/, '/fng/'),
      },
    },
  },
})
