import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
});

const MAX_REQUESTS = 5;
const TIME_WINDOW_SECONDS = 60;

export async function rateLimit(identifier: string): Promise<boolean> {
    const key = `rate-limit:${identifier}`;
    const now = Date.now();

    try {
        const [requestCount, ] = await redis.multi()
        .incr(key)
        .expire(key, TIME_WINDOW_SECONDS)
        .exec();

        const count = requestCount;

        if (count > MAX_REQUESTS) {
            console.warn(`Rate-limited: ${identifier} has made ${count} requests.`);
            return false; 
        }

        return true;
    } catch (error) {
        console.error('Redis error:', error);
        return false;
    }
}