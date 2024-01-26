import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkExperienceSheetAccomplishments } from '../data/accomplishments.entity';
import { WorkExperienceSheetAccomplishmentsController } from './accomplishments.controller';
import { WorkExperienceSheetAccomplishmentsService } from './accomplishments.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkExperienceSheetAccomplishments])],
  providers: [WorkExperienceSheetAccomplishmentsService],
  exports: [WorkExperienceSheetAccomplishmentsService],
  controllers: [WorkExperienceSheetAccomplishmentsController],
})
export class WorkExperienceSheetAccomplishmentsModule {}
