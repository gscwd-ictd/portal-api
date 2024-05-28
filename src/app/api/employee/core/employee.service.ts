import { PersonalInfoService } from './../../pds/contents/basic-info/personal-info/core/personal-info.service';
import { HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudHelper } from '../../../../utils/helpers/crud';
import { DataSource, Repository } from 'typeorm';
import { Employee } from '../data/employee.entity';
import { MicroserviceType } from '../../../../utils/types/microservice-type';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateEmployeeDto } from '../data/employee.dto';
import { PendingUser } from '../../pending-user/data/pending-user.entity';
import { AgeBracketView } from '../data/employee-age.view';
import { promises } from 'dns';
import { EmployeeDetailsFilter, EmployeeDetailsReport } from '../utils/employee-details-report.type';

@Injectable()
export class EmployeeService extends CrudHelper<Employee> {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(AgeBracketView)
    private readonly ageBracketService: Repository<AgeBracketView>,
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
      const employeeDetails = await lastValueFrom(
        this.client.send('get_employee_details_with_signature', hrEmployeeId),
      );
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

  async getEmployeePosition(employeeId: string) {
    //get_employee_position_by_id
    const employeePosition = await lastValueFrom(this.client.send('get_employee_position_by_id', employeeId));
    return employeePosition;
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
        const employeePosition = await this.getEmployeePosition(id);

        if (employeePosition !== null) {
          return { id, name, birthday, picture: photoUrl };
        }
      }),
    );
    return employeeBirthDays.filter((n) => n);
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

  async countPersonnelByAgeBracket() {
    try {
      const label = [];
      const maleData = [];
      const femaleData = [];

      const ageBracket = await this.ageBracketService.find();

      await Promise.all(
        ageBracket.map(async (items) => {
          label.push(items.ageBracket);
          maleData.push(items.maleCount);
          femaleData.push(items.femaleCount);
        }),
      );

      return {
        label: label,
        datasets: [
          {
            label: 'Male',
            data: maleData,
          },
          {
            label: 'Female',
            data: femaleData,
          },
        ],
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async findAllEmployeeGender(employeeId: string) {
    try {
      return await this.employeeRepository
        .createQueryBuilder()
        .select('user_id_fk', 'employeeId')
        .addSelect('sex')
        .where('user_id_fk = :employeeId', { employeeId })
        .getRawOne();
    } catch (error) {
      Logger.error(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async generateReportOnEmployeeDetails(employeeDetailsFilter: EmployeeDetailsFilter) {
    const employees = await lastValueFrom(
      this.client.send('get_employees_by_nature_of_appointment_employee_id', {
        natureOfAppointment: employeeDetailsFilter.natureOfAppointment,
        employeeId: employeeDetailsFilter.employeeId,
      }),
    );

    const personalDetails = await Promise.all(
      employees.map(async (employee) => {
        const { personalDetails } = employee;

        const portalPersonalDetails = await this.employeeRepository.query(
          `SELECT company_id companyId,sex, DATE_FORMAT(birth_date,'%M %d, %Y') birthDate FROM employees WHERE user_id_fk=?`,
          [employee.employmentDetails.employeeId],
        );

        const pdsBasicInfo = await this.employeeRepository.query(
          `SELECT 
              email,
              gsis_number gsis, 
              pagibig_number pagibig, 
              sss_number sss, 
              tin_number tin, 
              height, 
              weight, 
              blood_type bloodType, 
              birth_place birthPlace,
              civil_status civilStatus,
              CONCAT(pbpa.house_number,' ',pbpa.street,', ',pbpa.subdivision,', ',pbpa.barangay,', ',pbpa.city,', ',pbpa.province,', ',pbpa.zip_code) permanentAddress,
              CONCAT(pbra.house_number,' ',pbra.street,', ',pbra.subdivision,', ',pbra.barangay,', ',pbra.city,', ',pbra.province,', ',pbra.zip_code) residentialAddress,
              CONCAT(IF(pee.year_graduated IS NOT NULL,'Graduated','Attended '),' (',IF(pee.year_graduated IS NOT NULL,pee.year_graduated, CONCAT(pee.from,'-',pee.to)), ')') primaryEducation,
              CONCAT(IF(pes.year_graduated IS NOT NULL,'Graduated','Attended '),' (',IF(pes.year_graduated IS NOT NULL,pes.year_graduated, CONCAT(pes.from,'-',pes.to)), ')') secondaryEducation,
              get_vocational(u.user_id) vocationalCourse,
              get_college(u.user_id) collegeEducation,
              get_graduate(u.user_id) graduateStudies,
              get_eligibility(u.user_id) eligibility
                FROM users u 
            LEFT JOIN pds_basic_government_info pdsbgi ON pdsbgi.user_id_fk = u.user_id 
            LEFT JOIN pds_basic_personal_info pbpi ON pbpi.user_id_fk = u.user_id 
            LEFT JOIN pds_education_elementary pee ON pee.user_id_fk = u.user_id  
            LEFT JOIN pds_education_secondary pes ON pes.user_id_fk = u.user_id 
            LEFT JOIN pds_basic_permanent_address pbpa ON pbpa.user_id_fk = u.user_id 
            LEFT JOIN pds_basic_residential_address pbra ON pbra.user_id_fk = u.user_id WHERE u.user_id = ?;`,
          [employee.employmentDetails.employeeId],
        );

        const result =
          portalPersonalDetails.length > 0
            ? {
                ...personalDetails,
                natureOfAppointment: employee.employmentDetails.natureOfAppointment,
                ...portalPersonalDetails[0],
                ...pdsBasicInfo[0],
              }
            : {
                ...personalDetails,
                natureOfAppointment: employee.employmentDetails.natureOfAppointment,
                sex: null,
                birthdate: null,
                ...pdsBasicInfo[0],
              };

        return await this.personalDetailsFilterColumns(employeeDetailsFilter, result);
      }),
    );

    return personalDetails;
  }

  private async personalDetailsFilterColumns(
    employeeDetailsFilter: EmployeeDetailsFilter,
    returnedDetails: EmployeeDetailsReport,
  ) {
    const {
      gsis,
      pagibig,
      sss,
      tin,
      collegeEducation,
      companyId,
      primaryEducation,
      eligibility,
      graduateStudies,
      natureOfAppointment,
      permanentAddress,
      residentialAddress,
      secondaryEducation,
      vocationalCourse,
      personalDetails,
    } = employeeDetailsFilter;

    if (!gsis) delete returnedDetails['gsis'];
    if (!pagibig) delete returnedDetails['pagibig'];
    if (!sss) delete returnedDetails['sss'];
    if (!tin) delete returnedDetails['tin'];
    if (!companyId) delete returnedDetails['companyId'];
    if (!collegeEducation) delete returnedDetails['collegeEducation'];
    if (!primaryEducation) delete returnedDetails['primaryEducation'];
    if (!eligibility) delete returnedDetails['eligibility'];
    if (!graduateStudies) delete returnedDetails['graduateStudies'];
    if (!natureOfAppointment) delete returnedDetails['natureOfAppointment'];
    if (!permanentAddress) delete returnedDetails['permanentAddress'];
    if (!residentialAddress) delete returnedDetails['residentialAddress'];
    if (!secondaryEducation) delete returnedDetails['secondaryEducation'];
    if (!vocationalCourse) delete returnedDetails['vocationalCourse'];
    if (!personalDetails) {
      delete returnedDetails['birthPlace'];
      delete returnedDetails['birthDate'];
      delete returnedDetails['sex'];
      delete returnedDetails['civilStatus'];
      delete returnedDetails['height'];
      delete returnedDetails['weight'];
      delete returnedDetails['bloodType'];
    }
    return returnedDetails;
  }
}
