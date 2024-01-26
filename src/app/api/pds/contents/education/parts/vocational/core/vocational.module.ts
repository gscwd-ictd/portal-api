import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vocational } from '../data/vocational.entity';
import { VocationalController } from './vocational.controller';
import { VocationalService } from './vocational.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vocational])],
  exports: [VocationalService],
  providers: [VocationalService],
  controllers: [VocationalController],
})
export class VocationalModule {}
