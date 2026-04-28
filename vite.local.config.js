import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const proxyHeaders = {
  Accept: 'application/json, text/plain, */*',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    proxy: {
      '/steamcardexchange': {
        target: 'https://www.steamcardexchange.net',
        changeOrigin: true,
        headers: proxyHeaders,
        rewrite: () => '/api/request.php?GetBadgePrices_Guest',
      },
      '/steam': {
        target: 'https://store.steampowered.com',
        changeOrigin: true,
        headers: proxyHeaders,
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost')
          const appIds = url.searchParams.get('appids') ?? ''
          return `/api/appdetails?appids=${encodeURIComponent(appIds)}&cc=DE&filters=price_overview`
        },
      },
    },
  },
})
