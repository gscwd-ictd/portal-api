import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserSignupDetails } from '../../../../utils/types/auth-type';

@Injectable()
export class PendingUserTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generatePendingUser(userSignupDetails: UserSignupDetails): Promise<string> {
    try {
      return await this.jwtService.signAsync(userSignupDetails, { secret: process.env.PENDING_USER_SECRET });
    } catch (error) {
      throw new HttpException('Failed to generate pending user token', HttpStatus.BAD_REQUEST);
    }
  }

  async verifyPendingUser(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, { secret: process.env.PENDING_USER_SECRET });
    } catch (error) {
      throw new HttpException('Failed to verify pending user token', HttpStatus.BAD_REQUEST);
    }
  }
}
