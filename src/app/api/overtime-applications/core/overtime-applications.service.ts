import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AuthenticatedUser } from '../../../../utils/types/auth-type';
import { MicroserviceType } from '../../../../../src/utils/types/microservice-type';

@Injectable()
export class OvertimeApplicationService {
  constructor(@Inject(MicroserviceType.EMPLOYEE_MONITORING) private readonly client: ClientProxy) {}

  async getPendingOvertimeApplicationApprovalCount(user: AuthenticatedUser) {
    const { _id } = user;
    return await lastValueFrom(this.client.send('get_overtime_approvals_count', _id));
  }
}
