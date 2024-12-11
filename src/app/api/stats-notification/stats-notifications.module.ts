import { Module } from '@nestjs/common';
import { DtrCorrectionsModule } from '../dtr-corrections/dtr-corrections.module';
import { LeaveApplicationsModule } from '../leave-applications/core/leave-applications.module';
import { DtrCorrectionsService } from '../dtr-corrections/dtr-corrections.service';
import { DtrCorrectionsController } from '../dtr-corrections/dtr-corrections.controller';
import { ClientsModule } from '@nestjs/microservices';
import { EmployeeDetailsMicroservice, RedisConfigForEmployeeMonitoring } from '../../../config/microservice.config';
import { MicroserviceType } from '../../../utils/types/microservice-type';
import { StatsNotificationsService } from './stats-notifications.service';
import { StatsNotificationsController } from './stats-notifications.controller';
import { OvertimeApplicationModule } from '../overtime-applications/core/overtime-applications.module';
import { EmployeeModule } from '../employee/core/employee.module';
import { TrainingsModule } from '../trainings/trainings.module';

@Module({
  imports: [
    DtrCorrectionsModule,
    LeaveApplicationsModule,
    OvertimeApplicationModule,
    TrainingsModule,
    EmployeeModule,
    ClientsModule.registerAsync([
      { name: MicroserviceType.EMPLOYEE_DETAILS, useClass: EmployeeDetailsMicroservice },
      { name: MicroserviceType.EMPLOYEE_MONITORING, useClass: RedisConfigForEmployeeMonitoring },
    ]),
  ],
  providers: [StatsNotificationsService],
  controllers: [StatsNotificationsController],
})
export class StatsNotificationModules { }
