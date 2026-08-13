/**
 * Minimal in-memory rate limiter for sensitive, unauthenticated actions
 * (login, registration, password reset, contact form) that had no abuse
 * protection at all — anyone could script unlimited requests against them.
 *
 * Deliberately dependency-free (fixed-window counter, keyed by IP + action
 * name) so it works with zero infrastructure changes. Known limitation:
 * this state is per server process, so it resets on redeploy/restart and
 * does NOT share state across multiple instances (e.g. serverless functions,
 * a multi-replica deployment). That's an acceptable tradeoff for a single
 * always-on server; for a multi-instance production deployment, swap this
 * for a shared store (Redis / Upstash Ratelimit) behind the same
 * `checkRateLimit` signature — call sites don't need to change.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Periodically drop expired buckets so this map can't grow unbounded over
// the life of the process.
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
let lastCleanup = Date.now();
function cleanupIfDue() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}

export function clientIpFromHeaders(getHeader: (name: string) => string | null): string {
  // Standard proxy headers, checked in order of how most hosting platforms
  // (Vercel, nginx, etc.) actually set them. Falls back to a constant key
  // so rate limiting still applies (shared across all clients) rather than
  // silently doing nothing if no proxy header is present.
  const forwardedFor = getHeader("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  const realIp = getHeader("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

/**
 * @param key Unique identifier for this limit — typically `${action}:${ip}`.
 * @param limit Max requests allowed per window.
 * @param windowMs Window length in milliseconds.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  cleanupIfDue();

  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (existing.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count += 1;
  return { allowed: true };
}
