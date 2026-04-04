# Sniffout Circuit Breaker

## What it does
Monitors Google Places API calls through the Cloudflare Worker proxy. If requests exceed 500 per hour, the breaker trips and stops forwarding requests to Google. An alert email is sent to hello@sniffout.app. The breaker auto-resets after 60 minutes.

## Endpoints

### Check current usage
GET https://places-proxy.sniffout.app/admin/stats

Returns: current hour count, daily count, last 7 days history, percentage of threshold.

### Manual reset
GET https://places-proxy.sniffout.app/admin/reset?key=SNIFFOUT_ADMIN_2026

Resets the circuit breaker for the current hour.

## Setup required (one-time)
1. Create Cloudflare KV namespace "SNIFFOUT_KV"
2. Bind it to the places-proxy Worker as variable SNIFFOUT_KV
3. Deploy the updated Worker code via Cloudflare dashboard

## Thresholds
- Max requests per hour: 500
- Auto-reset: 60 minutes after trip
- Alert email: hello@sniffout.app

## What happens when the breaker trips
- Google Places API calls return 503 with a friendly JSON message
- The app's Nearby tab will show a "service temporarily unavailable" state
- An email alert is sent
- The breaker auto-resets after 60 minutes
- Manual reset available via the admin endpoint

## Migration note - module syntax
The Worker was migrated from the legacy addEventListener syntax to ES module syntax
(export default { async fetch(request, env, ctx) }). This is required for KV access via env.
The PLACES_API_KEY secret is now accessed as env.PLACES_API_KEY (not a global).
If re-deploying via wrangler, ensure wrangler.toml has compatibility_flags = ["nodejs_compat"]
or the Worker is set to ES module format.
