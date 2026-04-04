// Sniffout Places Proxy - Cloudflare Worker
// Deploy via Cloudflare dashboard (Workers & Pages -> places-proxy -> Edit Code)
// Set API key with: wrangler secret put PLACES_API_KEY
// The actual key is NEVER stored in this file or the repository.
// Requires KV namespace "SNIFFOUT_KV" bound as env.SNIFFOUT_KV

// Circuit breaker configuration
const CIRCUIT_BREAKER = {
  MAX_REQUESTS_PER_HOUR: 500,
  ALERT_EMAIL: 'hello@sniffout.app',
  COOLDOWN_MINUTES: 60
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // --- ADMIN ENDPOINTS (no referer check - accessed directly by owner) ---

    // Admin stats endpoint - check current usage
    if (url.pathname === '/admin/stats') {
      const now = new Date();
      const hourKey = 'requests:' + now.getUTCFullYear() + '-' +
        String(now.getUTCMonth() + 1).padStart(2, '0') + '-' +
        String(now.getUTCDate()).padStart(2, '0') + '-' +
        String(now.getUTCHours()).padStart(2, '0');
      const dailyKey = 'daily:' + now.getUTCFullYear() + '-' +
        String(now.getUTCMonth() + 1).padStart(2, '0') + '-' +
        String(now.getUTCDate()).padStart(2, '0');

      const hourlyCount = await env.SNIFFOUT_KV.get(hourKey) || '0';
      const dailyCount = await env.SNIFFOUT_KV.get(dailyKey) || '0';

      // Get last 7 days of daily counts
      const dailyHistory = {};
      for (let i = 0; i < 7; i++) {
        const d = new Date(now - i * 86400000);
        const key = 'daily:' + d.getUTCFullYear() + '-' +
          String(d.getUTCMonth() + 1).padStart(2, '0') + '-' +
          String(d.getUTCDate()).padStart(2, '0');
        dailyHistory[key.replace('daily:', '')] = parseInt(await env.SNIFFOUT_KV.get(key) || '0');
      }

      return new Response(JSON.stringify({
        currentHour: parseInt(hourlyCount),
        today: parseInt(dailyCount),
        threshold: CIRCUIT_BREAKER.MAX_REQUESTS_PER_HOUR,
        percentOfThreshold: Math.round((parseInt(hourlyCount) / CIRCUIT_BREAKER.MAX_REQUESTS_PER_HOUR) * 100),
        last7Days: dailyHistory,
        timestamp: now.toISOString()
      }, null, 2), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Admin reset endpoint - manually reset circuit breaker
    if (url.pathname === '/admin/reset' && url.searchParams.get('key') === 'SNIFFOUT_ADMIN_2026') {
      const now = new Date();
      const hourKey = 'requests:' + now.getUTCFullYear() + '-' +
        String(now.getUTCMonth() + 1).padStart(2, '0') + '-' +
        String(now.getUTCDate()).padStart(2, '0') + '-' +
        String(now.getUTCHours()).padStart(2, '0');
      const tripKey = 'tripped:' + hourKey;
      await env.SNIFFOUT_KV.delete(tripKey);

      return new Response(JSON.stringify({
        message: 'Circuit breaker reset',
        timestamp: now.toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // --- REFERER CHECK (skipped for /admin/ routes) ---
    if (!url.pathname.startsWith('/admin/')) {
      const referer = request.headers.get('Referer') || '';
      if (!referer.startsWith('https://sniffout.app')) {
        return new Response('Forbidden', { status: 403 });
      }
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
      });
    }

    // --- CIRCUIT BREAKER CHECK ---
    const now = new Date();
    const hourKey = 'requests:' + now.getUTCFullYear() + '-' +
      String(now.getUTCMonth() + 1).padStart(2, '0') + '-' +
      String(now.getUTCDate()).padStart(2, '0') + '-' +
      String(now.getUTCHours()).padStart(2, '0');
    const dailyKey = 'daily:' + now.getUTCFullYear() + '-' +
      String(now.getUTCMonth() + 1).padStart(2, '0') + '-' +
      String(now.getUTCDate()).padStart(2, '0');
    const tripKey = 'tripped:' + hourKey;

    // Check if breaker is already tripped
    const isTripped = await env.SNIFFOUT_KV.get(tripKey);
    if (isTripped) {
      return new Response(JSON.stringify({
        error: 'Service temporarily paused',
        message: 'Sniffout is taking a short break. Please try again in a few minutes.',
        circuitBreaker: true
      }), {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Retry-After': '3600'
        }
      });
    }

    // Increment hourly counter (TTL 2 hours so it expires after the window closes)
    const currentCount = parseInt(await env.SNIFFOUT_KV.get(hourKey) || '0');
    const newCount = currentCount + 1;
    await env.SNIFFOUT_KV.put(hourKey, String(newCount), { expirationTtl: 7200 });

    // Increment daily counter (TTL 48 hours)
    const dailyCount = parseInt(await env.SNIFFOUT_KV.get(dailyKey) || '0');
    await env.SNIFFOUT_KV.put(dailyKey, String(dailyCount + 1), { expirationTtl: 172800 });

    // Check threshold - trip the breaker if exceeded
    if (newCount > CIRCUIT_BREAKER.MAX_REQUESTS_PER_HOUR) {
      await env.SNIFFOUT_KV.put(tripKey, 'true', { expirationTtl: CIRCUIT_BREAKER.COOLDOWN_MINUTES * 60 });

      // Log the trip (keep for 7 days)
      await env.SNIFFOUT_KV.put('last-trip:' + hourKey, JSON.stringify({
        trippedAt: now.toISOString(),
        requestCount: newCount,
        dailyTotal: dailyCount + 1
      }), { expirationTtl: 604800 });

      // Send alert email via MailChannels
      try {
        await fetch('https://api.mailchannels.net/tx/v1/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personalizations: [{
              to: [{ email: CIRCUIT_BREAKER.ALERT_EMAIL }]
            }],
            from: { email: 'alerts@sniffout.app', name: 'Sniffout Circuit Breaker' },
            subject: 'ALERT: Sniffout API circuit breaker tripped',
            content: [{
              type: 'text/plain',
              value: 'The Sniffout Places API circuit breaker has tripped.\n\n' +
                'Time: ' + now.toISOString() + '\n' +
                'Hourly requests: ' + newCount + ' (threshold: ' + CIRCUIT_BREAKER.MAX_REQUESTS_PER_HOUR + ')\n' +
                'Daily total so far: ' + (dailyCount + 1) + '\n\n' +
                'The breaker will auto-reset in ' + CIRCUIT_BREAKER.COOLDOWN_MINUTES + ' minutes.\n' +
                'To manually reset, visit: https://places-proxy.sniffout.app/admin/reset?key=SNIFFOUT_ADMIN_2026\n\n' +
                'Check Google Cloud Console for billing: https://console.cloud.google.com/apis/dashboard?project=sniffout-fe976'
            }]
          })
        });
      } catch (emailErr) {
        // Email failure must not block the circuit breaker
        console.error('Alert email failed:', emailErr);
      }

      return new Response(JSON.stringify({
        error: 'Service temporarily paused',
        message: 'Sniffout is taking a short break. Please try again in a few minutes.',
        circuitBreaker: true
      }), {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Retry-After': '3600'
        }
      });
    }

    // --- EXISTING GOOGLE PLACES API FORWARDING (unchanged) ---
    const cache = caches.default;

    // GET photo requests - cache at Cloudflare edge for 24 hours
    if (request.method === 'GET' && url.pathname.includes('/photos/')) {
      const cached = await cache.match(request);
      if (cached) return cached;

      const response = await forwardToGoogle(request, null, env);
      if (response.ok) {
        const cachedResponse = new Response(response.body, response);
        cachedResponse.headers.set('Cache-Control', 'public, max-age=86400');
        ctx.waitUntil(cache.put(request, cachedResponse.clone()));
        return cachedResponse;
      }
      return response;
    }

    // POST searchText - read body once, hash for cache key, pass string to Google
    if (request.method === 'POST' && url.pathname.includes('searchText')) {
      // Read body from original request once - avoids stream consumption issues with clone()
      const bodyText = await request.text();

      const hashBuffer = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(url.pathname + bodyText)
      );
      const hashHex = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      const cacheKey = new Request('https://sniffout-cache.internal/' + hashHex);

      const cached = await cache.match(cacheKey);
      if (cached) return cached;

      // Pass bodyText string explicitly - body stream already consumed above
      const response = await forwardToGoogle(request, bodyText, env);
      if (response.ok) {
        const cachedResponse = new Response(response.body, response);
        cachedResponse.headers.set('Cache-Control', 'public, max-age=86400');
        ctx.waitUntil(cache.put(cacheKey, cachedResponse.clone()));
        return cachedResponse;
      }
      return response;
    }

    // All other requests pass through unchanged
    return forwardToGoogle(request, null, env);
  }
};

// bodyOverride: string to use as POST body (pass null to use request.body stream)
async function forwardToGoogle(request, bodyOverride, env) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/places-proxy', '');
  const params = url.searchParams;

  params.set('key', env.PLACES_API_KEY);

  const googleUrl = 'https://places.googleapis.com' + path + '?' + params.toString();

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
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://sniffout.app'
    }
  });
}
