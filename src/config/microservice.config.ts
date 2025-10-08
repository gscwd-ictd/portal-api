import { ClientProvider, ClientsModuleOptionsFactory, Transport } from '@nestjs/microservices';

export class EmployeeDetailsMicroservice implements ClientsModuleOptionsFactory {
  createClientOptions(): ClientProvider | Promise<ClientProvider> {
    return {
      transport: Transport.REDIS,
      options: {
        host: process.env.MS_HRMS_HOST,
        port: parseInt(process.env.MS_HRMS_PORT),
        password: process.env.MS_HRMS_PASSWORD,
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

export class RedisConfigForEmployeeMonitoring implements ClientsModuleOptionsFactory {
  createClientOptions(): ClientProvider | Promise<ClientProvider> {
    return {
      transport: Transport.REDIS,
      options: {
        host: process.env.EMP_MONITORING_MS_HOST,
        port: parseInt(process.env.EMP_MONITORING_MS_PORT),
        password: process.env.EMP_MONITORING_MS_PASSWORD,
        retryAttempts: 5,
        retryDelay: 3000,
        //url: `redis://${process.env.EMP_MONITORING_MS_HOST}:${process.env.EMP_MONITORING_MS_PORT}`,
      },
    };
  }
}

export class RedisConfigForLND implements ClientsModuleOptionsFactory {
  createClientOptions(): ClientProvider | Promise<ClientProvider> {
    return {
      transport: Transport.REDIS,
      options: {
        host: process.env.LND_MS_HOST,
        port: parseInt(process.env.LND_MS_PORT),
        password: process.env.LND_MS_PASS,
        retryAttempts: 5,
        retryDelay: 3000,
        //url: `redis://${process.env.EMP_MONITORING_MS_HOST}:${process.env.EMP_MONITORING_MS_PORT}`,
      },
    };
  }
}
