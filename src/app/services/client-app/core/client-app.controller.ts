import { Controller, Post } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateClientAppDto } from '../data/client-app.dto';
import { ClientAppService } from './client-app.service';

@Controller('client-apps')
export class ClientAppController {
  constructor(private readonly clientAppService: ClientAppService) { }

  @Post()
  @MessagePattern({ msg: 'create_app' })
  async createApp(@Payload() app: CreateClientAppDto) {
    try {
      return await this.clientAppService.createApp(app);
    }
    catch (error) {
      throw new RpcException(error.message);
    }

  }
}
