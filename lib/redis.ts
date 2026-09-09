import Redis from "ioredis";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

const globalForRedis = globalThis as unknown as {
  redisClient: Redis | null | undefined;
  inMemoryRateLimit: Map<string, { count: number; expiresAt: number }> | undefined;
  inMemoryCache: Map<string, { value: string; expiresAt: number }> | undefined;
};

const inMemoryRateLimit =
  globalForRedis.inMemoryRateLimit ??
  (globalForRedis.inMemoryRateLimit = new Map<string, { count: number; expiresAt: number }>());

const inMemoryCache =
  globalForRedis.inMemoryCache ??
  (globalForRedis.inMemoryCache = new Map<string, { value: string; expiresAt: number }>());

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

function createRedisClient(): Redis {
  const client = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    lazyConnect: true,
    enableOfflineQueue: false,
    connectTimeout: 500,
    retryStrategy: () => null,
  });

  client.on("error", () => {
    // Graceful fallback to in-memory store
  });

  return client;
}

export const redis = globalForRedis.redisClient ?? createRedisClient();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redisClient = redis;
}

function isRedisReady(): boolean {
  return Boolean(redis && redis.status === "ready");
}

export async function getCache<T>(key: string): Promise<T | null> {
  if (isRedisReady()) {
    try {
      const data = await redis.get(key);
      if (data) {
        return JSON.parse(data) as T;
      }
    } catch {
      // Fall through to memory cache
    }
  }

  const memoryItem = inMemoryCache.get(key);
  if (!memoryItem) {
    return null;
  }

  if (memoryItem.expiresAt > 0 && memoryItem.expiresAt <= Date.now()) {
    inMemoryCache.delete(key);
    return null;
  }

  try {
    return JSON.parse(memoryItem.value) as T;
  } catch {
    return memoryItem.value as unknown as T;
  }
}

export async function setCache(
  key: string,
  value: unknown,
  ttlSeconds: number
): Promise<void> {
  const serialized = typeof value === "string" ? value : JSON.stringify(value);

  if (isRedisReady()) {
    try {
      if (ttlSeconds > 0) {
        await redis.set(key, serialized, "EX", ttlSeconds);
      } else {
        await redis.set(key, serialized);
      }
      return;
    } catch {
      // Fall through to memory cache
    }
  }

  const expiresAt = ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : 0;
  inMemoryCache.set(key, { value: serialized, expiresAt });
}

export async function deleteCache(key: string): Promise<void> {
  if (isRedisReady()) {
    try {
      await redis.del(key);
    } catch {
      // Fall through
    }
  }
  inMemoryCache.delete(key);
}

function fallbackRateLimit(
  key: string,
  limit: number,
  windowSec: number
): RateLimitResult {
  const now = Date.now();
  const existing = inMemoryRateLimit.get(key);

  if (!existing || existing.expiresAt <= now) {
    inMemoryRateLimit.set(key, { count: 1, expiresAt: now + windowSec * 1000 });
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

export async function rateLimit(
  ip: string,
  action: string,
  limit: number,
  windowSec: number
): Promise<RateLimitResult> {
  const key = `ratelimit:${action}:${ip}`;

  if (isRedisReady()) {
    try {
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
    } catch {
      // Fall through to in-memory fallback
    }
  }

  return fallbackRateLimit(key, limit, windowSec);
}

export default redis;
