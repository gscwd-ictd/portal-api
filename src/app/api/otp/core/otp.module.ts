import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { SmsModule } from '../../sms/core/sms.module';
import { JwtModule } from '@nestjs/jwt';
import { OtpJwt } from '../../../../config/jwt.config';

@Module({
  imports: [
    // otp jwt module
    JwtModule.registerAsync({ useClass: OtpJwt }),

    // use sms module
    SmsModule,
  ],
  providers: [OtpService],
  controllers: [OtpController],
})
export class OtpModule {}
