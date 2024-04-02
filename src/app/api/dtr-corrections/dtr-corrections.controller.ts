import { Controller, Get, UseGuards } from '@nestjs/common';
import { DtrCorrectionsService } from './dtr-corrections.service';
import { AuthenticatedGuard } from '../../../global/guards/authenticated.guard';
import { AuthenticatedUser } from '../../../utils/types/auth-type';
import { User } from '../../../global/decorators/user.decorator';

@Controller('dtr-corrections')
export class DtrCorrectionsController {
  constructor(private readonly dtrCorrectionsService: DtrCorrectionsService) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  async getAllDtrCorrections(@User() user: AuthenticatedUser) {
    return await this.dtrCorrectionsService.getAllDtrCorrections(user);
  }
}
