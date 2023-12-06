import { AddEducationDTO } from './../../../data/education.dto';
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { VocationalService } from './vocational.service';
import { EducationsInterceptor } from '../../../utils/education.interceptor';

@Controller('pds/education/vocational')
export class VocationalController {
  constructor(private readonly vocationalService: VocationalService) {}

  @UseGuards(EducationsInterceptor)
  @Post(':employee_id')
  async addVocational(@Param('employee_id') employeeId: string, @Body() vocationalDTO: AddEducationDTO) {
    return await this.vocationalService.addVocational(employeeId, vocationalDTO);
  }
}
