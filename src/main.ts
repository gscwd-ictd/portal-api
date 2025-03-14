import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { pipe } from 'rxjs';
import { AppModule } from './app.module';
import { startMicroservice } from './config/hybrid.config';
// import { AppMicroservice } from './config/hybrid.config';
import { AppSession } from './config/session.config';
import helmet from 'helmet';

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
      'http://172.20.110.60:3001',
      'http://172.20.110.60:3002',
      'http://172.20.110.60:3003',
      'http://172.20.110.60:3004',
      'http://172.20.110.60:3005',
      'http://172.20.110.60:3006',
      'http://172.20.110.60:3010',
      'http://172.20.10.60:3002',
      'http://172.20.10.58:3000',
      'http://172.20.10.63:3000',
      'http://172.20.10.63:3000',
    ],
    credentials: true,
  });

  // initialize microservice to turn this app into hybrid
  startMicroservice(app);

  // initialize session
  AppSession.init(app);

  //app.useGlobalPipes(new ValidationPipe());
  //app.setGlobalPrefix('api');

  app.use(
    helmet({
      xContentTypeOptions: true,
      xXssProtection: true,
      hsts: {
        maxAge: 31536000, // 1 year (in seconds)
        includeSubDomains: true, // Apply to all subdomains
        preload: true, // Allow browser preloading
      },
    }),
  );

  app.use((req: any, res: { setHeader: (arg0: string, arg1: string) => void }, next: () => void) => {
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
  
  await app.listen(process.env.APP_PORT, () =>
    new Logger('NestApplication').log(`Employee Portal running on port ${process.env.APP_PORT}`),
  );
}
bootstrap();
