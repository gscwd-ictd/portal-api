import { AddEducationDTO } from './../../../data/education.dto';
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { EducationsInterceptor } from '../../../utils/education.interceptor';
import { GraduateService } from './graduate.service';

@Controller('pds/education/graduate')
export class GraduateController {
  constructor(private readonly graduateService: GraduateService) {}

  @UseGuards(EducationsInterceptor)
  @Post(':employee_id')
  async addGraduate(@Param('employee_id') employeeId: string, @Body() graduateDTO: AddEducationDTO) {
    return await this.graduateService.addGraduate(employeeId, graduateDTO);
  }
}
