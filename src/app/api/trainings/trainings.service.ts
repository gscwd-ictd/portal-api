import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MicroserviceType } from '../../../utils/types/microservice-type';
import {
  GmApproval,
  GmDecline,
  NomineeTrainingStatusType,
  PdcChairmanApproval,
  PdcChairmanDecline,
  PdcSecretariatApproval,
  PdcSecretariatDecline,
  TrainingListItem,
  TrainingNomination,
  TrainingNominees,
} from './utils/trainings.type';
import { error } from 'console';

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

  async findAllTrainingByEmployeeId(nomineeTrainingStatusType: NomineeTrainingStatusType) {
    try {
      return await lastValueFrom(this.client.send('find_all_training_by_employee_id', nomineeTrainingStatusType));
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

  async pdcChairmanApproval(pdcChairmanApproval: PdcChairmanApproval) {
    try {
      const result = await lastValueFrom(this.client.send('for_pdc_chairman_approval', pdcChairmanApproval));
      if (result.affected > 0) return pdcChairmanApproval;
    } catch (error) {
      Logger.log(error);
      throw new HttpException('An Error has occurred', 500);
    }
  }

  async pdsSecretariatApproval(pdcSecretariatApproval: PdcSecretariatApproval) {
    try {
      const result = await lastValueFrom(this.client.send('for_pdc_secretariat_approval', pdcSecretariatApproval));
      console.log(result);
      if (result.affected > 0) return pdcSecretariatApproval;
    } catch (error) {
      Logger.log(error);
      throw new HttpException('An Error has occurred', 500);
    }
  }
  //find_all_pdc_secretary_approval
  async findAllPdcSecretaryApproval() {
    try {
      return await lastValueFrom(this.client.send('find_all_pdc_secretariat_approval', {}));
    } catch {
      Logger.log(error);
      throw new HttpException('An Error has occurred', 500);
    }
  }

  //
  //for_pdc_secretary_declined , for_pdc_chairman_declined, for_gm_declined

  async pdsSecretariatDecline(pdcSecretariatDecline: PdcSecretariatDecline) {
    try {
      const result = await lastValueFrom(this.client.send('for_pdc_secretariat_declined', pdcSecretariatDecline));
      console.log(result);
      if (result.affected > 0) return pdcSecretariatDecline;
    } catch (error) {
      Logger.log(error);
      throw new HttpException('An Error has occurred', 500);
    }
  }

  async pdsChairmanDecline(pdcChairmanDecline: PdcChairmanDecline) {
    try {
      const result = await lastValueFrom(this.client.send('for_pdc_chairman_declined', pdcChairmanDecline));
      if (result.affected > 0) return pdcChairmanDecline;
    } catch (error) {
      Logger.log(error);
      throw new HttpException('An Error has occurred', 500);
    }
  }

  async findAllPdcChairmanApproval() {
    try {
      return await lastValueFrom(this.client.send('find_all_pdc_chairman_approval', {}));
    } catch {
      Logger.log(error);
      throw new HttpException('An Error has occurred', 500);
    }
  }
  //List of nominees
  async listOfNomineesByDistributionId(trainingListItem: TrainingListItem) {
    try {
      return await lastValueFrom(this.client.send('find_training_nominees_by_distribution_id', trainingListItem));
    } catch {
      Logger.log(error);
      throw new HttpException('An Error has occurred', 500);
    }
  }

  async gmDecline(gmDecline: GmDecline) {
    try {
      const result = await lastValueFrom(this.client.send('for_gm_declined', gmDecline));
      if (result.affected > 0) return gmDecline;
    } catch (error) {
      Logger.log(error);
      throw new HttpException(error, 500);
    }
  }

  async gmApproval(gmApproval: GmApproval) {
    try {
      const result = await lastValueFrom(this.client.send('for_gm_approval', gmApproval));
      if (result.affected > 0) return gmApproval;
    } catch (error) {
      Logger.log(error);
      throw new HttpException(error, 500);
    }
  }

  async findGmApproval() {
    try {
      return await lastValueFrom(this.client.send('find_all_gm_approval', {}));
    } catch {
      Logger.log(error);
      throw new HttpException('An Error has occurred', 500);
    }
  }
}
