import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkExperienceSheetDuties } from '../data/duties.entity';
import { WorkExperienceSheetDutiesController } from './duties.controller';
import { WorkExperienceSheetDutiesService } from './duties.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkExperienceSheetDuties])],
  exports: [WorkExperienceSheetDutiesService],
  providers: [WorkExperienceSheetDutiesService],
  controllers: [WorkExperienceSheetDutiesController],
})
export class WorkExperienceSheetDutiesModule {}
