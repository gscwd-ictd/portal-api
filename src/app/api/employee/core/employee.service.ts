import { PersonalInfoService } from './../../pds/contents/basic-info/personal-info/core/personal-info.service';
import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudHelper } from '../../../../utils/helpers/crud';
import { DataSource, Repository } from 'typeorm';
import { Employee } from '../data/employee.entity';
import { MicroserviceType } from '../../../../utils/types/microservice-type';
import { ClientProxy } from '@nestjs/microservices';
import { last, lastValueFrom } from 'rxjs';
import { GET_EMPLOYEE_DETAILS } from '../../../../utils/constants/microservice-patterns';
import { CreateEmployeeDto } from '../data/employee.dto';
import { PendingUser } from '../../pending-user/data/pending-user.entity';

@Injectable()
export class EmployeeService extends CrudHelper<Employee> {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly personalInfoService: PersonalInfoService,

    @Inject(MicroserviceType.EMPLOYEE_DETAILS)
    private readonly client: ClientProxy,

    @Inject(MicroserviceType.EMPLOYEE_MONITORING)
    private readonly clientEms: ClientProxy,

    // inject data source
    private readonly dataSource: DataSource,
  ) {
    super(employeeRepository);
  }

  async findRecordByUserId(userId: string) {
    try {
      return await this.employeeRepository.createQueryBuilder().select().where({ userId }).getOneOrFail();
    } catch (error) {
      throw new HttpException('Cannot find employee profile', HttpStatus.NOT_FOUND);
    }
  }

  async getEmployeeDetails(employeeId: string) {
    try {
      const employeeDetails = (
        await this.employeeRepository.query(
          `SELECT IF(photo_url IS NULL,'',photo_url) photoUrl, email_address emailAddress FROM employees WHERE user_id_fk=?;`,
          [employeeId],
        )
      )[0] as { photoUrl: string; emailAddress: string };
      console.log(employeeDetails);
      return employeeDetails;
    } catch (error) {
      console.log(error);
      return { photoUrl: '', emailAddress: '' };
    }
  }

  async getEmployeeFullName(employeeId: string) {
    try {
      return (await this.employeeRepository.query(`select get_employee_fullname(?) fullName;`, [employeeId]))[0]
        .fullName;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getEmployeeDetailsFromHr(hrEmployeeId: string) {
    try {
      const employeeDetails = await lastValueFrom(this.client.send(GET_EMPLOYEE_DETAILS, hrEmployeeId));
      const officerOfTheDay = await lastValueFrom(this.clientEms.send('get_officer_of_the_day_orgs', hrEmployeeId));
      console.log(employeeDetails);

      const overtimeImmediateSupervisorId = await lastValueFrom(
        this.clientEms.send('get_overtime_immediate_supervisor', hrEmployeeId),
      );
      const sex = (
        await this.employeeRepository.query(`SELECT sex FROM employees WHERE user_id_fk = ?`, [hrEmployeeId])
      )[0].sex;
      return { ...employeeDetails, officerOfTheDay, overtimeImmediateSupervisorId, sex };
    } catch (error) {
      console.log(error);
      throw new HttpException('Cannot find employee details from HR', HttpStatus.NOT_FOUND);
    }
  }

  async getBirthDaysForTheCurrentMonth() {
    const birthdays = (await this.employeeRepository.query(`
    SELECT 
      emp.user_id_fk id, date_format(emp.birth_date,'%M %d, %Y') birthday  
    FROM employees emp 
    WHERE month(emp.birth_date) = month(now()) 
    ORDER BY day(emp.birth_date) ASC;
    `)) as { id: string; birthday: Date }[];

    const employeeBirthDays = await Promise.all(
      birthdays.map(async (_birthday) => {
        const { birthday, id } = _birthday;
        const { photoUrl } = await this.getEmployeeDetails(id);
        const name = await this.getEmployeeFullName(id);
        return { id, name, birthday, picture: photoUrl };
      }),
    );
    return employeeBirthDays;
  }

  async createEmployee(employeeDto: CreateEmployeeDto) {
    // start database transaction
    await this.dataSource.transaction(async (manager) => {
      try {
        // create new employee
        const newEmployee = await manager.createQueryBuilder().insert().into(Employee).values(employeeDto).execute();

        // delete employee from pending users
        await manager
          .createQueryBuilder()
          .delete()
          .from(PendingUser)
          .where('user_id_fk =:userId', { userId: employeeDto.userId })
          .execute();

        return newEmployee;
      } catch (error) {
        throw new HttpException('Failed to delete pending user', HttpStatus.BAD_REQUEST);
      }
    });
  }

  async getEmail(employeeId: string) {
    console.log(employeeId);
    const { email } = (
      await this.employeeRepository.query(
        `
      SELECT email_address email FROM employees WHERE user_id_fk=?
    `,
        [employeeId],
      )
    )[0];

    /*
    await this.employeeRepository.findOneOrFail({
      select: { email: true },
      where: { userId:  },
      loadRelationIds: true,
    });
    */
    console.log('EMAIL ', email);
    return email;
  }

  async getEmployeesForPopulation() {
    try {
      return await lastValueFrom(this.client.send('get_employees_for_population', {}));
    } catch (error) {
      return error;
    }
  }

  async getEmployeePersonalInfo(employeeId: string) {
    const pdsPersonalInfo = await this.personalInfoService.findPdsByEmployeeId(employeeId);
    const employeeDetails = await this.findRecordByUserId(employeeId);
    return { pdsPersonalInfo, employeeDetails };
  }

  async isPdcChairman(employeeId: string) {
    try {
      return await lastValueFrom(this.client.send('is_pdc_chairman', employeeId));
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async isPdcSecretariat(employeeId: string) {
    try {
      return await lastValueFrom(this.client.send('is_pdc_secretariat', employeeId));
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async isGeneralManager(employeeId: string) {
    try {
      return await lastValueFrom(this.client.send('is_general_manager_or_oic', employeeId));
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getPrfsForApprovalCount(employeeId: string) {
    try {
      return await lastValueFrom(this.client.send('get_prf_approvals_count', employeeId));
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  //get_pending_applicant_endorsements_count
  async getPendingApplicantEndorsementsCount(employeeId: string) {
    try {
      return await lastValueFrom(this.client.send('get_pending_applicant_endorsements_count', employeeId));
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //get_appointing_authority_selection_count
  async getAppointingAuthoritySelectionCount() {
    try {
      return await lastValueFrom(this.client.send('get_appointing_authority_selection_count', {}));
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
