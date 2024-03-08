import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MicroserviceType } from '../../../utils/types/microservice-type';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PassSlipsService {
  constructor(
    @Inject(MicroserviceType.EMPLOYEE_MONITORING)
    private readonly clientEms: ClientProxy,
  ) {}

  async getUsedPassSlipsCountByEmployeeId(employeeId: string) {
    return await lastValueFrom(this.clientEms.send('get_number_of_used_pass_slips', employeeId));
  }
}
