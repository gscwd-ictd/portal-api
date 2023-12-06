import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthenticatedGuard } from '../../../../global/guards/authenticated.guard';
import { OtpVerification, OutboundMessage } from '../../../../utils/types/sms-types';
import { OtpService } from './otp.service';

//@UseGuards(AuthenticatedGuard)
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post()
  async sendOtpViaSms(@Body() message: OutboundMessage) {
    return await this.otpService.sendOtp(message);
  }

  @Get()
  async test() {
    return 'sasda';
  }

  @Post('verify')
  async verifyOtp(@Body() otpVerification: OtpVerification) {
    return await this.otpService.verifyOtp(otpVerification);
  }
}
