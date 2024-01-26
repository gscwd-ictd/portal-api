import { EducationInterceptor } from './../../../utils/education.interceptor';
import { Param, Controller, Post, Body, UseInterceptors, Put } from '@nestjs/common';
import { AddEducationDTO, EducationDTO } from '../../../data/education.dto';
import { ElementaryService } from './elementary.service';

@Controller('pds/education/elementary')
export class ElementaryController {
  constructor(private readonly elementaryService: ElementaryService) {}

  @UseInterceptors(EducationInterceptor)
  @Post(':employee_id')
  async addElementary(@Param('employee_id') employeeId: string, @Body() elementaryDTO: EducationDTO) {
    return await this.elementaryService.addElementary(employeeId, elementaryDTO);
  }

  @UseInterceptors(EducationInterceptor)
  @Put(':employee_id')
  async updateElementary(@Param('employee_id') employeeId: string, @Body() elementaryDTO: EducationDTO) {
    return await this.elementaryService.updatePdsByEmployeeId(employeeId, elementaryDTO);
  }
}
