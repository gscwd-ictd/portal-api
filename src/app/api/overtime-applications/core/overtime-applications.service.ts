import { Body, HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AuthenticatedUser } from '../../../../utils/types/auth-type';
import { MicroserviceType } from '../../../../../src/utils/types/microservice-type';
import { DeleteOvertimeEmployeeDto, UpdateOvertimeApplicationDto } from '../data/overtime-employee.dto';

@Injectable()
export class OvertimeApplicationService {
  constructor(@Inject(MicroserviceType.EMPLOYEE_MONITORING) private readonly client: ClientProxy) {}

  async getPendingOvertimeApplicationApprovalCount(user: AuthenticatedUser) {
    const { _id } = user;
    return await lastValueFrom(this.client.send('get_overtime_approvals_count', _id));
  }

  async deleteOvertimeEmployeeByImmediateSupervisor(
    deleteOvertimeEmployeeDto: DeleteOvertimeEmployeeDto,
    user: AuthenticatedUser,
  ) {
    const result = await lastValueFrom(
      this.client.send('delete_overtime_employee_by_immediate_supervisor', {
        ...deleteOvertimeEmployeeDto,
        immediateSupervisorEmployeeId: user._id,
      }),
    );
    return result;
  }

  async deleteOvertimeEmployeeByManager(deleteOvertimeEmployeeDto: DeleteOvertimeEmployeeDto, user: AuthenticatedUser) {
    const result = await lastValueFrom(
      this.client.send('delete_overtime_employee_by_manager', { ...deleteOvertimeEmployeeDto, managerId: user._id }),
    );
    return result;
  }

  async updateOvertimeDetails(
    @Body() updateOvertimeApplicationDto: UpdateOvertimeApplicationDto,
    user: AuthenticatedUser,
  ) {
    const result = await lastValueFrom(
      this.client.send('update_overtime_details', { ...updateOvertimeApplicationDto, employeeId: user._id }),
    );
    if (Number(result.status) === 403) {
      throw new HttpException(
        {
          message: result.message,
        },
        403,
      );
    }
    return result;
  }
}
