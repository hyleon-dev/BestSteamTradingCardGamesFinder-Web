import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    proxy: {
      '/steamcardexchange': {
        target: 'https://www.steamcardexchange.net',
        changeOrigin: true,
        headers: {
          Accept: 'application/json, text/plain, */*',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
        rewrite: () => '/api/request.php?GetBadgePrices_Guest',
      },
      '/steam': {
        target: 'https://store.steampowered.com',
        changeOrigin: true,
        headers: {
          Accept: 'application/json, text/plain, */*',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
        rewrite: (path) => path.replace(/^\/steam/, '/api/appdetails'),
      },
    },
  },
})
