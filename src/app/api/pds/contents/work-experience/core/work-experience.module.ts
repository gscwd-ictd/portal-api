import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkExperience } from '../data/work-experience.entity';
import { WorkExperienceController } from './work-experience.controller';
import { WorkExperienceService } from './work-experience.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkExperience])],
  providers: [WorkExperienceService],
  controllers: [WorkExperienceController],
  exports: [WorkExperienceService],
})
export class WorkExperienceModule {}
