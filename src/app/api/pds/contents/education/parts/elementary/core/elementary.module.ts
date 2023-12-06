import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Elementary } from '../data/elementary.entity';
import { ElementaryController } from './elementary.controller';
import { ElementaryService } from './elementary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Elementary])],
  controllers: [ElementaryController],
  providers: [ElementaryService],
  exports: [ElementaryService],
})
export class ElementaryModule {}
