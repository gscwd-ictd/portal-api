import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfficeRelation } from '../data/office-relation.entity';
import { OfficeRelationController } from './office-relation.controller';
import { OfficeRelationService } from './office-relation.service';

@Module({
  imports: [TypeOrmModule.forFeature([OfficeRelation])],
  providers: [OfficeRelationService],
  exports: [OfficeRelationService],
  controllers: [OfficeRelationController],
})
export class OfficeRelationModule {}
