import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MicroserviceType } from '../../../utils/types/microservice-type';

@Injectable()
export class TrainingsService {
  constructor(@Inject(MicroserviceType.LND) private readonly client: ClientProxy) {}
  //find_training_recommended_employee_by_supervisor_id
  async findTrainingRecommendedByEmployeeBySupervisorId(supervisorId: string) {
    try {
      console.log('supervisor id', supervisorId);
      const result = await lastValueFrom(
        this.client.send('find_training_recommended_employee_by_supervisor_id', supervisorId),
      );
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
