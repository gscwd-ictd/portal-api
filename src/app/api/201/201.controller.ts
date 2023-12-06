import { Employee201Service } from './201.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('/201/')
export class Employee201Controller {
  constructor(private readonly employee201Service: Employee201Service) {}

  @Get(':employee_id/work-experience')
  async test(@Param('employee_id') employeeId: string) {
    return await this.employee201Service.getWDWorkExperience(employeeId);
  }

  @Get(':employee_id/learning-development')
  async getAllWDLearningDevelopment(@Param('employee_id') employeeId: string) {
    return await this.employee201Service.getAllWDLearningDevelopment(employeeId);
  }

  @Get(':employee_id/pds')
  async getWDPDS(@Param('employee_id') employeeId: string) {
    return await this.employee201Service.getWDPDS(employeeId);
  }
}
