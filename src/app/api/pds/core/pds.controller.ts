import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PdsDTO } from '../data/pds.dto';
import { PdsService } from './pds.service';

@Controller('api/pds')
export class PdsController {
  constructor(private readonly pdsService: PdsService) {}

  @Get(':employee_id')
  async getPds(@Param('employee_id') employeeId: string) {
    return await this.pdsService.getPdsV2(employeeId);
  }

  @Get(':employee_id/v2')
  async getPdsV2(@Param('employee_id') employeeId: string) {
    return await this.pdsService.getPdsV2(employeeId);
  }

  @Get('/v2/:employee_id')
  async getPdsV2Emp(@Param('employee_id') employeeId: string) {
    return await this.pdsService.getPdsV2(employeeId);
  }

  @Post(':employee_id')
  async savePds(@Body() pdsDto: PdsDTO, @Param('employee_id') employeeId: string) {
    return await this.pdsService.savePds(pdsDto, employeeId);
  }
}
