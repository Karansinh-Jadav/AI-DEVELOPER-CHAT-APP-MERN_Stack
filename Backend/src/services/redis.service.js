import Redis from "ioredis";


const redisClient = new Redis({
    host: "ink-gyroscopic-apparent-44824.db.redis.io",
    port: 13673,
    password: "qVWc82CkbnDNBF7iaEuwxErLppRQZP6M",
    
});
console.log(process.env.REDIS_HOST);
console.log(process.env.REDIS_PORT);
console.log(process.env.REDIS_PASSWORD);


 redisClient.on("connect", () => {
    console.log("Redis connected");
});

 redisClient.on("error", (err) => {
    console.error("Redis error:", err);
});

export default redisClient;

