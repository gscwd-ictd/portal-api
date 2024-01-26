import { PersonalInfoModule } from './../../pds/contents/basic-info/personal-info/core/personal-info.module';
import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../data/employee.entity';
import { ClientsModule } from '@nestjs/microservices';
import { MicroserviceType } from '../../../../utils/types/microservice-type';
import { EmployeeDetailsMicroservice } from '../../../../config/microservice.config';
import { PendingUserModule } from '../../pending-user/core/pending-user.module';

@Module({
  imports: [
    // typeorm module
    TypeOrmModule.forFeature([Employee]),

    // microservice
    ClientsModule.registerAsync([{ name: MicroserviceType.EMPLOYEE_DETAILS, useClass: EmployeeDetailsMicroservice }]),

    PendingUserModule,
    PersonalInfoModule,
  ],
  providers: [EmployeeService],
  controllers: [EmployeeController],
  exports: [EmployeeService],
})
export class EmployeeModule {}
