import { Body, Controller, Delete, HttpException, UseGuards } from '@nestjs/common';
import { OvertimeApplicationService } from './overtime-applications.service';
import { DeleteOvertimeEmployeeDto } from '../data/overtime-employee.dto';
import { User } from '../../../../global/decorators/user.decorator';
import { AuthenticatedUser } from '../../../../utils/types/auth-type';
import { AuthenticatedGuard } from '../../../../global/guards/authenticated.guard';

@UseGuards(AuthenticatedGuard)
@Controller('overtime-applications')
export class OvertimeApplicationsController {
  constructor(private readonly overtimeApplicationService: OvertimeApplicationService) {}

  @Delete('employee')
  async deleteOvertimeEmployee(
    @Body() deleteOvertimeEmployeeDto: DeleteOvertimeEmployeeDto,
    @User() user: AuthenticatedUser,
  ) {
    try {
      return await this.overtimeApplicationService.deleteOvertimeEmployee(deleteOvertimeEmployeeDto, user);
    } catch ({ error }) {
      throw new HttpException(error.message, error.code);
    }
  }
}
