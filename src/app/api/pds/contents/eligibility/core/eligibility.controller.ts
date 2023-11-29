import { EligibilityAddDTO, EligibilityDeleteDTO, EligibilityDTO } from './../data/eligibility.dto';
import { Body, Controller, Delete, Param, Post, Put, Get } from '@nestjs/common';
import { EligibilityUpdateDTO } from '../data/eligibility.dto';
import { EligibilityService } from './eligibility.service';

@Controller('pds/eligibility')
export class EligibilityController {
  constructor(private readonly eligibilityService: EligibilityService) {}

  @Put()
  async updateEligibilities(@Body() eligibilityDTO: EligibilityUpdateDTO) {
    return await this.eligibilityService.updateEligibilities(eligibilityDTO);
  }

  @Delete(':eligibility_id')
  async deleteEligibilities(@Param('eligibility_id') eligibilityDeleteDTO: EligibilityDeleteDTO) {
    return await this.eligibilityService.deleteEligibilities(eligibilityDeleteDTO);
  }

  @Post(':employee_id')
  async addEligibility(@Param('employee_id') employeeId: string, @Body() eligibilityAddDTO: EligibilityAddDTO) {
    console.log('asdasdasdsa');
    return await this.eligibilityService.addEligibilities(employeeId, eligibilityAddDTO);
  }
}
