import { Module } from '@nestjs/common';
import { SpouseService } from './spouse.service';
import { SpouseController } from './spouse.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Spouse } from '../data/spouse.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Spouse])],
  providers: [SpouseService],
  controllers: [SpouseController],
  exports: [SpouseService],
})
export class SpouseModule {}
