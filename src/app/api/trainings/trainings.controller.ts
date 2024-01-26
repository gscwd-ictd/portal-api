import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { TrainingsService } from './trainings.service';
import { TrainingNomination, TrainingNominees } from './utils/trainings.type';

@Controller('trainings')
export class TrainingsController {
  constructor(private readonly trainingsService: TrainingsService) {}

  @Get('/supervisors/:supervisor_id')
  async findTrainingDistributionBySupervisorId(@Param('supervisor_id') supervisorId: string) {
    return await this.trainingsService.findTrainingDistributionBySupervisorId(supervisorId);
  }

  @Get('distributions/:training_distribution_id/recommended')
  async findTrainingRecommendedEmployeesByDistributionId(@Param('training_distribution_id') distributionId: string) {
    return await this.trainingsService.findTrainingRecommendedEmployeesByDistributionId(distributionId);
  }

  @Get('employees/:employee_id')
  async findAllTrainingByEmployeeId(@Param('employee_id') employeeId: string) {
    return await this.trainingsService.findAllTrainingByEmployeeId(employeeId);
  }

  @Put('')
  async updateTrainingNomineesStatusById(@Body() trainingNomination: TrainingNomination) {
    return await this.trainingsService.updateTrainingNomineesStatusById(trainingNomination);
  }

  @Post('nominees/')
  async sendNomineesToHr(@Body() nominees: TrainingNominees) {
    return await this.trainingsService.sendNomineesToHr(nominees);
  }
}
