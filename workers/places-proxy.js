// Sniffout Places Proxy - Cloudflare Worker
// Deploy with: wrangler deploy
// Set API key with: wrangler secret put PLACES_API_KEY
// The actual key is NEVER stored in this file or
// the repository.

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request, event))
})

async function handleRequest(request, event) {
  // Block requests not originating from sniffout.app
  const referer = request.headers.get('Referer') || '';
  if (!referer.startsWith('https://sniffout.app')) {
    return new Response('Forbidden', { status: 403 });
  }

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
  const cache = caches.default

  // GET photo requests - cache at Cloudflare edge for 24 hours
  if (request.method === 'GET' && url.pathname.includes('/photos/')) {
    const cached = await cache.match(request)
    if (cached) return cached

    const response = await forwardToGoogle(request, null)
    if (response.ok) {
      const cachedResponse = new Response(response.body, response)
      cachedResponse.headers.set('Cache-Control', 'public, max-age=86400')
      event.waitUntil(cache.put(request, cachedResponse.clone()))
      return cachedResponse
    }
    return response
  }

  // POST searchText - read body once, hash for cache key, pass string to Google
  if (request.method === 'POST' && url.pathname.includes('searchText')) {
    // Read body from original request once - avoids stream consumption issues with clone()
    const bodyText = await request.text()

    const hashBuffer = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(url.pathname + bodyText)
    )
    const hashHex = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    const cacheKey = new Request('https://sniffout-cache.internal/' + hashHex)

    const cached = await cache.match(cacheKey)
    if (cached) return cached

    // Pass bodyText string explicitly - body stream already consumed above
    const response = await forwardToGoogle(request, bodyText)
    if (response.ok) {
      const cachedResponse = new Response(response.body, response)
      cachedResponse.headers.set('Cache-Control', 'public, max-age=86400')
      event.waitUntil(cache.put(cacheKey, cachedResponse.clone()))
      return cachedResponse
    }
    return response
  }

  // All other requests pass through unchanged
  return forwardToGoogle(request, null)
}

// bodyOverride: string to use as POST body (pass null to use request.body stream)
async function forwardToGoogle(request, bodyOverride) {
  const url = new URL(request.url)
  const path = url.pathname.replace('/places-proxy', '')
  const params = url.searchParams

  params.set('key', PLACES_API_KEY)

  const googleUrl = 'https://places.googleapis.com' + path + '?' + params.toString()

  const response = await fetch(googleUrl, {
    method: request.method,
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-FieldMask': request.headers.get('X-Goog-FieldMask') || '*',
      'Referer': 'https://sniffout.app'
    },
    body: request.method === 'POST'
      ? (bodyOverride !== null ? bodyOverride : request.body)
      : undefined
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
