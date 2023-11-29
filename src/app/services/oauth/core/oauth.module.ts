import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../../../api/user/core/user.module';
import { OAuthJwt } from '../../../../config/jwt.config';
import { ClientAppModule } from '../../client-app/core/client-app.module';
import { TokenService } from '../misc/token.service';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';

@Module({
  imports: [JwtModule.registerAsync({ useClass: OAuthJwt }), UserModule, ClientAppModule],
  controllers: [OauthController],
  providers: [OauthService, TokenService],
})
export class OauthModule {}
