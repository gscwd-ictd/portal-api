import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndigenousPWDSoloParent } from '../data/indigenous-pwd-soloparent.entity';
import { IndigenousPWDSoloParentController } from './indigenous-pwd-soloparent.controller';
import { IndigenousPWDSoloParentService } from './indigenous-pwd-soloparent.service';

@Module({
  imports: [TypeOrmModule.forFeature([IndigenousPWDSoloParent])],
  providers: [IndigenousPWDSoloParentService],
  exports: [IndigenousPWDSoloParentService],
  controllers: [IndigenousPWDSoloParentController],
})
export class IndigenousPWDSoloParentModule {}
