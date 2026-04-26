// Sadə in-memory rate limiter
// Production üçün Upstash Redis tövsiyə olunur
const buckets = new Map();
const WINDOW_MS = 60 * 1000; // 1 dəqiqə
const MAX_REQUESTS = 5;       // 1 dəqiqədə maksimum 5 istek

export function rateLimit(key, max = MAX_REQUESTS, windowMs = WINDOW_MS) {
  const now = Date.now();
  const bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs };

  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + windowMs;
  }

  bucket.count++;
  buckets.set(key, bucket);

  // Cleanup köhnə bucket-ləri (memory leak qarşısı)
  if (buckets.size > 1000) {
    for (const [k, v] of buckets.entries()) {
      if (v.resetAt < now) buckets.delete(k);
    }
  }

  return {
    allowed: bucket.count <= max,
    remaining: Math.max(0, max - bucket.count),
    resetAt: bucket.resetAt,
  };
}

export function getClientIp(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}
