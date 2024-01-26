import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { readFileSync } from 'fs';
import { join } from 'path';

export class OAuthJwt implements JwtOptionsFactory {
  createJwtOptions(): JwtModuleOptions | Promise<JwtModuleOptions> {
    //const publicKeyString = join(__dirname, '../../.', process.env.PUBLIC_KEY);
    console.log(process.env.PUBLIC_KEY);
    return {
      // the public key for verifying the token
      publicKey: readFileSync(join(__dirname, '../../../.', process.env.PUBLIC_KEY), 'utf8'),

      // the private key for signing the token
      privateKey: readFileSync(join(__dirname, '../../../.', process.env.PRIVATE_KEY), 'utf8'),

      // other options
      signOptions: {
        // algorithm used for signing the token
        algorithm: 'RS256',

        // specify who issued the token
        issuer: process.env.TOKEN_ISSUER,
      },
    };
  }
}

export class PendingUserJwt implements JwtOptionsFactory {
  createJwtOptions(): JwtModuleOptions | Promise<JwtModuleOptions> {
    return {
      secret: process.env.PENDING_USER_SECRET,
    };
  }
}

export class OtpJwt implements JwtOptionsFactory {
  createJwtOptions(): JwtModuleOptions | Promise<JwtModuleOptions> {
    return {
      secret: process.env.OTP_SECRET,
    };
  }
}
