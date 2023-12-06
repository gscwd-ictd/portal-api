import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateResidentialAddressDto, UpdateResidentialAddressDto } from '../data/residential.dto';
import { ResidentialAddressService } from './residential.service';

@Controller('pds/basic/residential-address')
export class ResidentialAddressController {
  constructor(private readonly residentialService: ResidentialAddressService) {}

  @Post()
  async createResidentialAddress(@Body() residentialAddressDto: CreateResidentialAddressDto) {
    return await this.residentialService.createRecord(residentialAddressDto);
  }

  @Get('/:id')
  async findResidentialAddressById(@Param('id') employeeId: string) {
    return await this.residentialService.findAllPdsEmployeeId(employeeId);
  }

  @Put('/:id')
  async updateResidentialAddress(
    @Param('id') employeeId: string,
    @Body() residentialAddressDto: UpdateResidentialAddressDto,
  ) {
    return await this.residentialService.updatePdsByEmployeeId(employeeId, residentialAddressDto);
  }

  @Put('/:id/same-permanent')
  async updateBothAddresses(
    @Param('id') employeeId: string,
    @Body() residentialAddressDto: UpdateResidentialAddressDto,
  ) {
    return await this.residentialService.updateBothAddresses(employeeId, residentialAddressDto);
  }

  @Delete('/:id')
  async deleteResidentialAddress(@Param('id') employeeId: string) {
    return await this.residentialService.deletePdsByEmployeeId(employeeId);
  }

  @MessagePattern({ msg: 'get_pds_residential_address' })
  async getResidentialAddressByEmployeeId(@Payload() employeeId: string) {
    return await this.residentialService.findPdsByEmployeeId(employeeId);
  }
}
