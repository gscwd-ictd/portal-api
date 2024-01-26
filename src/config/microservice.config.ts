import { ClientProvider, ClientsModuleOptionsFactory, Transport } from '@nestjs/microservices';

export class EmployeeDetailsMicroservice implements ClientsModuleOptionsFactory {
  createClientOptions(): ClientProvider | Promise<ClientProvider> {
    return {
      transport: Transport.REDIS,
      options: {
        host: process.env.MS_HRMS_HOST,
        port: parseInt(process.env.MS_HRMS_PORT),
        retryAttempts: 5,
        retryDelay: 3000,
      },
    };
  }
}

export class SmsMicroservice implements ClientsModuleOptionsFactory {
  createClientOptions(): ClientProvider | Promise<ClientProvider> {
    return {
      transport: Transport.REDIS,
      options: {
        host: process.env.MS_SMS_HOST,
        port: parseInt(process.env.MS_SMS_PORT),
        password: process.env.MS_SMS_PASS,
        retryAttempts: 5,
        retryDelay: 3000,
      },
    };
  }
}
