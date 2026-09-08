import Redis from "ioredis";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

const globalForRedis = globalThis as unknown as {
  redisClient: Redis | undefined;
};

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redis =
  globalForRedis.redisClient ??
  new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redisClient = redis;
}

export async function getCache<T>(key: string): Promise<T | null> {
  const data = await redis.get(key);
  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data) as T;
  } catch {
    return data as unknown as T;
  }
}

export async function setCache(
  key: string,
  value: unknown,
  ttlSeconds: number
): Promise<void> {
  const serialized = typeof value === "string" ? value : JSON.stringify(value);
  if (ttlSeconds > 0) {
    await redis.set(key, serialized, "EX", ttlSeconds);
    return;
  }

  await redis.set(key, serialized);
}

export async function rateLimit(
  ip: string,
  action: string,
  limit: number,
  windowSec: number
): Promise<RateLimitResult> {
  const key = `ratelimit:${action}:${ip}`;
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, windowSec);
  }

  if (current > limit) {
    return {
      allowed: false,
      remaining: 0,
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, limit - current),
  };
}

export default redis;
