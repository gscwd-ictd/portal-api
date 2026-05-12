import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OauthService {
  private authCodes = new Map<string, string>();

  constructor(private readonly jwtService: JwtService) {}

  generateAuthCode(email: string): string {
    const code = uuidv4();
    this.authCodes.set(code, email);

    // expire in 5 minutes
    setTimeout(() => this.authCodes.delete(code), 300000);

    return code;
  }

  consumeAuthCode(code: string): string | null {
    const email = this.authCodes.get(code);
    this.authCodes.delete(code);
    return email || null;
  }

  generateJwt(email: string) {
    return this.jwtService.sign(email);
  }
}
