import { Module } from '@nestjs/common';
import { TrainingsService } from './trainings.service';
import { TrainingsController } from './trainings.controller';
import { ClientsModule } from '@nestjs/microservices';
import { RedisConfigForLND } from '../../../config/microservice.config';
import { MicroserviceType } from '../../../utils/types/microservice-type';
import { EmployeeModule } from '../employee/core/employee.module';
import { EmployeeService } from '../employee/core/employee.service';

@Module({
  imports: [ClientsModule.registerAsync([{ name: MicroserviceType.LND, useClass: RedisConfigForLND }]), EmployeeModule],
  providers: [TrainingsService],
  controllers: [TrainingsController],
  exports: [TrainingsService],
})
export class TrainingsModule {}
