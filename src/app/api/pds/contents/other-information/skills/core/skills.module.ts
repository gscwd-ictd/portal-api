import { Injectable, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skills } from '../data/skills.entity';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';

@Module({
  imports: [TypeOrmModule.forFeature([Skills])],
  providers: [SkillsService],
  exports: [SkillsService],
  controllers: [SkillsController],
})
export class SkillsModule {}
