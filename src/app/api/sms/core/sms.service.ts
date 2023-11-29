import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MicroserviceType } from '../../../../utils/types/microservice-type';
import { MicroserviceHelper } from '../../../../utils/helpers/microservice';
import { OutboundMessage } from '../../../../utils/types/sms-types';
import { SEND_SMS } from '../../../../utils/constants/microservice-patterns';

@Injectable()
export class SmsService extends MicroserviceHelper {
  constructor(
    @Inject(MicroserviceType.SMS)
    private readonly smsClient: ClientProxy,
  ) {
    super(smsClient);
  }

  async sendSms(outboundMessage: OutboundMessage) {
    return await this.sendMessage(SEND_SMS, outboundMessage);
  }
}
