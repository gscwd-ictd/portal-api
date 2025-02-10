import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Credentials } from '../../../../utils/types/auth-type';
import { OauthService } from './oauth.service';
import { MsExceptionFilter } from '../../../../utils/filters/rpc-exception.filter';

@Controller()
export class OauthController {
  constructor(private readonly oauthService: OauthService) { }

  @UseFilters(new MsExceptionFilter())
  @MessagePattern({ msg: 'oauth_login' })
  async oAuthLogin(@Payload() credentials: Credentials) {
    try {
      return await this.oauthService.authenticate(credentials);
    } catch (error) {
      throw new RpcException({ message: error.response });
    }
  }
}
