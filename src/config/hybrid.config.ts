import { INestApplication } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export const startMicroservice = async (app: INestApplication) => {
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.REDIS,
      options: {
        host: process.env.MS_HOST,
        port: parseInt(process.env.MS_PORT),
        password: process.env.MS_PASS,
        retryAttempts: 5,
        retryDelay: 3000,
      },
    },
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();
};

// public static async start(app: INestApplication) {
//   app.connectMicroservice<MicroserviceOptions>(
//     {
//       transport: Transport.REDIS,
//       options: {
//         host: process.env.MS_HOST,
//         port: parseInt(process.env.MS_PORT),
//         password: process.env.MS_PASS,
//         retryAttempts: 5,
//         retryDelay: 3000,
//       },
//     },
//     { inheritAppConfig: true },
//   );

//   await app.startAllMicroservices();
// }
