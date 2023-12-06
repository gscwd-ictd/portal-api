import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreatePermanentAddressDto, UpdatePermanentAddressDto } from '../data/permanent.dto';
import { PermanentAddressService } from './permanent.service';

@Controller('pds/basic/permanent-address')
export class PermanentAddressController {
  constructor(private readonly permanentService: PermanentAddressService) {}

  @Post()
  async createPermanentAddress(@Body() permanentAddressDto: CreatePermanentAddressDto) {
    return await this.permanentService.createRecord(permanentAddressDto);
  }

  @Get('/:id')
  async findPermanentAddressById(@Param('id') employeeId: string) {
    return await this.permanentService.findPdsByEmployeeId(employeeId);
  }

  @Put('/:id')
  async updatePermanentAddress(
    @Param('id') employeeId: string,
    @Body() permanentAddressDto: UpdatePermanentAddressDto,
  ) {
    return await this.permanentService.updatePermanentAddress(employeeId, permanentAddressDto);
  }

  @Delete('/:id')
  async deletePermanentAddress(@Param('id') employeeId: string) {
    return await this.permanentService.deletePdsByEmployeeId(employeeId);
  }
}
