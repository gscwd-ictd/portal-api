import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { readFileSync } from 'fs';
import { join } from 'path';
import { VerifiedApp } from '../../../../utils/types/auth-type';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(verifiedApp: VerifiedApp): Promise<string> {
    // console.log(process.env.PRIVATE_KEY)
    try {
      return await this.jwtService.signAsync(
        {},
        {
          // set algorithm to be used in signing this token
          algorithm: 'RS256',

          // specify the private key
          privateKey: readFileSync(process.env.PRIVATE_KEY),
          //readFileSync(join(__dirname, '../../../.',
          // specify the expiration
          expiresIn: process.env.TOKEN_EXPIRATION,

          // specify the issuer of this token
          issuer: process.env.TOKEN_ISSUER,

          // specify the subject for this token
          subject: verifiedApp._id,

          // specify the audience of this token
          audience: verifiedApp.callbackUrl,
        },
      );
    } catch (error) {
      throw new RpcException('Access token generation failed');
    }
  }
}
