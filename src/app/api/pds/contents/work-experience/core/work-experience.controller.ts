import { EducationsInterceptor } from './../../education/utils/education.interceptor';
import { AddWorkExperienceDTO } from './../data/work-experience.dto';
import { Controller, Param, Post, Body, UseGuards, Get } from '@nestjs/common';
import { WorkExperienceService } from './work-experience.service';

@Controller('pds/work-experience/')
export class WorkExperienceController {
  constructor(private readonly workExperienceService: WorkExperienceService) {}

  @Post(':employee_id')
  async addWorkExperience(@Param('employee_id') employeeId: string, @Body() workExperienceDTO: AddWorkExperienceDTO) {
    return await this.workExperienceService.addWorkExperience(employeeId, workExperienceDTO);
  }

  @Get(':employee_id')
  async getWorkExperience(@Param('employee_id') employeeId: string) {
    return await this.workExperienceService.getWorkExperience(employeeId);
  }
}
