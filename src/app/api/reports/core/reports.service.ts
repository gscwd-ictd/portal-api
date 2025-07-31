import { Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeService } from '../../employee/core/employee.service';
import { AuthenticatedUser } from '../../../../utils/types/auth-type';
import { NatureOfAppointment } from '../../employee/utils/employee.type';
import { EmployeeDtrSchedEntry, ReportHalf } from '../utils/reports.type';
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
    console.log(employees);
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
        const { companyId, employeeFullName, salary } = employee;
        const dailyRate = Math.round((salary / 22) * 100) / 100;
        const hourlyRate = Math.round((dailyRate / 8) * 100) / 100;
        const dtrEntries = await this.getDtrEntries(companyId, year, month, days);
        let totalNoOfHours = 0;
        let totalHourlySalary = 0;
        const dtrEntriesDetails = await Promise.all(
          dtrEntries.map(async (dtrEntry) => {
            const {
              companyId,
              dtrDate,
              dtrId,
              lunchIn,
              lunchOut,
              schedLunchIn,
              schedLunchOut,
              schedTimeIn,
              schedTimeOut,
              shift,
              timeIn,
              timeOut,
            } = dtrEntry;
            let timeOutDate = dayjs(dtrDate);
            if (shift === 'night') timeOutDate = dayjs(dtrDate).add(1, 'D');

            const currTimeOut = dayjs(
              dayjs(timeOutDate.format('YYYY-MM-DD') + ' ' + timeOut).format('YYYY-MM-DD HH:mm:00'),
            );
            //console.log(currTimeOut.format('YYYY-MM-DD HH:mm'));
            const currTimeIn = dayjs(dayjs(dtrDate + ' ' + timeIn).format('YYYY-MM-DD HH:mm:00'));
            const currSchedTimeIn = dayjs(dtrDate + ' ' + schedTimeIn);
            const currSchedTimeOut = dayjs(timeOutDate.format('YYYY-MM-DD') + ' ' + schedTimeOut);
            const nightDifferentialFrom = dayjs(dtrDate + ' 18:00:00');
            const nightDifferentialTo = dayjs(dayjs(dtrDate).add(1, 'D').format('YYYY-MM-DD') + ' 06:00:00');
            //per day check the night differential
            let nightDifferentialHours = 0;
            if (
              (currTimeIn.isBefore(currSchedTimeIn) || currTimeIn.isSame(currSchedTimeIn)) &&
              (currTimeOut.isAfter(currSchedTimeOut) || currTimeIn.isSame(currSchedTimeOut)) &&
              (currTimeIn.isBefore(nightDifferentialFrom) || currTimeIn.isSame(currSchedTimeIn)) &&
              (currTimeOut.isAfter(nightDifferentialTo) || currTimeIn.isSame(nightDifferentialTo))
            ) {
              nightDifferentialHours = 8;
            } else {
              //
            }
            totalNoOfHours += nightDifferentialHours;
            return {
              companyId,
              dtrDate,
              dtrId,
              lunchIn,
              lunchOut,
              schedLunchIn,
              schedLunchOut,
              schedTimeIn,
              schedTimeOut,
              shift,
              timeIn,
              timeOut,
              nightDifferentialHours,
            };
          }),
        );

        //1. Iterate per kinsenas: get DTR entries of employee per day
        /*  
            Notes on:
             - Make sure that their schedule fall on the 6pm to 6am (partially/wholly)
             - Make sure that it is in regular working hours
             - If the working hour falls on the Night Differential range but within worksuspension hours, 
               it will be considered an overtime
        */
        return { companyId, employeeFullName, dtrEntriesDetails, hourlyRate, dailyRate };
      }),
    );
    return { periodCovered, nightDifferential };
  }

  private async getDtrEntries(
    companyId: string,
    year: string,
    month: string,
    dayRange: number[],
  ): Promise<EmployeeDtrSchedEntry[]> {
    try {
      return await this.dataSource.query(
        `SELECT DISTINCT
                dtr.daily_time_record_id dtrId,
                dtr.company_id_fk companyId,
                DATE_FORMAT(dtr.dtr_date,'%Y-%m-%d') dtrDate,
                dtr.time_in timeIn,
                dtr.lunch_out lunchOut,
                dtr.lunch_in lunchIn,
                dtr.time_out timeOut,
                sched.time_in schedTimeIn,
                sched.time_out schedTimeOut,
                sched.lunch_in schedLunchIn,
                sched.lunch_out schedLunchOut,
                sched.shift shift
            FROM employee_monitoring.daily_time_record dtr INNER JOIN (
                (SELECT dtr.dtr_date, count(dtr.dtr_date) dtrCount 
                    FROM employee_monitoring.daily_time_record dtr WHERE
                    (
                        YEAR(dtr.dtr_date) = ?
                        AND MONTH(dtr.dtr_date) = ?
                        AND DATE_FORMAT(dtr.dtr_date,'%d')
                        IN (?)
                    )
                AND company_id_fk = ? GROUP BY dtr_date)
            ) dtrAndCount ON dtrAndCount.dtr_date = dtr.dtr_date
            INNER JOIN employee_monitoring.schedule sched ON sched.schedule_id = dtr.schedule_id_fk
            WHERE (
                        YEAR(dtr.dtr_date) = ?
                        AND MONTH(dtr.dtr_date) = ?
                        AND DATE_FORMAT(dtr.dtr_date,'%d')
                        IN (?)
            ) AND dtr.company_id_fk = ? AND not (dtrAndCount.dtrCount > 1 AND dtr.time_out IS NULL) 
            ORDER BY dtrDate ASC;`,
        [year, month, dayRange, companyId, year, month, dayRange, companyId],
      );
    } catch (error) {
      console.log(error);
      throw new NotFoundException('no DTR found');
    }
  }
}
