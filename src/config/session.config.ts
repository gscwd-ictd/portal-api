import Redis from 'ioredis';
import * as connectRedis from 'connect-redis';
import * as session from 'express-session';
import { INestApplication } from '@nestjs/common';

const RedisStore = connectRedis(session);

const redisClient = new Redis({
  // ! change this port
  port: 6379,

  // ! change this host
  host: 'localhost',
});

export class AppSession {
  public static init(app: INestApplication) {
    app.use(
      session({
        store: new RedisStore({ client: redisClient, disableTTL: true }),
        name: 'ssid_portal',
        // ! change this when porting to production
        secret: 'test',
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          signed: true,
          secure: false,
          maxAge: 8600000000,
        },
      }),
    );
  }
}
