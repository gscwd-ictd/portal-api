import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreatePersonalInfoDto, UpdatePersonalInfoDto } from '../data/personal-info.dto';
import { PersonalInfoService } from './personal-info.service';

@Controller('pds/basic/personal-info')
export class PersonalInfoController {
  constructor(private readonly personalInfoService: PersonalInfoService) {}

  @Post()
  async createPersonalInfo(@Body() personalInfoDto: CreatePersonalInfoDto) {
    return await this.personalInfoService.createRecord(personalInfoDto);
  }

  @Get('/:id')
  async findPersonalInfoById(@Param('id') employeeId: string) {
    return await this.personalInfoService.findPdsByEmployeeId(employeeId);
  }

  @Put('/:id')
  async updatePersonalInfo(@Param('id') employeeId: string, @Body() personalInfoDto: UpdatePersonalInfoDto) {
    const { email, firstName, middleName, lastName, nameExtension, birthDate, sex, mobileNumber, ...rest } =
      personalInfoDto;
    return await this.personalInfoService.updatePersonalInfo(employeeId, personalInfoDto);
  }

  @Delete('/:id')
  async deletePersonalInfo(@Param('id') employeeId: string) {
    return await this.personalInfoService.deletePdsByEmployeeId(employeeId);
  }
}
