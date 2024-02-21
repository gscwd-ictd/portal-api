import { Body, Controller, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { TrainingsService } from './trainings.service';
import {
  GmApproval,
  GmDecline,
  NomineeType,
  PdcChairmanApproval,
  PdcChairmanDecline,
  PdcSecretariatApproval,
  PdcSecretariatDecline,
  TrainingNomination,
  TrainingNominationStatus,
  TrainingNominees,
} from './utils/trainings.type';
import { GmGuard, PdcChairmanGuard, PdcSecretaryGuard } from './guards/training.guard';
import { EmployeeService } from '../employee/core/employee.service';

@Controller('trainings')
export class TrainingsController {
  constructor(private readonly trainingsService: TrainingsService, private readonly employeeService: EmployeeService) {}

  @Get('/supervisors/:supervisor_id')
  async findTrainingDistributionBySupervisorId(@Param('supervisor_id') supervisorId: string) {
    return await this.trainingsService.findTrainingDistributionBySupervisorId(supervisorId);
  }

  @Get('distributions/:training_distribution_id/recommended')
  async findTrainingRecommendedEmployeesByDistributionId(@Param('training_distribution_id') distributionId: string) {
    return await this.trainingsService.findTrainingRecommendedEmployeesByDistributionId(distributionId);
  }

  @Get('employees/:employee_id')
  async findAllTrainingByEmployeeId(
    @Param('employee_id') employeeId: string,
    @Query('status') status: TrainingNominationStatus,
  ) {
    return await this.trainingsService.findAllTrainingByEmployeeId({ employeeId, status });
  }

  @Put('')
  async updateTrainingNomineesStatusById(@Body() trainingNomination: TrainingNomination) {
    return await this.trainingsService.updateTrainingNomineesStatusById(trainingNomination);
  }

  @Post('nominees/')
  async sendNomineesToHr(@Body() nominees: TrainingNominees) {
    return await this.trainingsService.sendNomineesToHr(nominees);
  }

  @UseGuards(PdcChairmanGuard)
  @Patch('approval/chairman')
  async pdcChairmanApproval(@Body() pdcChairmanApproval: PdcChairmanApproval) {
    return await this.trainingsService.pdcChairmanApproval(pdcChairmanApproval);
  }

  @UseGuards(PdcChairmanGuard)
  @Patch('decline/chairman')
  async pdcChairmanDecline(@Body() pdcChairmanDecline: PdcChairmanDecline) {
    return await this.trainingsService.pdsChairmanDecline(pdcChairmanDecline);
  }

  @UseGuards(PdcSecretaryGuard)
  @Patch('approval/secretariat')
  async pdcSecretariatApproval(@Body() pdcSecretariatApproval: PdcSecretariatApproval) {
    return await this.trainingsService.pdsSecretariatApproval(pdcSecretariatApproval);
  }

  @UseGuards(PdcSecretaryGuard)
  @Patch('decline/secretariat')
  async pdcSecretariatDecline(@Body() pdcSecretariatDecline: PdcSecretariatDecline) {
    return await this.trainingsService.pdsSecretariatDecline(pdcSecretariatDecline);
  }

  @UseGuards(PdcChairmanGuard)
  @Get('approval/chairman')
  async findPdcChairmanApproval() {
    return await this.trainingsService.findAllPdcChairmanApproval();
  }

  @UseGuards(PdcSecretaryGuard)
  @Get('approval/secretariat')
  async findPdcSecretariatApproval() {
    return await this.trainingsService.findAllPdcSecretaryApproval();
  }

  @Get('/nominees/:distribution_id/')
  async getNominees(@Param('distribution_id') distributionId: string, @Query('nominee_type') nomineeType: NomineeType) {
    return await this.trainingsService.listOfNomineesByDistributionId({
      nomineeType,
      distributionId,
    });
  }

  @UseGuards(GmGuard)
  @Get('approval/gm')
  async findGmApproval() {
    return await this.trainingsService.findGmApproval();
  }

  @UseGuards(GmGuard)
  @Patch('approval/gm')
  async gmApproval(@Body() gmApproval: GmApproval) {
    return await this.trainingsService.gmApproval(gmApproval);
  }

  @UseGuards(GmGuard)
  @Patch('decline/gm')
  async gmDecline(@Body() gmDecline: GmDecline) {
    return await this.trainingsService.gmDecline(gmDecline);
    //
  }
}
