import { ChildrenDTO } from './../data/children.dto';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateChildDto, DeleteChildrenDTO, UpdateChildrenDTO } from '../data/children.dto';
import { ChildrenService } from './children.service';

@Controller('pds/family/children')
export class ChildrenController {
  constructor(private readonly childService: ChildrenService) { }

  @Post(':employee_id')
  async createChild(@Param('employee_id') employeeId: string, @Body() childrenDTO: ChildrenDTO) {
    return await this.childService.addChildren(employeeId, childrenDTO);
  }

  @Get()
  async getAllChildrenByEmployeeId(@Query('employee_id') employeeId: string) {
    return await this.childService.findAllPdsEmployeeId(employeeId);
  }

  @Put()
  async updateChildren(updateChildDTO: UpdateChildrenDTO) {
    return await this.childService.updateChildren(updateChildDTO);
  }

  @Delete()
  async deleteChildren(@Body() deleteChildrenDTO: DeleteChildrenDTO) {
    return await this.childService.deleteChildren(deleteChildrenDTO);
  }
}
