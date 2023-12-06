import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../../../../global/guards/authenticated.guard';
import { OutboundMessage } from '../../../../utils/types/sms-types';
import { SmsService } from './sms.service';

@UseGuards(AuthenticatedGuard)
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post()
  async send(@Body() message: OutboundMessage) {
    return await this.smsService.sendSms(message);
  }
}
