import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { RedisConfigForEmployeeMonitoring } from '../../../../config/microservice.config';
import { MicroserviceType } from '../../../../utils/types/microservice-type';
import { OvertimeApplicationService } from './overtime-applications.service';
import { OvertimeApplicationsController } from './overtime-applications.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      { name: MicroserviceType.EMPLOYEE_MONITORING, useClass: RedisConfigForEmployeeMonitoring },
    ]),
  ],
  controllers: [OvertimeApplicationsController],
  providers: [OvertimeApplicationService],
  exports: [OvertimeApplicationService],
})
export class OvertimeApplicationModule { }
