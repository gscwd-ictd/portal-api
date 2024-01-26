import { Module } from '@nestjs/common';
import { GovernmentInfoService } from './government-info.service';
import { GovernmentInfoController } from './government-info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GovernmentInfo } from '../data/government-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GovernmentInfo])],
  providers: [GovernmentInfoService],
  controllers: [GovernmentInfoController],
  exports: [GovernmentInfoService],
})
export class GovernmentInfoModule {}
