import { PdsModule } from './../pds/core/pds.module';
import { Module } from '@nestjs/common';
import { Employee201Controller } from './201.controller';
import { Employee201Service } from './201.service';

@Module({
  imports: [PdsModule],
  controllers: [Employee201Controller],
  providers: [Employee201Service],
})
export class Employee201Module {}
