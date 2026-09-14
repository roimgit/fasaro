export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

interface RateLimitEntry {
  count: number;
  expiresAt: number;
}

const globalForRateLimit = globalThis as unknown as {
  inMemoryRateLimit: Map<string, RateLimitEntry> | undefined;
  cleanupIntervalStarted: boolean | undefined;
};

const rateLimitStore =
  globalForRateLimit.inMemoryRateLimit ??
  (globalForRateLimit.inMemoryRateLimit = new Map<string, RateLimitEntry>());

// Start periodic cleanup once to keep memory lean
if (!globalForRateLimit.cleanupIntervalStarted && typeof setInterval !== "undefined") {
  globalForRateLimit.cleanupIntervalStarted = true;
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.expiresAt <= now) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);

  if (typeof timer.unref === "function") {
    timer.unref();
  }
}

/**
 * In-memory sliding rate limiter per identifier/action.
 * Eliminates the need for an external Redis server while protecting endpoints against spam.
 */
export async function rateLimit(
  identifier: string,
  action: string,
  limit: number,
  windowSec: number
): Promise<RateLimitResult> {
  const key = `ratelimit:${action}:${identifier}`;
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing || existing.expiresAt <= now) {
    rateLimitStore.set(key, { count: 1, expiresAt: now + windowSec * 1000 });
    return {
      allowed: true,
      remaining: Math.max(0, limit - 1),
    };
  }

  existing.count += 1;
  if (existing.count > limit) {
    return {
      allowed: false,
      remaining: 0,
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, limit - existing.count),
  };
}
