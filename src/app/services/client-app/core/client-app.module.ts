import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientApp } from '../data/client-app.entity';
import { RandomizerService } from '../misc/randomizer.service';
import { ClientAppController } from './client-app.controller';
import { ClientAppService } from './client-app.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClientApp])],
  controllers: [ClientAppController],
  providers: [ClientAppService, RandomizerService],
  exports: [ClientAppService],
})
export class ClientAppModule {}
