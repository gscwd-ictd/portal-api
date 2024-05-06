import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsNotificationsService } from './stats-notifications.service';
import { User } from '../../../global/decorators/user.decorator';
import { AuthenticatedUser } from '../../../utils/types/auth-type';
import { AuthenticatedGuard } from '../../../global/guards/authenticated.guard';

@Controller('stats-notifications')
export class StatsNotificationsController {
  constructor(private readonly statsNotificationService: StatsNotificationsService) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  async getForApprovalNotifications(@User() user: AuthenticatedUser) {
    return await this.statsNotificationService.getForApprovalNotifications(user);
  }
}
