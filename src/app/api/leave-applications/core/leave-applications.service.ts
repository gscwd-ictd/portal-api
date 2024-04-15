import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MicroserviceType } from '../../../../utils/types/microservice-type';
import { AuthenticatedUser } from 'src/utils/types/auth-type';

@Injectable()
export class LeaveApplicationsService {
  constructor(@Inject(MicroserviceType.EMPLOYEE_MONITORING) private readonly client: ClientProxy) {}

  async getForHrdmApprovalCount(user: AuthenticatedUser) {
    const employeeId = user._id;
    return await lastValueFrom(this.client.send('get_leave_for_hrdm_approval', {}));
  }
}
