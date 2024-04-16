import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { RedisConfigForEmployeeMonitoring } from '../../../../config/microservice.config';
import { MicroserviceType } from '../../../../utils/types/microservice-type';
import { OvertimeApplicationService } from './overtime-applications.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      { name: MicroserviceType.EMPLOYEE_MONITORING, useClass: RedisConfigForEmployeeMonitoring },
    ]),
  ],
  providers: [OvertimeApplicationService],
  exports: [OvertimeApplicationService],
})
export class OvertimeApplicationModule {}
