import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Graduate } from '../data/graduate.entity';
import { GraduateController } from './graduate.controller';
import { GraduateService } from './graduate.service';

@Module({
  imports: [TypeOrmModule.forFeature([Graduate])],
  controllers: [GraduateController],
  providers: [GraduateService],
  exports: [GraduateService],
})
export class GraduateModule {}
