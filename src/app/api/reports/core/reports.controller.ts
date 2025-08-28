import { Body, Controller, Param, Post, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { User } from '../../../../global/decorators/user.decorator';
import { AuthenticatedUser } from '../../../../utils/types/auth-type';
import { EmployeeBasicDetails, NatureOfAppointment } from '../../employee/utils/employee.type';
import { ReportHalf } from '../utils/reports.type';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('night-differential/:year/:month')
  async generateNightDifferentialReport(
    @User() user: AuthenticatedUser,
    @Param('year') year: string,
    @Param('month') month: string,
    @Query('half') half: ReportHalf,
    @Body() employees: { employees: EmployeeBasicDetails[] },
  ) {
    return await this.reportsService.generateNightDifferentialReport(user, half, year, month, employees);
  }
}
