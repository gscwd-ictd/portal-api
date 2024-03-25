import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { RedisConfigForEmployeeMonitoring } from '../../../../config/microservice.config';
import { MicroserviceType } from '../../../../utils/types/microservice-type';
import { EventsAnnouncementsService } from './event-announcements.service';
import { EventsAnnouncementsController } from './event-announcements.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      { name: MicroserviceType.EMPLOYEE_MONITORING, useClass: RedisConfigForEmployeeMonitoring },
    ]),
  ],
  controllers: [EventsAnnouncementsController],
  providers: [EventsAnnouncementsService],
  exports: [EventsAnnouncementsService],
})
export class EventAnnouncementsModule {}
