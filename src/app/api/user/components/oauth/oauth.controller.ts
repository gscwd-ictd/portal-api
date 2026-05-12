import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Controller('')
export class OauthController {
  constructor(private readonly oauthService: OauthService, private readonly jwtService: JwtService) {}

  @Get('authorize')
  async authorize(
    @Req() req,
    @Res() res,
    @Query('redirect_uri') redirectUri: string,
    @Query('client_id') clientId: string,
    @Query('state') state: string,
  ) {
    if (!req.session?.user) {
      return res.redirect('/login');
    }

    const email = req.session.user.email;

    const code = this.oauthService.generateAuthCode(email);

    return res.redirect(`${redirectUri}?code=${code}&state=${state}`);
  }

  @Post('token')
  async token(@Body() body) {
    const { code } = body;

    const email = this.oauthService.consumeAuthCode(code);

    if (!email) {
      return { error: 'invalid_grant' };
    }

    // reuse your existing JWT signing method
    const accessToken = this.oauthService.generateJwt(email);

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600,
    };
  }

  @Get('userinfo')
  async userinfo(@Req() req: Request) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return { error: 'invalid_token' };
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded: any = this.jwtService.verify(token);

      return {
        email: decoded.email,
        full_name: decoded.full_name,
      };
    } catch {
      return { error: 'invalid_token' };
    }
  }
}
