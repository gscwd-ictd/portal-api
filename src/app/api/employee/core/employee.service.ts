import { PersonalInfoService } from './../../pds/contents/basic-info/personal-info/core/personal-info.service';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudHelper } from '../../../../utils/helpers/crud';
import { DataSource, Repository } from 'typeorm';
import { Employee } from '../data/employee.entity';
import { MicroserviceType } from '../../../../utils/types/microservice-type';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
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
      return (
        await this.employeeRepository.query(
          `SELECT IF(photo_url IS NULL,'',photo_url) photoUrl FROM employees WHERE user_id_fk=?;`,
          [employeeId],
        )
      )[0];
    } catch (error) {}
  }

  async getEmployeeDetailsFromHr(hrEmployeeId: string) {
    try {
      const employeeDetails = await lastValueFrom(this.client.send(GET_EMPLOYEE_DETAILS, hrEmployeeId));
      console.log('employee details: ', employeeDetails);
      return employeeDetails;
    } catch (error) {
      throw new HttpException('Cannot find employee details from HR', HttpStatus.NOT_FOUND);
    }
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

  async getEmployeesForPopulation() {
    try {
      return await lastValueFrom(this.client.send('get_employees_for_population', {}));
    } catch (error) {}
  }

  async getEmployeePersonalInfo(employeeId: string) {
    const pdsPersonalInfo = await this.personalInfoService.findPdsByEmployeeId(employeeId);
    const employeeDetails = await this.findRecordByUserId(employeeId);
    return { pdsPersonalInfo, employeeDetails };
  }
}
