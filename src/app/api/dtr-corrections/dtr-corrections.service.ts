import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AuthenticatedUser } from '../../../utils/types/auth-type';
import { MicroserviceType } from '../../../utils/types/microservice-type';

@Injectable()
export class DtrCorrectionsService {
  constructor(
    @Inject(MicroserviceType.EMPLOYEE_MONITORING)
    private readonly clientEms: ClientProxy,
  ) {}

  async getAllDtrCorrections(user: AuthenticatedUser) {
    return await lastValueFrom(this.clientEms.send('get_all_dtr_corrections', user._id));
  }

  async getPendingDtrCorrections(user: AuthenticatedUser) {
    return await lastValueFrom(this.clientEms.send('get_pending_dtr_corrections_for_approval', user._id));
  }
}
