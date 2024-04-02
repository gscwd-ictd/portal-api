import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MicroserviceType } from '../../../../utils/types/microservice-type';

@Injectable()
export class EventsAnnouncementsService {
  constructor(@Inject(MicroserviceType.EMPLOYEE_MONITORING) private readonly client: ClientProxy) {}

  async getEventsAnnouncements() {
    return await lastValueFrom(this.client.send('get_events_announcements', {}));
  }
}
