import { Module } from '@nestjs/common';
import { TrainingsService } from './trainings.service';
import { TrainingsController } from './trainings.controller';
import { ClientsModule } from '@nestjs/microservices';
import { RedisConfigForLND } from '../../../config/microservice.config';
import { MicroserviceType } from '../../../utils/types/microservice-type';

@Module({
  imports: [ClientsModule.registerAsync([{ name: MicroserviceType.LND, useClass: RedisConfigForLND }])],
  providers: [TrainingsService],
  controllers: [TrainingsController],
})
export class TrainingsModule {}
