import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Credentials } from '../../../../utils/types/auth-type';
import { OauthService } from './oauth.service';

@Controller()
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @MessagePattern({ msg: 'oauth_login' })
  async oAuthLogin(@Payload() credentials: Credentials) {
    try {
      return await this.oauthService.authenticate(credentials);
    } catch (error) {
      throw new RpcException({ message: error.response });
    }
  }
}
