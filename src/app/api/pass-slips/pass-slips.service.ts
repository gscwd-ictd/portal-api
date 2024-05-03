import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MicroserviceType } from '../../../utils/types/microservice-type';
import { lastValueFrom } from 'rxjs';
import { EmployeeService } from '../employee/core/employee.service';

@Injectable()
export class PassSlipsService {
  constructor(
    @Inject(MicroserviceType.EMPLOYEE_MONITORING)
    private readonly clientEms: ClientProxy,
    private readonly employeesService: EmployeeService,
  ) {}

  async getUsedPassSlipsCountByEmployeeId(employeeId: string) {
    return await lastValueFrom(this.clientEms.send('get_number_of_used_pass_slips', employeeId));
  }

  //get_assignable_supervisors_for_pass_slip
  async getAssignableSupervisorsForPassSlip(employeeId: string) {
    const employeeDetails = await this.employeesService.getEmployeeDetailsFromHr(employeeId);
    const orgId = employeeDetails.assignment.id;
    return await lastValueFrom(this.clientEms.send('get_assignable_supervisors_for_pass_slip', { employeeId, orgId }));
  }
}
