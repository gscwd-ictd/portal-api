import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkExperienceSheetBasic } from '../data/basic.entity';
import { WorkExperienceSheetBasicController } from './basic.controller';
import { WorkExperienceSheetBasicService } from './basic.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkExperienceSheetBasic])],
  controllers: [WorkExperienceSheetBasicController],
  providers: [WorkExperienceSheetBasicService],
  exports: [WorkExperienceSheetBasicService],
})
export class WorkExperienceSheetBasicModule {}
