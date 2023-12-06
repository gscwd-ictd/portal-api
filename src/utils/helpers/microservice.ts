import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MessagePattern } from '../types/microservice-type';

export abstract class MicroserviceHelper {
  constructor(private readonly client: ClientProxy) {}

  async sendMessage(pattern: MessagePattern, payload: any) {
    try {
      return await lastValueFrom(this.client.send(pattern, payload));
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
