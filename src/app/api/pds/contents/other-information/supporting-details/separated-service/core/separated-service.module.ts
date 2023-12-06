import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeparatedService } from '../data/separated-service.entity';
import { SeparatedServiceController } from './separated-service.controller';
import { SeparatedServiceService } from './separated-service.service';

@Module({
  imports: [TypeOrmModule.forFeature([SeparatedService])],
  providers: [SeparatedServiceService],
  exports: [SeparatedServiceService],
  controllers: [SeparatedServiceController],
})
export class SeparatedServiceModule {}
