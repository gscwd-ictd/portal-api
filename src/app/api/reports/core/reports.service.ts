import { Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeService } from '../../employee/core/employee.service';
import { AuthenticatedUser } from '../../../../utils/types/auth-type';
import { NatureOfAppointment } from '../../employee/utils/employee.type';
import { ReportHalf } from '../utils/reports.type';
import { getDayRange1stHalf, getDayRange2ndHalf } from '../../../../utils/helpers/functions';
import * as dayjs from 'dayjs';
import { DataSource } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(private readonly employeeService: EmployeeService, private readonly dataSource: DataSource) {}

  async generateNightDifferentialReport(
    user: AuthenticatedUser,
    natureOfAppointment: NatureOfAppointment,
    half: ReportHalf,
    year: string,
    month: string,
  ) {
    const employees = await this.employeeService.getEmployeesUnderOtSupervisor(user._id, natureOfAppointment);
    console.log(year, month);
    const numOfDays = dayjs(year + '-' + month + '-01').daysInMonth();
    console.log(numOfDays);
    const days =
      half === ReportHalf.FIRST_HALF
        ? getDayRange1stHalf()
        : half === ReportHalf.SECOND_HALF
        ? getDayRange2ndHalf(numOfDays)
        : [];
    const _month = ('0' + month.toString()).slice(-2);
    const periodCovered =
      dayjs(year + '-' + month + '-1').format('MMMM') + ' ' + days[0] + '-' + days[days.length - 1] + ', ' + year;
    const nightDifferential = await Promise.all(
      employees.map(async (employee) => {
        const { companyId, employeeFullName } = employee;

        const dtrEntries = await this.getDtrEntries(companyId, year, month, days);
        //1. Iterate per kinsenas: get DTR entries of employee per day
        /*  
            Notes on:
             - Make sure that their schedule fall on the 6pm to 6am (partially/wholly)
             - Make sure that it is in regular working hours
             - If the working hour falls on the Night Differential range but within worksuspension hours, 
               it will be considered an overtime
        */
        return { companyId, employeeFullName, dtrEntries };
      }),
    );
    return { periodCovered, nightDifferential };
  }

  private async getDtrEntries(companyId: string, year: string, month: string, dayRange: number[]) {
    try {
      return await this.dataSource.query(
        `
        SELECT 
            DATE_FORMAT(dtr_date,'%d') dtrDay, 
            time_in timeIn, 
            lunch_out lunchOut, 
            lunch_in lunchIn, 
            time_out timeOut, 
            schedule_id_fk 
         FROM employee_monitoring.daily_time_record 
        WHERE 
            YEAR(dtr_date) = ? 
            AND MONTH(dtr_date) = ? 
            AND DATE_FORMAT(dtr_date,'%d') IN (?)
        AND company_id_fk=? ORDER BY dtr_date ASC;
`,
        [year, month, dayRange, companyId],
      );
    } catch (error) {
      console.log(error);
      throw new NotFoundException('no dtr found');
    }
  }
}
