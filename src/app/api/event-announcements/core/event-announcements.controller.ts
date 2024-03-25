import { Controller, Get, UseGuards } from '@nestjs/common';
import { EventsAnnouncementsService } from './event-announcements.service';
import { AuthenticatedGuard } from '../../../../global/guards/authenticated.guard';

@Controller('event-announcements')
export class EventsAnnouncementsController {
  constructor(private readonly eventsAnnouncementsService: EventsAnnouncementsService) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  async getEventsAnnouncements() {
    return await this.eventsAnnouncementsService.getEventsAnnouncements();
  }
}
