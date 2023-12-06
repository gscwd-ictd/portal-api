import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateResigned } from '../data/candidate-resigned.entity';
import { CandidateResignedController } from './candidate-resigned.controller';
import { CandidateResignedService } from './candidate-resigned.service';

@Module({
  imports: [TypeOrmModule.forFeature([CandidateResigned])],
  providers: [CandidateResignedService],
  exports: [CandidateResignedService],
  controllers: [CandidateResignedController],
})
export class CandidateResignedModule {}
