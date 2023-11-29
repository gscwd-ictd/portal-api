import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../../../../global/guards/authenticated.guard';
import { PendingUserService } from './pending-user.service';

@UseGuards(AuthenticatedGuard)
@Controller('pending-users')
export class PendingUserController {
  constructor(private readonly pendingUserService: PendingUserService) {}

  @Get('/:id')
  async findPendingUserByUserId(@Param('id') userId: string) {
    console.log('USER ID', userId);
    return await this.pendingUserService.findPendingUserByUserId(userId);
  }

  @Get('verify/:id')
  async verifyPendingUser(@Param('id') userId: string) {
    return await this.pendingUserService.verifyPendingUserToken(userId);
  }
}
