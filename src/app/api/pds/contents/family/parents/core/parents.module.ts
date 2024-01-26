import { Module } from '@nestjs/common';
import { ParentsService } from './parents.service';
import { ParentsController } from './parents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parents } from '../data/parents.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parents])],
  providers: [ParentsService],
  controllers: [ParentsController],
  exports: [ParentsService],
})
export class ParentsModule {}
