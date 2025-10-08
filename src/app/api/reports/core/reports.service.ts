import { Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeService } from '../../employee/core/employee.service';
import { AuthenticatedUser } from '../../../../utils/types/auth-type';
import { EmployeeBasicDetails, NatureOfAppointment } from '../../employee/utils/employee.type';
import { EmployeeDtrSchedEntry, ReportHalf } from '../utils/reports.type';
import { getDayRange1stHalf, getDayRange2ndHalf } from '../../../../utils/helpers/functions';
import * as dayjs from 'dayjs';
import { DataSource } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(private readonly employeeService: EmployeeService, private readonly dataSource: DataSource) {}

  async generateNightDifferentialReport(
    user: AuthenticatedUser,
    half: ReportHalf,
    year: string,
    month: string,
    employees: { employees: EmployeeBasicDetails[] },
  ) {
    const numOfDays = dayjs(year + '-' + month + '-01').daysInMonth();
    const days =
      half === ReportHalf.FIRST_HALF
        ? getDayRange1stHalf()
        : half === ReportHalf.SECOND_HALF
        ? getDayRange2ndHalf(numOfDays)
        : [];
    let totalOfTotalHourlySalary = 0;
    let totalOfTotalNightDifferential = 0;
    const _month = ('0' + month.toString()).slice(-2);
    const assignment = (
      await this.dataSource.query(`SELECT ${process.env.HRMS_DB_NAME}get_employee_assignment_or_oic(?) assignment;`, [
        user._id,
      ])
    )[0].assignment;
    const periodCovered =
      dayjs(year + '-' + month + '-1').format('MMMM') + ' ' + days[0] + '-' + days[days.length - 1] + ', ' + year;
    const nightDifferential = await Promise.all(
      employees.employees.map(async (employee) => {
        const { companyId, employeeFullName, employeeId } = employee;

        const dtrEntries = await this.getDtrEntries(companyId, year, month, days, employeeId);

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
              dtrRemarks,
            } = dtrEntry;
            const salary = (
              await this.dataSource.query(
                `SELECT ${process.env.HRMS_DB_NAME}get_nosi_nosa_salary_grade_amount(?,?) salary;`,
                [employeeId, dtrDate],
              )
            )[0].salary;

            const isHoliday = (
              await this.dataSource.query(`select employee_monitoring.is_holiday(?) isHoliday;`, [dtrDate])
            )[0].isHoliday;
            console.log('remarks', dtrRemarks, 'holiday', isHoliday);
            let timeOutDate = dayjs(dtrDate);
            let nightDifferentialHours = 0;
            if (!dtrRemarks.includes('Rest Day') && !isHoliday) {
              if (shift === 'night') timeOutDate = dayjs(dtrDate).add(1, 'days');

              const currTimeOut = dayjs(
                dayjs(timeOutDate.format('YYYY-MM-DD') + ' ' + timeOut).format('YYYY-MM-DD HH:mm:00'),
              );
              const currTimeIn = dayjs(dayjs(dtrDate + ' ' + timeIn).format('YYYY-MM-DD HH:mm:00'));
              const currSchedTimeIn = dayjs(dtrDate + ' ' + schedTimeIn);
              const currSchedTimeOut = dayjs(timeOutDate.format('YYYY-MM-DD') + ' ' + schedTimeOut);
              const nightDifferentialFrom = dayjs(dtrDate + ' 18:00:00');
              const nightDifferentialTo = dayjs(dayjs(dtrDate).format('YYYY-MM-DD') + ' 06:00:00').add(1, 'day');
              //per day check the night differential
              if (
                (nightDifferentialFrom.isAfter(currSchedTimeIn) || nightDifferentialFrom.isSame(currSchedTimeIn)) &&
                nightDifferentialTo.isAfter(currSchedTimeOut) &&
                nightDifferentialFrom.isBefore(currSchedTimeOut)
              ) {
                // 01:00pm - 06:00pm - 10:00pm - 6:00 am
                if (currTimeOut.isAfter(currSchedTimeOut)) {
                  nightDifferentialHours =
                    Math.round(
                      (Math.round(currSchedTimeOut.diff(nightDifferentialFrom, 'minutes') * 100) / 100 / 60) * 100,
                    ) / 100;
                } else
                  nightDifferentialHours =
                    Math.round(
                      (Math.round(currTimeOut.diff(nightDifferentialFrom, 'minutes') * 100) / 100 / 60) * 100,
                    ) / 100;
              } else if (
                (nightDifferentialFrom.isAfter(currSchedTimeIn) || nightDifferentialFrom.isSame(currSchedTimeIn)) &&
                nightDifferentialTo.isBefore(currSchedTimeOut) &&
                nightDifferentialFrom.isBefore(currSchedTimeOut)
              ) {
                // 01:00pm - 06:00pm - 10:00pm - 6:00 am
                nightDifferentialHours =
                  Math.round(
                    (Math.round(nightDifferentialTo.diff(nightDifferentialFrom, 'minutes') * 100) / 100 / 60) * 100,
                  ) / 100;
              } else if (
                nightDifferentialFrom.isBefore(currSchedTimeIn) &&
                nightDifferentialTo.isBefore(currSchedTimeOut)
              ) {
                //TODO: Add conditions if late or undertimed
                //late
                if (currSchedTimeIn.isBefore(currTimeIn)) {
                  nightDifferentialHours =
                    Math.round((Math.round(nightDifferentialTo.diff(currTimeIn, 'minutes') * 100) / 100 / 60) * 100) /
                    100;
                }
                //on time
                else if (
                  (currSchedTimeIn.isAfter(currTimeIn) || currSchedTimeIn.isSame(currTimeIn)) &&
                  (currSchedTimeOut.isBefore(currTimeOut) || currSchedTimeOut.isSame(currTimeOut))
                ) {
                  console.log(dtrDate, currSchedTimeOut.format('YYYY-MM-DD'), currTimeOut.format('YYYY-MM-DD'));
                  nightDifferentialHours =
                    Math.round(
                      (Math.round(nightDifferentialTo.diff(currSchedTimeIn, 'minutes') * 100) / 100 / 60) * 100,
                    ) / 100;
                }
                //undertime
                else if (
                  (currSchedTimeIn.isAfter(currTimeIn) || currSchedTimeIn.isSame(currTimeIn)) &&
                  currSchedTimeOut.isAfter(currTimeOut)
                ) {
                  if (
                    currTimeOut.isBefore(nightDifferentialTo) &&
                    (currSchedTimeIn.isAfter(currTimeIn) || currSchedTimeIn.isSame(currTimeIn))
                  ) {
                    nightDifferentialHours =
                      Math.round((Math.round(currTimeOut.diff(currSchedTimeIn, 'minutes') * 100) / 100 / 60) * 100) /
                      100;
                  } else
                    nightDifferentialHours =
                      Math.round((Math.round(nightDifferentialTo.diff(currTimeIn, 'minutes') * 100) / 100 / 60) * 100) /
                      100;
                }
                //late and undertime
                if (currSchedTimeIn.isBefore(currTimeIn) && currSchedTimeOut.isAfter(currTimeOut)) {
                  //console.log('late na gani undertime pa gyud', dtrDate);
                  if (currTimeOut.isAfter(nightDifferentialTo)) {
                    console.log('here');
                    nightDifferentialHours =
                      Math.round((Math.round(nightDifferentialTo.diff(currTimeIn, 'minutes') * 100) / 100 / 60) * 100) /
                      100;
                  } else
                    nightDifferentialHours =
                      Math.round((Math.round(currTimeOut.diff(currTimeIn, 'minutes') * 100) / 100 / 60) * 100) / 100;
                }
              }
              //6pm - 08:00pm - 05:00am- 6:00am = 8 hrs
              else if (
                (nightDifferentialFrom.isBefore(currSchedTimeIn) || nightDifferentialFrom.isSame(currSchedTimeIn)) &&
                (nightDifferentialTo.isAfter(currSchedTimeOut) || nightDifferentialTo.isSame(currSchedTimeOut))
              ) {
                if (
                  (currTimeIn.isBefore(currSchedTimeIn) || currTimeIn.isSame(currSchedTimeIn)) &&
                  (currTimeOut.isAfter(currSchedTimeOut) || currTimeOut.isSame(currSchedTimeOut))
                ) {
                  nightDifferentialHours =
                    Math.round((Math.round(currSchedTimeOut.diff(currSchedTimeIn, 'minutes') * 100) / 100 / 60) * 100) /
                    100;
                } else if (
                  (currTimeIn.isBefore(currSchedTimeIn) || currTimeIn.isSame(currSchedTimeIn)) &&
                  currTimeOut.isBefore(currSchedTimeOut)
                ) {
                  nightDifferentialHours =
                    Math.round((Math.round(currTimeOut.diff(currSchedTimeIn, 'minutes') * 100) / 100 / 60) * 100) / 100;
                } else if (
                  currTimeIn.isAfter(currSchedTimeIn) &&
                  (currTimeOut.isAfter(currSchedTimeOut) || currTimeOut.isSame(currSchedTimeOut))
                ) {
                  nightDifferentialHours =
                    Math.round((Math.round(currSchedTimeOut.diff(currTimeIn, 'minutes') * 100) / 100 / 60) * 100) / 100;
                } else if (currTimeIn.isAfter(currSchedTimeIn) && currTimeOut.isBefore(currSchedTimeOut)) {
                  nightDifferentialHours =
                    Math.round((Math.round(currTimeOut.diff(currTimeIn, 'minutes') * 100) / 100 / 60) * 100) / 100;
                }
              }
            }

            return {
              companyId,
              dtrDate,
              dtrId,
              salary,
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

        return {
          companyId,
          employeeFullName,
          dtrEntriesDetails,
        };
      }),
    );

    const nightDifferentialDetails = nightDifferential.flatMap((employee) => {
      return Object.values(
        employee.dtrEntriesDetails.reduce((acc, entry) => {
          if (!acc[entry.salary]) {
            acc[entry.salary] = {
              companyId: employee.companyId,
              employeeFullName: employee.employeeFullName,
              dtrEntriesDetails: [],
            };
          }
          acc[entry.salary].dtrEntriesDetails.push(entry);
          return acc;
        }, {}),
      );
    });

    const nightDifferentialDetailsWithComputation = nightDifferentialDetails.map((nightDiff: any) => {
      const { companyId, employeeFullName, dtrEntriesDetails } = nightDiff;

      let totalNoOfHours = 0;
      let totalHourlySalary = 0;
      const salary = dtrEntriesDetails[0].salary;
      const dailyRate = Math.round((salary / 22) * 100) / 100;
      const hourlyRate = Math.round((dailyRate / 8) * 100) / 100;
      dtrEntriesDetails.map((dtrEntry) => {
        const { nightDifferentialHours } = dtrEntry;
        totalNoOfHours += nightDifferentialHours;
      });
      totalHourlySalary = totalNoOfHours * hourlyRate;

      const totalNightDifferential = Math.round(totalHourlySalary * 0.2 * 100) / 100;

      totalOfTotalHourlySalary += Number.isNaN(totalHourlySalary) ? 0 : totalHourlySalary;
      totalOfTotalNightDifferential += Number.isNaN(totalNightDifferential) ? 0 : totalNightDifferential;

      return {
        companyId,
        employeeFullName,
        dtrEntriesDetails,
        dailyRate,
        hourlyRate,
        totalNoOfHours,
        totalNightDifferential,
      };
    });

    const signatories = (
      await this.dataSource.query(
        `
            SELECT
                emp._id preparedById,
                ${process.env.HRMS_DB_NAME}get_employee_fullname2(emp._id) preparedByName,
                ${process.env.HRMS_DB_NAME}get_employee_position_or_oic(emp._id) preparedByPosition,
                ${process.env.HRMS_DB_NAME}get_employee_signature(emp._id) preparedBySignature,
                ${process.env.HRMS_DB_NAME}get_employee_supervisor(?) checkedById,
                ${process.env.HRMS_DB_NAME}get_employee_fullname2(${process.env.HRMS_DB_NAME}get_employee_supervisor(?)) checkedByName,
                ${process.env.HRMS_DB_NAME}get_employee_position_or_oic(${process.env.HRMS_DB_NAME}get_employee_supervisor(?)) checkedByPosition,
                ${process.env.HRMS_DB_NAME}get_employee_signature(${process.env.HRMS_DB_NAME}get_employee_supervisor(?)) checkedBySignature,
                ${process.env.HRMS_DB_NAME}get_employee_supervisor(${process.env.HRMS_DB_NAME}get_employee_supervisor(?)) approvedById,
                ${process.env.HRMS_DB_NAME}get_employee_fullname2(${process.env.HRMS_DB_NAME}get_employee_supervisor(${process.env.HRMS_DB_NAME}get_employee_supervisor(?))) approvedByName,
                ${process.env.HRMS_DB_NAME}get_employee_position_or_oic(${process.env.HRMS_DB_NAME}get_employee_supervisor(${process.env.HRMS_DB_NAME}get_employee_supervisor(?))) approvedByPosition,
                ${process.env.HRMS_DB_NAME}get_employee_signature(${process.env.HRMS_DB_NAME}get_employee_supervisor(${process.env.HRMS_DB_NAME}get_employee_supervisor(?))) approvedBySignature
            FROM ${process.env.HRMS_DB_NAME}employees emp WHERE emp._id=?;
        
          `,
        [user._id, user._id, user._id, user._id, user._id, user._id, user._id, user._id, user._id],
      )
    )[0];

    return {
      periodCovered,
      assignment,
      nightDifferentialDetailsWithComputation,
      totalOfTotalHourlySalary: (Math.round(totalOfTotalHourlySalary * 100) / 100).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      totalOfTotalNightDifferential: (Math.round(totalOfTotalNightDifferential * 100) / 100).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      signatories,
    };
  }

  private async getDtrEntries(
    companyId: string,
    year: string,
    month: string,
    dayRange: number[],
    employeeId: string,
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
                  sched.shift shift,
                  employee_monitoring.get_dtr_remarks(?,DATE_FORMAT(dtr.dtr_date,'%Y-%m-%d'),?) dtrRemarks
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
        [employeeId, companyId, year, month, dayRange, companyId, year, month, dayRange, companyId],
      );
    } catch (error) {
      console.log(error);
      throw new NotFoundException('no DTR found');
    }
  }
}
