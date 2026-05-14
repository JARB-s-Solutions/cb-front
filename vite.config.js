import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // Proxy API calls to production backend (Vercel)
    proxy: {
      '/api': {
        target: 'https://controlbarber-backend.vercel.app',
        changeOrigin: true,
        secure: true,
        // Don't rewrite the path - keep /api in the request
        rewrite: (path) => path,
      },
    },
  },
})