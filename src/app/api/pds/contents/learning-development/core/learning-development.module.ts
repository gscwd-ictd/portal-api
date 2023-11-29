import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningDevelopment } from '../data/learning-development.entity';
import { LearningDevelopmentController } from './learning-development.controller';
import { LearningDevelopmentService } from './learning-development.service';

@Module({
  imports: [TypeOrmModule.forFeature([LearningDevelopment])],
  providers: [LearningDevelopmentService],
  exports: [LearningDevelopmentService],
  controllers: [LearningDevelopmentController],
})
export class LearningDevelopmentModule {}
