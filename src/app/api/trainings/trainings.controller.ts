import { Controller, Get, Param } from '@nestjs/common';
import { TrainingsService } from './trainings.service';

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
}
