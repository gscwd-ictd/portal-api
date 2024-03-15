import { Controller, Get, UseGuards } from '@nestjs/common';
import { PassSlipsService } from './pass-slips.service';
import { User } from '../../../global/decorators/user.decorator';
import { AuthenticatedUser } from '../../../utils/types/auth-type';
import { AuthenticatedGuard } from '../../../global/guards/authenticated.guard';

@Controller('pass-slips')
export class PassSlipsController {
  constructor(private readonly passSlipsService: PassSlipsService) {}

  @UseGuards(AuthenticatedGuard)
  @Get('used/count')
  async getUsedPassSlipsCountByEmployeeId(@User() user: AuthenticatedUser) {
    return await this.passSlipsService.getUsedPassSlipsCountByEmployeeId(user._id);
    //test
  }
}
