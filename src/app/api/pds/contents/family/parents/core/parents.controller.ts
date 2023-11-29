import { ParentMama } from './../data/parents.dto';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateParentsDto, ParentPapa, UpdateParentsDto } from '../data/parents.dto';

import { ParentsService } from './parents.service';

@Controller('pds/family/parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Post()
  async createParents(@Body() parentsDto: CreateParentsDto) {
    return await this.parentsService.createRecord(parentsDto);
  }

  @Get('/:id')
  async findParentsById(@Param('id') employeeId: string) {
    return await this.parentsService.findPdsByEmployeeId(employeeId);
  }

  @Put('/:id/father')
  async updateFather(@Param('id') employeeId: string, @Body() papaDto: ParentPapa) {
    return await this.parentsService.updateFather(employeeId, papaDto);
  }

  @Put('/:id/mother')
  async updateMother(@Param('id') employeeId: string, @Body() mamaDto: ParentMama) {
    return await this.parentsService.updateMother(employeeId, mamaDto);
  }

  @Delete('/:id')
  async deleteParents(@Param('id') employeeId: string) {
    return await this.parentsService.deletePdsByEmployeeId(employeeId);
  }
}
