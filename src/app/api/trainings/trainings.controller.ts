import { Controller, Get, Param } from '@nestjs/common';
import { TrainingsService } from './trainings.service';

@Controller('trainings')
export class TrainingsController {
  constructor(private readonly trainingsService: TrainingsService) {}

  @Get('/supervisors/:supervisor_id')
  async findTrainingRecommendedByEmployeeBySupervisorId(@Param('supervisor_id') supervisorId: string) {
    return await this.trainingsService.findTrainingRecommendedByEmployeeBySupervisorId(supervisorId);
  }
}
