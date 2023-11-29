import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Secondary } from '../data/secondary.entity';
import { SecondaryController } from './secondary.controller';
import { SecondaryService } from './secondary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Secondary])],
  providers: [SecondaryService],
  controllers: [SecondaryController],
  exports: [SecondaryService],
})
export class SecondaryModule {}
