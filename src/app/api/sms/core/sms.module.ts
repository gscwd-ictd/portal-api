import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { ClientsModule } from '@nestjs/microservices';
import { SmsMicroservice } from '../../../../config/microservice.config';
import { MicroserviceType } from '../../../../utils/types/microservice-type';

@Module({
  imports: [ClientsModule.registerAsync([{ useClass: SmsMicroservice, name: MicroserviceType.SMS }])],
  providers: [SmsService],
  controllers: [SmsController],
  exports: [SmsService],
})
export class SmsModule {}
