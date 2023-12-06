import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Eligibility } from '../data/eligibility.entity';
import { EligibilityController } from './eligibility.controller';
import { EligibilityService } from './eligibility.service';

@Module({
  imports: [TypeOrmModule.forFeature([Eligibility])],
  providers: [EligibilityService],
  controllers: [EligibilityController],
  exports: [EligibilityService],
})
export class EligibilityModule {}
