import { TestNested } from './../data/employee.dto';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../../../../global/guards/authenticated.guard';
import { CreateEmployeeDto, TestDTO, UpdateEmployeeDto } from '../data/employee.dto';
import { EmployeeService } from './employee.service';
import { User } from '../../../../global/decorators/user.decorator';
import { AuthenticatedUser } from '../../../../utils/types/auth-type';
import { MessagePattern, Payload } from '@nestjs/microservices';

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

  @MessagePattern({ msg: 'get_employee_info_pds' })
  async findEmployeeByIdMS(@Payload() employeeId: string) {
    return await this.employeeService.getEmployeePersonalInfo(employeeId);
  }

  @MessagePattern({ msg: 'get_employee_portal_details' })
  async getEmployeePortalDetails(@Payload() employeeId: string) {
    return await this.employeeService.getEmployeeDetails(employeeId);
  }

  @MessagePattern({ msg: 'find_email_by_employee_id' })
  async getEmail(@Payload() employeeId: string) {
    return await this.employeeService.getEmail(employeeId);
  }

  @MessagePattern({ msg: 'get_employee_birthdays_for_the_current_month' })
  async getBirthDaysForTheCurrentMonth() {
    console.log('asdsadsadASDASDSASACZXVASDADQAWFASGVA');
    return await this.employeeService.getBirthDaysForTheCurrentMonth();
  }
}
