import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { College } from '../data/college.entity';
import { CollegeController } from './college.controller';
import { CollegeService } from './college.service';

@Module({
  imports: [TypeOrmModule.forFeature([College])],
  providers: [CollegeService],
  controllers: [CollegeController],
  exports: [CollegeService],
})
export class CollegeModule {}
