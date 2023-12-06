import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoluntaryWork } from '../data/voluntary-work.entity';
import { VoluntaryWorkController } from './voluntary-work.controller';
import { VoluntaryWorkService } from './voluntary-work.service';

@Module({
  imports: [TypeOrmModule.forFeature([VoluntaryWork])],
  providers: [VoluntaryWorkService],
  controllers: [VoluntaryWorkController],
  exports: [VoluntaryWorkService],
})
export class VoluntaryWorkModule {}
