import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Convicted } from '../data/convicted.entity';
import { ConvictedController } from './convicted.controller';
import { ConvictedService } from './convicted.service';

@Module({
  imports: [TypeOrmModule.forFeature([Convicted])],
  providers: [ConvictedService],
  controllers: [ConvictedController],
  exports: [ConvictedService],
})
export class ConvictedModule {}
