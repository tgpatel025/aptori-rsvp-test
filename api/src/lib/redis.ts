import { createClient } from 'redis';

// For GCP redis cluster this redis package won't work, use ioredis.
const client = createClient();

client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

client.connect();

export default client;
