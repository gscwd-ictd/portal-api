import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MicroserviceType } from '../../../../utils/types/microservice-type';
import { AuthenticatedUser } from '../../../../utils/types/auth-type';
import { UpdateLeaveApplicationHrdmStatusDto } from '../data/leave-application-status.dto';

@Injectable()
export class LeaveApplicationsService {
  constructor(@Inject(MicroserviceType.EMPLOYEE_MONITORING) private readonly client: ClientProxy) { }

  async getForHrdmApprovalCount(user: AuthenticatedUser) {
    const employeeId = user._id;
    return await lastValueFrom(this.client.send('get_leave_for_hrdm_approval', {}));
  }

  async updateHrdmLeaveApprovalStatus(
    updateHrdmLeaveApprovalStatus: UpdateLeaveApplicationHrdmStatusDto,
    user: AuthenticatedUser,
  ) {
    const employeeId = user._id;
    const updateResult = await lastValueFrom(
      this.client.send('update_hrdm_leave_approval_status', {
        ...updateHrdmLeaveApprovalStatus,
        hrdmApprovedBy: employeeId,
        hrdmApprovalDate: new Date(),
      }),
    );

    return updateHrdmLeaveApprovalStatus;
  }
}
