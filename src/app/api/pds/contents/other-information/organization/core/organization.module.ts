import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../data/organization.entity';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  providers: [OrganizationService],
  exports: [OrganizationService],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
