import { Body, Controller, Delete, HttpException, Put, UseGuards } from '@nestjs/common';
import { OvertimeApplicationService } from './overtime-applications.service';
import { DeleteOvertimeEmployeeDto, UpdateOvertimeApplicationDto } from '../data/overtime-employee.dto';
import { User } from '../../../../global/decorators/user.decorator';
import { AuthenticatedUser } from '../../../../utils/types/auth-type';
import { AuthenticatedGuard } from '../../../../global/guards/authenticated.guard';

@UseGuards(AuthenticatedGuard)
@Controller('overtime-applications')
export class OvertimeApplicationsController {
  constructor(private readonly overtimeApplicationService: OvertimeApplicationService) {}

  @Delete('employee/immediate-supervisor')
  async deleteOvertimeEmployeeByImmediateSupervisor(
    @Body() deleteOvertimeEmployeeDto: DeleteOvertimeEmployeeDto,
    @User() user: AuthenticatedUser,
  ) {
    try {
      return await this.overtimeApplicationService.deleteOvertimeEmployeeByImmediateSupervisor(
        deleteOvertimeEmployeeDto,
        user,
      );
    } catch ({ error }) {
      throw new HttpException(error.message, error.code);
    }
  }

  @Delete('employee/manager')
  async deleteOvertimeEmployeeByManager(
    @Body() deleteOvertimeEmployeeDto: DeleteOvertimeEmployeeDto,
    @User() user: AuthenticatedUser,
  ) {
    try {
      return await this.overtimeApplicationService.deleteOvertimeEmployeeByManager(deleteOvertimeEmployeeDto, user);
    } catch ({ error }) {
      throw new HttpException(error.message, error.code);
    }
  }

  @Put('')
  async updateOvertimeDetails(
    @Body() updateOvertimeApplicationDto: UpdateOvertimeApplicationDto,
    @User() user: AuthenticatedUser,
  ) {
    return await this.overtimeApplicationService.updateOvertimeDetails(updateOvertimeApplicationDto, user);
  }
}
