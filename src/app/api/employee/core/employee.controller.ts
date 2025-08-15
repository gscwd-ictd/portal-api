import { TestNested } from './../data/employee.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../../../../global/guards/authenticated.guard';
import { CreateEmployeeDto, TestDTO, UpdateEmployeeDto } from '../data/employee.dto';
import { EmployeeService } from './employee.service';
import { User } from '../../../../global/decorators/user.decorator';
import { AuthenticatedUser } from '../../../../utils/types/auth-type';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { EmployeeDetailsFilter } from '../utils/employee-details-report.type';
import { MsExceptionFilter } from '../../../../utils/filters/rpc-exception.filter';
import { NatureOfAppointment } from '../utils/employee.type';

@Controller('employees')
export class EmployeeController {
  constructor(
    // inject employee service
    private readonly employeeService: EmployeeService,
  ) {}

  @Get('credentials')
  async getEmployeesForPopulation() {
    return await this.employeeService.getEmployeesForPopulation();
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  async createEmployee(@Body() employeeDto: CreateEmployeeDto) {
    return await this.employeeService.createEmployee(employeeDto);
  }

  @Get('ot-supervisor-employees/')
  async getEmployeesUnderOtSupervisor(
    @User() user: AuthenticatedUser,
    @Query('nature_of_appointment') natureOfAppointment: NatureOfAppointment,
  ) {
    return await this.employeeService.getEmployeesUnderOtSupervisor(user._id, natureOfAppointment);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('hr-details')
  async getEmployeeDetailsFromHr(@User() user: AuthenticatedUser) {
    if (user) return await this.employeeService.getEmployeeDetailsFromHr(user._id);
  }

  @UseGuards(AuthenticatedGuard)
  @Get()
  async findEmployeeByUserId(@Query('user') userId: string) {
    return await this.employeeService.findRecordByUserId(userId);
  }

  @UseGuards(AuthenticatedGuard)
  @Get()
  async findAllEmployees() {
    return await this.employeeService.findAllRecords();
  }

  @Get('test')
  async testing() {
    return 'asd asd';
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/:id')
  async findEmployeeById(@Param('id') employeeId: string) {
    return await this.employeeService.findRecordById(employeeId);
  }

  @UseGuards(AuthenticatedGuard)
  @Put('/:id')
  async updateEmployee(@Param('id') employeeId: string, @Body() employeeDto: UpdateEmployeeDto) {
    return await this.employeeService.updateRecord(employeeId, employeeDto);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('/:id')
  async deleteEmployee(@Param('id') employeeId: string) {
    return await this.employeeService.deleteRecord(employeeId);
  }

  @UseFilters(new MsExceptionFilter())
  @MessagePattern({ msg: 'get_employee_info_pds' })
  async findEmployeeByIdMS(@Payload() employeeId: string) {
    try {
      return await this.employeeService.getEmployeePersonalInfo(employeeId);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @UseFilters(new MsExceptionFilter())
  @MessagePattern({ msg: 'get_employee_portal_details' })
  async getEmployeePortalDetails(@Payload() employeeId: string) {
    try {
      return await this.employeeService.getEmployeeDetails(employeeId);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @UseFilters(new MsExceptionFilter())
  @MessagePattern({ msg: 'find_email_by_employee_id' })
  async getEmail(@Payload() employeeId: string) {
    try {
      return await this.employeeService.getEmail(employeeId);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @UseFilters(new MsExceptionFilter())
  @MessagePattern({ msg: 'get_employee_birthdays_for_the_current_month' })
  async getBirthDaysForTheCurrentMonth() {
    try {
      return await this.employeeService.getBirthDaysForTheCurrentMonth();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @UseFilters(new MsExceptionFilter())
  @MessagePattern({ msg: 'count_personnel_by_age_bracket' })
  async countPersonnelByAgeBracket() {
    try {
      return await this.employeeService.countPersonnelByAgeBracket();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @UseFilters(new MsExceptionFilter())
  @MessagePattern({ msg: 'find_employee_gender_by_employee_id' })
  async findAllEmployeeGender(@Payload() employeeId: string) {
    try {
      return await this.employeeService.findAllEmployeeGender(employeeId);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @UseFilters(new MsExceptionFilter())
  @MessagePattern({ msg: 'generate_report_on_employee_details' })
  async generateReportOnEmployeeDetails(
    @Payload()
    employeeDetailsFilter: EmployeeDetailsFilter,
  ) {
    try {
      return await this.employeeService.generateReportOnEmployeeDetails(employeeDetailsFilter);
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
