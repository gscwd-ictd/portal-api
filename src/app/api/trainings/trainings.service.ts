import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MicroserviceType } from '../../../utils/types/microservice-type';
import { TrainingNomination, TrainingNominees } from './utils/trainings.type';

@Injectable()
export class TrainingsService {
  constructor(@Inject(MicroserviceType.LND) private readonly client: ClientProxy) {}
  //find_training_recommended_employee_by_supervisor_id
  async findTrainingDistributionBySupervisorId(supervisorId: string) {
    try {
      console.log('supervisor id', supervisorId);
      const result = await lastValueFrom(this.client.send('find_training_distribution_by_supervisor_id', supervisorId));
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async findTrainingRecommendedEmployeesByDistributionId(distributionId: string) {
    try {
      const result = await lastValueFrom(
        this.client.send('find_training_recommended_employees_by_distribution_id', distributionId),
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async findAllTrainingByEmployeeId(employeeId: string) {
    try {
      return await lastValueFrom(this.client.send('find_all_training_by_employee_id', employeeId));
    } catch (error) {
      console.log(error);
    }
  }

  async updateTrainingNomineesStatusById(trainingNomination: TrainingNomination) {
    try {
      const result = await lastValueFrom(this.client.send('update_training_nominees_status_by_id', trainingNomination));
      if (result.affected > 0) return trainingNomination;
    } catch (error) {
      Logger.log(error);
      throw new HttpException('An Error has occurred', 500);
    }
  }

  async sendNomineesToHr(trainingNominees: TrainingNominees) {
    return await lastValueFrom(this.client.send('add_nominees_by_training_distribution_id', trainingNominees));
  }
}
