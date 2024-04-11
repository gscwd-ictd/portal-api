import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { pipe } from 'rxjs';
import { AppModule } from './app.module';
import { startMicroservice } from './config/hybrid.config';
// import { AppMicroservice } from './config/hybrid.config';
import { AppSession } from './config/session.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // allow cors from specified origins
  app.enableCors({
    origin: [
      'http://172.20.10.59:3001',
      'http://172.20.10.59:3002',
      'http://172.20.10.59:3003',
      'http://172.20.10.59:3004',
      'http://172.20.10.59:3005',
      'http://172.20.10.59:3006',
      'http://172.20.10.57:3000',
      'http://172.20.10.57:3010',
      'http://172.20.10.57:3109',
      'http://172.20.10.56:3010',
      'http://172.20.10.56:3000',
      'http://localhost:3000',
      'http://172.20.10.60:3102',
      'http://172.20.110.45:3001',
      'http://172.20.110.45:3002',
      'http://172.20.110.45:3003',
      'http://172.20.110.45:3004',
      'http://172.20.110.45:3005',
      'http://172.20.110.45:3006',
      'http://172.20.110.45:3010',
      'http://172.20.10.60:3002',
      'http://172.20.10.58:3000',
    ],
    credentials: true,
  });

  // initialize microservice to turn this app into hybrid
  startMicroservice(app);

  // initialize session
  AppSession.init(app);

  //app.useGlobalPipes(new ValidationPipe());
  //app.setGlobalPrefix('api');

  await app.listen(process.env.APP_PORT, () =>
    new Logger('NestApplication').log(`Employee Portal running on port ${process.env.APP_PORT}`),
  );
}
bootstrap();
