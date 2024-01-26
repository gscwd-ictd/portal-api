import { Module } from '@nestjs/common';
import { WorkExperienceSheetAccomplishmentsModule } from '../contents/accomplishments/core/accomplishments.module';
import { WorkExperienceSheetBasicModule } from '../contents/basic/core/basic.module';
import { WorkExperienceSheetDutiesModule } from '../contents/duties/core/duties.module';
import { WorkExperienceSheetController } from './work-experience-sheet.controller';
import { WorkExperienceSheetService } from './work-experience-sheet.service';

@Module({
  imports: [WorkExperienceSheetAccomplishmentsModule, WorkExperienceSheetDutiesModule, WorkExperienceSheetBasicModule],
  controllers: [WorkExperienceSheetController],
  providers: [WorkExperienceSheetService],
  exports: [WorkExperienceSheetService],
})
export class WorkExperienceSheetModule {}
