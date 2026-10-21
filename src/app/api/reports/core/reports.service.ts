import { Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeService } from '../../employee/core/employee.service';
import { AuthenticatedUser } from '../../../../utils/types/auth-type';
import { EmployeeBasicDetails, NatureOfAppointment } from '../../employee/utils/employee.type';
import { EmployeeDtrSchedEntry, ReportHalf } from '../utils/reports.type';
import { getDayRange1stHalf, getDayRange2ndHalf } from '../../../../utils/helpers/functions';
import * as dayjs from 'dayjs';
import { DataSource } from 'typeorm';
import { computeNightDifferential, resolveDailyRate } from '../utils/night-differential.util';

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
        const overtimesByDate = await this.getApprovedOvertimesByDate(employeeId, year, month, days);

        // approved OT on dates without a DTR entry (e.g. rest day) still earns ND
        const dtrDates = new Set(dtrEntries.map((e) => e.dtrDate as unknown as string));
        for (const otDate of overtimesByDate.keys()) {
          if (!dtrDates.has(otDate))
            dtrEntries.push({
              dtrId: null,
              companyId,
              dtrDate: otDate as unknown as Date,
              timeIn: null,
              lunchOut: null,
              lunchIn: null,
              timeOut: null,
              schedTimeIn: null,
              schedTimeOut: null,
              schedLunchIn: null,
              schedLunchOut: null,
              shift: null,
              dtrRemarks: 'Rest Day',
            });
        }

        const dtrEntriesDetails = await Promise.all(
          dtrEntries.map(async (dtrEntry) => {
            const {
              companyId,
              dtrDate: _dtrDate,
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
            const dtrDate = _dtrDate as unknown as string;
            // permanent / casual: monthly salary grade amount; job order: NOSI/NOSA daily rate
            const { salaryGradeAmount, nosiDailyRate } = (
              await this.dataSource.query(
                `SELECT ${process.env.HRMS_DB_NAME}get_nosi_nosa_salary_grade_amount(?,?) salaryGradeAmount,
                        ${process.env.HRMS_DB_NAME}get_nosi_nosa_daily_rate(?,?) nosiDailyRate;`,
                [employeeId, dtrDate, employeeId, dtrDate],
              )
            )[0];
            const dailyRate = resolveDailyRate(salaryGradeAmount, nosiDailyRate);
            const salary = dailyRate;

            // const isHoliday = (
            //   await this.dataSource.query(`select employee_monitoring.is_holiday(?) isHoliday;`, [dtrDate])
            // )[0].isHoliday;

            // console.log('remarks', dtrRemarks, 'holiday', isHoliday);

            const remarks = dtrRemarks ?? '';
            const nd = computeNightDifferential({
              dtrDate,
              schedTimeIn,
              schedTimeOut,
              timeIn,
              timeOut,
              // holidays and work suspension days earn ND for worked hours only
              isRestDayOrLeave: remarks.includes('Rest Day') || remarks.includes('Leave'),
              overtimes: overtimesByDate.get(dtrDate) ?? [],
            });
            const nightDifferentialHours = nd.totalNdHours;
            const otNightDifferentialHours = Math.round((nd.otNdMinutes / 60) * 100) / 100;

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
              otNightDifferentialHours,
            };
          }),
        );

        //1. Iterate per kinsenas: get DTR entries of employee per day
        /*  
            Notes on:
             - Make sure that their schedule fall on the 6pm to 6am (partially/wholly)
             - Make sure that it is in regular working hours
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
      // entries are grouped by daily rate (a rate change mid-period gives one line per rate)
      const dailyRate = Number(dtrEntriesDetails[0].salary) || 0;
      const hourlyRate = dailyRate / 8;

      dtrEntriesDetails.map((dtrEntry) => {
        const { nightDifferentialHours } = dtrEntry;
        totalNoOfHours += nightDifferentialHours;
      });
      totalHourlySalary = totalNoOfHours * hourlyRate;

      //const totalNightDifferential = Math.round(totalHourlySalary * 0.2 * 100) / 100;
      const totalNightDifferential = totalHourlySalary * 0.2;

      totalOfTotalHourlySalary += Number.isNaN(totalHourlySalary) ? 0 : totalHourlySalary;
      totalOfTotalNightDifferential += Number.isNaN(totalNightDifferential) ? 0 : totalNightDifferential;

      return {
        companyId,
        employeeFullName,
        dtrEntriesDetails,
        dailyRate: Math.round(dailyRate * 100) / 100,
        hourlyRate: Math.round(hourlyRate * 100) / 100,
        totalNoOfHours,
        totalNightDifferential: Math.round(totalNightDifferential * 100) / 100,
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

  /** approved overtime (encoded time in/out) of an employee in the period, by planned date YYYY-MM-DD */
  private async getApprovedOvertimesByDate(
    employeeId: string,
    year: string,
    month: string,
    dayRange: number[],
  ): Promise<Map<string, { encodedTimeIn: string; encodedTimeOut: string }[]>> {
    const map = new Map<string, { encodedTimeIn: string; encodedTimeOut: string }[]>();
    try {
      const rows: { plannedDate: string; encodedTimeIn: string; encodedTimeOut: string }[] =
        await this.dataSource.query(
          `SELECT DATE_FORMAT(oa.planned_date,'%Y-%m-%d') plannedDate,
                DATE_FORMAT(oacc.encoded_time_in,'%Y-%m-%d %H:%i:%s') encodedTimeIn,
                DATE_FORMAT(oacc.encoded_time_out,'%Y-%m-%d %H:%i:%s') encodedTimeOut
           FROM employee_monitoring.overtime_application oa
          INNER JOIN employee_monitoring.overtime_employee oe ON oe.overtime_application_id_fk = oa.overtime_application_id
          INNER JOIN employee_monitoring.overtime_accomplishment oacc ON oacc.overtime_employee_id_fk = oe.overtime_employee_id
          WHERE oe.employee_id_fk = ? AND YEAR(oa.planned_date) = ? AND MONTH(oa.planned_date) = ?
            AND DATE_FORMAT(oa.planned_date,'%d') IN (?)
            AND oa.status <> 'cancelled' AND oacc.status = 'approved'
            AND oacc.encoded_time_in IS NOT NULL AND oacc.encoded_time_out IS NOT NULL;`,
          [employeeId, year, month, dayRange.map((d) => ('0' + d).slice(-2))],
        );
      rows.forEach((r) => map.set(r.plannedDate, [...(map.get(r.plannedDate) ?? []), r]));
    } catch (error) {
      console.log(error);
    }
    return map;
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
