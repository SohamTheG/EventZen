const redis = require('redis');

// The URL comes from your docker-compose.yml environment variable
const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Redis client connected successfully'));

const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};

module.exports = { redisClient, connectRedis };