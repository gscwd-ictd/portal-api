import { AddEducationDTO } from './../../../data/education.dto';
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CollegeService } from './college.service';
import { EducationsInterceptor } from '../../../utils/education.interceptor';

@Controller('pds/education/college')
export class CollegeController {
  constructor(private readonly collegeService: CollegeService) {}

  @UseGuards(EducationsInterceptor)
  @Post(':employee_id')
  async addCollege(@Param('employee_id') employeeId: string, @Body() collegeDTO: AddEducationDTO) {
    return await this.collegeService.addCollege(employeeId, collegeDTO);
  }
}
