import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Immigrant } from '../data/immigrant.entity';
import { ImmigrantController } from './immigrant.controller';
import { ImmigrantService } from './immigrant.service';

@Module({
  imports: [TypeOrmModule.forFeature([Immigrant])],
  providers: [ImmigrantService],
  exports: [ImmigrantService],
  controllers: [ImmigrantController],
})
export class ImmigrantModule {}
