import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { RedisConfigForEmployeeMonitoring } from '../../../../config/microservice.config';
import { MicroserviceType } from '../../../../utils/types/microservice-type';
import { LeaveApplicationsService } from './leave-applications.service';
import { LeaveApplicationController } from './leave-applications.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      { name: MicroserviceType.EMPLOYEE_MONITORING, useClass: RedisConfigForEmployeeMonitoring },
    ]),
  ],
  providers: [LeaveApplicationsService],
  controllers: [LeaveApplicationController],
  exports: [LeaveApplicationsService],
})
export class LeaveApplicationsModule {}
