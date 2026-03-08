import { Redis } from 'ioredis';

// Options ko export kar rahe hain taaki BullMQ isko direct use kar sake
export const redisOptions = {
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null, 
};

// Ye connection hum API ya doosre kaamo ke liye rakh sakte hain
export const redisConnection = new Redis(redisOptions);

redisConnection.on('connect', () => {
  console.log('📦 Redis Connected Successfully!');
});

redisConnection.on('error', (err) => {
  console.error('❌ Redis Connection Error:', err);
});