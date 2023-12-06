import {
  DeleteLearningDevelopmentDTO,
  LearningDevelopmentDTO,
  AddLearningDevelopmentDTO,
} from './../data/learning-development.dto';
import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { UpdateLearningDevelopmentDTO } from '../data/learning-development.dto';
import { LearningDevelopmentService } from './learning-development.service';

@Controller('pds/learning-development')
export class LearningDevelopmentController {
  constructor(private readonly learningDevelopmentService: LearningDevelopmentService) {}

  @Put()
  async updateLearningAndDevelopment(updateLearningAndDevelopmentDTO: UpdateLearningDevelopmentDTO) {
    return await this.learningDevelopmentService.updateLearningAndDevelopment(updateLearningAndDevelopmentDTO);
  }

  @Delete(':learning_development_id')
  async deleteLearningDevelopment(@Param('learning_development_id') _id: string) {
    return await this.learningDevelopmentService.deleteLearningAndDevelopment2(_id);
  }

  @Post(':employee_id')
  async addLearningDevelopment(
    @Param('employee_id') employeeId: string,
    @Body() learningDevelopmentDTO: AddLearningDevelopmentDTO,
  ) {
    return await this.learningDevelopmentService.addLearningAndDevelopment(employeeId, learningDevelopmentDTO);
  }
}
