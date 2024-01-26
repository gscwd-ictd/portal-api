import { Injectable } from '@nestjs/common';
import { UserService } from '../../../api/user/core/user.service';
import { Credentials } from '../../../../utils/types/auth-type';
import { ClientAppService } from '../../client-app/core/client-app.service';
import { TokenService } from '../misc/token.service';

@Injectable()
export class OauthService {
  constructor(
    // inject user service
    private readonly userService: UserService,

    // inject client app service
    private readonly clientAppService: ClientAppService,

    // inject token service
    private readonly tokenService: TokenService,
  ) {}

  async authenticate(credentials: Credentials) {
    // deconstruct app user credentials
    const { email, password, clientId, secret } = credentials;

    // verify if user credentials are valid
    const user = await this.userService.verifyUser({ email, password });
    console.log('User ', user);
    // verify if app credentials are valid
    const app = await this.clientAppService.verifyApp({ clientId, secret });
    console.log('App ', app);
    // generate access token
    const accessToken = await this.tokenService.generateAccessToken(app);
    console.log('Access Token ', accessToken);
    // return user and access token
    return { ...user, accessToken };
  }
}
