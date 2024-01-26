import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { AddSkillsDTO } from '../data/skills.dto';
import { SkillsService } from './skills.service';

@Controller('pds/skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post(':employee_id')
  async addSkills(@Param('employee_id') employeeId: string, @Body() skillsDTO: AddSkillsDTO) {
    return await this.skillsService.addSkills(employeeId, skillsDTO);
  }

  @Put(':employee_id')
  async updateMadSkillz() {}
}
