import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { RedisConfigForEmployeeMonitoring } from '../../../../config/microservice.config';
import { MicroserviceType } from '../../../../utils/types/microservice-type';
import { LeaveApplicationsService } from './leave-applications.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      { name: MicroserviceType.EMPLOYEE_MONITORING, useClass: RedisConfigForEmployeeMonitoring },
    ]),
  ],
  providers: [LeaveApplicationsService],
  exports: [LeaveApplicationsService],
})
export class LeaveApplicationsModule {}
