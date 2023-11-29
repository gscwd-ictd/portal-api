import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GovernmentInfoService } from '../../../../basic-info/government-info/core/government-info.service';
import { GovernmentIssuedId } from '../data/government-issued-id.entity';
import { GovernmentIssuedIdController } from './government-issued-id.controller';
import { GovernmentIssuedIdService } from './government-issued-id.service';

@Module({
  imports: [TypeOrmModule.forFeature([GovernmentIssuedId])],
  providers: [GovernmentIssuedIdService],
  exports: [GovernmentIssuedIdService],
  controllers: [GovernmentIssuedIdController],
})
export class GovernmentIssuedIdModule {}
