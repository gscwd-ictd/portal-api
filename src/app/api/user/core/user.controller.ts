import { PasswordService } from './../misc/password.service';
import { Body, Controller, Get, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../../../../global/guards/authenticated.guard';
import { User } from '../../../../global/decorators/user.decorator';
import { LoginGuard } from '../../../../global/guards/login.guard';
import { AuthenticatedUser, UserCredentials } from '../../../../utils/types/auth-type';
import { UserService } from '../core/user.service';
import { ChangePasswordDto, CreateUserDto } from '../data/user.dto';
import { Request, Response } from 'express';
import { EmployeeService } from '../../employee/core/employee.service';
import { PendingUserService } from '../../pending-user/core/pending-user.service';

@Controller('users')
export class UserController {
  constructor(
    // inject user service
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly employeeService: EmployeeService,
    private readonly pendingUserService: PendingUserService,
  ) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  async findAuthenticatedUser(@User() user: AuthenticatedUser) {
    console.log(user);
    const employmentDetails = await this.employeeService.getEmployeeDetailsFromHr(user._id);

    const profile = await this.employeeService.findRecordByUserId(user._id);

    return { user, employmentDetails, profile };
  }

  @Post('web/verify-password/')
  async verifyPassword(@Body() credentials: UserCredentials) {
    return await this.userService.verifyPassword(credentials);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('setup')
  async setupUser(@User() user: AuthenticatedUser) {
    // const employmentDetails = await this.employeeService.getEmployeeDetailsFromHr(user._id);
    // const pendingUser = await this.pendingUserService.findPendingUserByUserId(user._id);
    // return { user, employmentDetails, profile: pendingUser };
  }

  @Get('web/verify-signup/:token')
  async verifySignupToken(@Param('token') token: string) {
    return await this.userService.verifySignupToken(token);
  }

  @UseGuards(LoginGuard)
  @Post('web/signin')
  async signin(@User() user: AuthenticatedUser) {
    return user;
  }

  @UseGuards(AuthenticatedGuard)
  @Post('web/signout')
  public signout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    this.userService.invalidateSession(request, response);
  }

  @Post('web/signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return await this.userService.createUser(createUserDto);
  }

  @Patch('web/change-password/')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return await this.userService.changePassword(changePasswordDto);
  }

  @Get('populate')
  async populateUsers() {
    return await this.userService.populateUsers();
  }
}
