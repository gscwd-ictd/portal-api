import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { UpdateLeaveApplicationHrdmStatusDto } from '../data/leave-application-status.dto';
import { AuthenticatedUser } from '../../../../utils/types/auth-type';
import { LeaveApplicationsService } from './leave-applications.service';
import { AuthenticatedGuard } from '../../../../global/guards/authenticated.guard';
import { User } from '../../../../global/decorators/user.decorator';

@Controller('leave-application')
export class LeaveApplicationController {
  constructor(private readonly leaveApplicationService: LeaveApplicationsService) {}

  @UseGuards(AuthenticatedGuard)
  @Patch()
  async updateHrdmLeaveApprovalStatus(
    @Body() updateHrmoLeaveApprovalStatus: UpdateLeaveApplicationHrdmStatusDto,
    @User() user: AuthenticatedUser,
  ) {
    return await this.leaveApplicationService.updateHrdmLeaveApprovalStatus(updateHrmoLeaveApprovalStatus, user);
  }
}
