import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateGovernmentInfoDto, UpdateGovernmentInfoDto } from '../data/government-info.dto';
import { GovernmentInfoService } from './government-info.service';

@Controller('pds/basic/government-info')
export class GovernmentInfoController {
  constructor(private readonly governmentInfoService: GovernmentInfoService) {}

  @Post()
  async createGovernmentInfo(@Body() governmentInfoDto: CreateGovernmentInfoDto) {
    return await this.governmentInfoService.createRecord(governmentInfoDto);
  }

  @Get('/:id')
  async findGovernmentInfoById(@Param('id') employeeId: string) {
    return await this.governmentInfoService.findPdsByEmployeeId(employeeId);
  }

  @Put('/:id')
  async updateGovernmentInfo(@Param('id') employeeId: string, @Body() governmentInfoDto: UpdateGovernmentInfoDto) {
    return await this.governmentInfoService.updatePdsByEmployeeId(employeeId, governmentInfoDto);
  }

  @Delete('/:id')
  async deleteGovernmentInfo(@Param('id') employeeId: string) {
    return await this.governmentInfoService.deletePdsByEmployeeId(employeeId);
  }
}
