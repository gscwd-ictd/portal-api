import { Module } from '@nestjs/common';
import { PassSlipsService } from './pass-slips.service';
import { ClientsModule } from '@nestjs/microservices';
import { EmployeeDetailsMicroservice, RedisConfigForEmployeeMonitoring } from '../../../config/microservice.config';
import { MicroserviceType } from '../../../utils/types/microservice-type';
import { PassSlipsController } from './pass-slips.controller';
import { EmployeeModule } from '../employee/core/employee.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      { name: MicroserviceType.EMPLOYEE_DETAILS, useClass: EmployeeDetailsMicroservice },
      { name: MicroserviceType.EMPLOYEE_MONITORING, useClass: RedisConfigForEmployeeMonitoring },
    ]),
    EmployeeModule,
  ],
  controllers: [PassSlipsController],
  providers: [PassSlipsService],
  exports: [PassSlipsService],
})
export class PassSlipsModule {}
