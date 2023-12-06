import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateSpouseDto, UpdateSpouseDto } from '../data/spouse.dto';

import { SpouseService } from './spouse.service';

@Controller('pds/family/spouse')
export class SpouseController {
  constructor(private readonly spouseService: SpouseService) {}

  @Post()
  async createSpouse(@Body() spouseDto: CreateSpouseDto) {
    return await this.spouseService.createRecord(spouseDto);
  }

  @Get('/:id')
  async findSpouseById(@Param('id') employeeId: string) {
    return await this.spouseService.findPdsByEmployeeId(employeeId);
  }

  @Put('/:id')
  async updateSpouse(@Param('id') employeeId: string, @Body() spouseDto: UpdateSpouseDto) {
    return await this.spouseService.updatePdsByEmployeeId(employeeId, spouseDto);
  }

  @Delete('/:id')
  async deleteSpouse(@Param('id') employeeId: string) {
    return await this.spouseService.deletePdsByEmployeeId(employeeId);
  }
}
