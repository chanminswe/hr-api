import Redis from "ioredis";

const redis = new Redis();

redis.on('connect', () => {
	console.log("Connected to Redis!");
});

redis.on('error', (error: any) => {
	console.error("Redis connection Error!", error)
});

export default redis;
