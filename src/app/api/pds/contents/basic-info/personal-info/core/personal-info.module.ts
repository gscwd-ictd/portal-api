import { Module } from '@nestjs/common';
import { PersonalInfoService } from './personal-info.service';
import { PersonalInfoController } from './personal-info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalInfo } from '../data/personal-info.entity';
import { Employee } from '../../../../../../../app/api/employee/data/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PersonalInfo, Employee])],
  providers: [PersonalInfoService],
  controllers: [PersonalInfoController],
  exports: [PersonalInfoService],
})
export class PersonalInfoModule {}
