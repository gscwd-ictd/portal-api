import { Employee201Module } from './app/api/201/201.module';
import { PdsModule } from './app/api/pds/core/pds.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './app/api/user/core/user.module';
import { ClientAppModule } from './app/services/client-app/core/client-app.module';
import { OauthModule } from './app/services/oauth/core/oauth.module';
import { DatabaseConfig } from './config/database.config';
import { EmployeeModule } from './app/api/employee/core/employee.module';
import { SmsModule } from './app/api/sms/core/sms.module';
import { OtpModule } from './app/api/otp/core/otp.module';
import { join } from 'path';
import { PdsSupportingDetailsModule } from './app/api/pds/contents/other-information/supporting-details/pds-supporting-details.module';
import { TrainingsModule } from './app/api/trainings/trainings.module';
import { DtrCorrectionsModule } from './app/api/dtr-corrections/dtr-corrections.module';
import { PassSlipsModule } from './app/api/pass-slips/pass-slips.module';
import { EventAnnouncementsModule } from './app/api/event-announcements/core/event-announcements.module';
import { LeaveApplicationsModule } from './app/api/leave-applications/core/leave-applications.module';
import { StatsNotificationModules } from './app/api/stats-notification/stats-notifications.module';

@Module({
  imports: [
    // config modules
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '../../.env') }),
    TypeOrmModule.forRootAsync({ useClass: DatabaseConfig }),

    // custom modules
    UserModule,
    EmployeeModule,
    ClientAppModule,
    OauthModule,

    // microservice modules
    SmsModule,
    PdsModule,
    PdsSupportingDetailsModule,
    OtpModule,
    Employee201Module,
    TrainingsModule,
    DtrCorrectionsModule,
    PassSlipsModule,
    EventAnnouncementsModule,
    LeaveApplicationsModule,
    StatsNotificationModules,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
