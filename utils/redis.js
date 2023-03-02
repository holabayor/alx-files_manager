const redis = require('redis');
const { promisify } = require('util');

const RedisClient = class {
  constructor() {
    this.client = redis.createClient();
    this.isConnected = true;
    this.client.on('error', (err) => {
      console.error('Failed to connect: ', err);
      this.isConnected = false;
    });
    this.client.on('connect', () => {
      this.isConnected = true;
    });
  }

  isAlive() {
    return this.isConnected;
  }

  async get(key) {
    const value = promisify(this.client.GET).bind(this.client)(key);
    return value;
  }

  async set(key, value, duration) {
    await promisify(this.client.SETEX).bind(this.client)(key, duration, value);
  }

  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
};

const redisClient = new RedisClient();
export default redisClient;
