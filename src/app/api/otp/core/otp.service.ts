import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OtpVerification, OutboundMessage } from 'src/utils/types/sms-types';
import { SmsService } from '../../sms/core/sms.service';
import { handleJwtError } from '../misc/jwt-error-handler';

@Injectable()
export class OtpService {
  constructor(
    // inject sms service
    private readonly smsService: SmsService,

    // inject jwt service
    private readonly jwtService: JwtService,
  ) {}

  async sendOtp(outboundMessage: OutboundMessage) {
    console.log(outboundMessage);
    // generate 6 digit number as otp
    const otpCode = this._generateOtp();

    // customize the content of the sms
    const content = `Your One Time Password is ${otpCode}. Note that the given code exipres in 5 mins.`;

    // send sms via microservice
    await this.smsService.sendSms({ ...outboundMessage, content });

    // return otp jwt for verification
    return { otpToken: await this._generateToken(otpCode) };
  }

  async verifyOtp(otpVerification: OtpVerification) {
    // deconstruct otp verification object
    const { otpToken, otpCode } = otpVerification;

    console.log(otpToken, otpCode);

    try {
      // verify token
      const { otp } = await this.jwtService.verifyAsync(otpToken, { secret: process.env.OTP_SECRET });

      // return success message if otp is valid
      if (otp === parseInt(otpCode)) return { message: 'OTP is valid', status: 200 };

      // throw error if otp code is not valid
      throw new HttpException('OTP code is not valid', HttpStatus.UNAUTHORIZED);
    } catch (error) {
      console.log(error);
      // handle jwt error
      handleJwtError(error.name);
    }
  }

  private _generateOtp(): number {
    // generate a 6 digit random number
    return Math.floor(100000 + Math.random() * 900000);
  }

  private async _generateToken(otp: number) {
    try {
      return await this.jwtService.signAsync({ otp }, { secret: process.env.OTP_TOKEN, expiresIn: '5m' });
    } catch (error) {
      throw new HttpException('Failed to generate OTP token', HttpStatus.BAD_REQUEST);
    }
  }
}
