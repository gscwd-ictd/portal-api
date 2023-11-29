import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { References } from '../data/references.entity';
import { ReferenceController } from './references.controller';
import { ReferencesService } from './references.service';

@Module({
  imports: [TypeOrmModule.forFeature([References])],
  providers: [ReferencesService],
  exports: [ReferencesService],
  controllers: [ReferenceController],
})
export class ReferencesModule {}
