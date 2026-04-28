import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const proxyHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'no-store',
}

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'

async function proxyRequest(res, targetUrl) {
  try {
    const response = await fetch(targetUrl, {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'User-Agent': userAgent,
      },
    })
    const body = await response.text()

    res.statusCode = response.status
    res.statusMessage = response.statusText
    res.setHeader('Content-Type', response.headers.get('Content-Type') ?? 'application/json; charset=utf-8')
    Object.entries(proxyHeaders).forEach(([key, value]) => res.setHeader(key, value))
    res.end(body)
  } catch {
    res.statusCode = 502
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    Object.entries(proxyHeaders).forEach(([key, value]) => res.setHeader(key, value))
    res.end(JSON.stringify({error: 'Proxy request failed'}))
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    {
      name: 'local-api-proxy',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (!req.url) {
            next()
            return
          }

          const url = new URL(req.url, 'http://localhost')

          if (url.pathname === '/steamcardexchange') {
            await proxyRequest(res, 'https://www.steamcardexchange.net/api/request.php?GetBadgePrices_Guest')
            return
          }

          if (url.pathname === '/steam') {
            const appIds = url.searchParams.get('appids')
            if (!appIds) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json; charset=utf-8')
              Object.entries(proxyHeaders).forEach(([key, value]) => res.setHeader(key, value))
              res.end(JSON.stringify({error: 'No appids provided'}))
              return
            }

            await proxyRequest(
              res,
              `https://store.steampowered.com/api/appdetails?appids=${appIds}&cc=DE&filters=price_overview`,
            )
            return
          }

          next()
        })
      },
    },
  ],
})
