import redis from '../lib/redis';

class RedisService {
  async set<T>(key: string, value: T, ttlInSeconds?: number): Promise<void> {
    const stringValue = JSON.stringify(value);
    if (ttlInSeconds) {
      await redis.set(key, stringValue, {
        expiration: {
          type: 'EX',
          value: ttlInSeconds,
        },
      });
    } else {
      await redis.set(key, stringValue);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch (err) {
      console.warn(`Failed to parse Redis value for key ${key}:`, err);
      return null;
    }
  }

  async del(key: string): Promise<void> {
    await redis.del(key);
  }

  async delKeys(pattern: string): Promise<void> {
    // For redis clusters
    const keys = await redis.keys(pattern);
    await Promise.all(keys.map((key) => redis.del(key)));
  }

  async exists(key: string): Promise<boolean> {
    const exists = await redis.exists(key);
    return exists === 1;
  }
}

export const redisService = new RedisService();
