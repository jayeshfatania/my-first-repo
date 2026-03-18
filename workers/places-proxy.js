// Sniffout Places Proxy - Cloudflare Worker
// Deploy with: wrangler deploy
// Set API key with: wrangler secret put PLACES_API_KEY
// The actual key is NEVER stored in this file or
// the repository.

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': 'https://sniffout.app',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Goog-FieldMask',
        'Access-Control-Max-Age': '86400'
      }
    })
  }

  const url = new URL(request.url)
  const path = url.pathname.replace('/places-proxy', '')
  const params = url.searchParams

  params.set('key', PLACES_API_KEY)

  const googleUrl = 'https://places.googleapis.com' + path + '?' + params.toString()

  const response = await fetch(googleUrl, {
    method: request.method,
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-FieldMask': request.headers.get('X-Goog-FieldMask') || '*'
    },
    body: request.method === 'POST' ? request.body : undefined
  })

  const data = await response.json()

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://sniffout.app'
    }
  })
}
