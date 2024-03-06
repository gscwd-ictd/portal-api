import { Module } from '@nestjs/common';
import { DtrCorrectionsService } from './dtr-corrections.service';
import { DtrCorrectionsController } from './dtr-corrections.controller';
import { ClientsModule } from '@nestjs/microservices';
import { EmployeeDetailsMicroservice, RedisConfigForEmployeeMonitoring } from '../../..//config/microservice.config';
import { MicroserviceType } from '../../../utils/types/microservice-type';

@Module({
  imports: [
    ClientsModule.registerAsync([
      { name: MicroserviceType.EMPLOYEE_DETAILS, useClass: EmployeeDetailsMicroservice },
      { name: MicroserviceType.EMPLOYEE_MONITORING, useClass: RedisConfigForEmployeeMonitoring },
    ]),
  ],
  providers: [DtrCorrectionsService],
  controllers: [DtrCorrectionsController],
  exports: [DtrCorrectionsService],
})
export class DtrCorrectionsModule {}
