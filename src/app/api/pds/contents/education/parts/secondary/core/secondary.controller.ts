import { EducationInterceptor } from './../../../utils/education.interceptor';
import { SecondaryService } from './secondary.service';
import { Body, Controller, Put, Param, Post, UseInterceptors } from '@nestjs/common';
import { EducationDTO } from '../../../data/education.dto';

@Controller('pds/education/secondary')
export class SecondaryController {
  constructor(private readonly secondaryService: SecondaryService) {}

  @UseInterceptors(EducationInterceptor)
  @Post(':employee_id')
  async addSecondary(@Param('employee_id') employeeId: string, @Body() secondaryDTO: EducationDTO) {
    return await this.secondaryService.createRecord({ employeeId, ...secondaryDTO });
  }

  @UseInterceptors(EducationInterceptor)
  @Put(':employee_id')
  async updateSecondary(@Param('employee_id') employeeId: string, @Body() secondaryDTO: EducationDTO) {
    return await this.secondaryService.updateSecondary(employeeId, secondaryDTO);
  }
}
