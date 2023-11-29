import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuiltyCharged } from '../data/guilty-charged.entity';
import { GuiltyChargedController } from './guilty-charged.controller';
import { GuiltyChargedService } from './guilty-charged.service';

@Module({
  imports: [TypeOrmModule.forFeature([GuiltyCharged])],
  providers: [GuiltyChargedService],
  exports: [GuiltyChargedService],
  controllers: [GuiltyChargedController],
})
export class GuiltyChargedModule {}
