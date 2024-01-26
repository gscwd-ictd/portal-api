import { EducationsInterceptor } from './../../education/utils/education.interceptor';
import { AddVoluntaryWorkDTO, DeleteVoluntaryWorkDTO, VoluntaryWorkDTO } from './../data/voluntary-work.dto';
import { Body, Controller, Delete, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { UpdateVoluntaryWorkDTO } from '../data/voluntary-work.dto';
import { VoluntaryWorkService } from './voluntary-work.service';

@Controller('pds/voluntary-work')
export class VoluntaryWorkController {
  constructor(private readonly voluntaryWorkService: VoluntaryWorkService) {}

  @Put()
  async updateVoluntaryWork(@Body() updateVoluntaryWorkDTO: UpdateVoluntaryWorkDTO) {
    return await this.voluntaryWorkService.updateVoluntaryWork(updateVoluntaryWorkDTO);
  }

  @Delete(':voluntary_work_id')
  async deleteVoluntaryWork(@Param('voluntary_work_id') _id: string) {
    return await this.voluntaryWorkService.deleteVoluntaryWork2(_id);
  }

  @Post(':employee_id')
  async addVoluntaryWork(@Param('employee_id') employeeId: string, @Body() voluntaryWorkDTO: AddVoluntaryWorkDTO) {
    console.log(voluntaryWorkDTO);
    return await this.voluntaryWorkService.addVoluntaryWork(employeeId, voluntaryWorkDTO);
  }
}
