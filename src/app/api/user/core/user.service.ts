import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticatedUser, UserCredentials } from '../../../../utils/types/auth-type';
import { DataSource, Repository } from 'typeorm';
import { CrudHelper } from '../../../../utils/helpers/crud';
import { PendingUser } from '../../pending-user/data/pending-user.entity';
import { ChangePasswordDto, CreateUserDto } from '../data/user.dto';
import { User } from '../data/user.entity';
import { PasswordService } from '../misc/password.service';
import { PendingUserService } from '../../pending-user/core/pending-user.service';
import { Request, Response } from 'express';
import { EmployeeService } from '../../employee/core/employee.service';
import { Employee, Sex } from '../../employee/data/employee.entity';
import { EmployeeDetailsFromHr } from '../../employee/utils/employee.type';

@Injectable()
export class UserService extends CrudHelper<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    // inject password service
    private readonly passwordService: PasswordService,

    // inject jwt service
    private readonly jwtService: JwtService,

    // inject data source for handling database transactions
    private readonly dataSource: DataSource,

    // inject pending user service
    private readonly pendingUserService: PendingUserService,

    private readonly employeeService: EmployeeService,
  ) {
    super(userRepository);
  }

  async verifySignupToken(token: string): Promise<any> {
    try {
      // extract data from jwt
      const fromJwt = await this.jwtService.verifyAsync(token, { secret: process.env.EMAIL_SECRET });

      // see if user with the specified email from jwt is already existing in the database
      const user = await this.userRepository.createQueryBuilder().select().where({ email: fromJwt.email }).getOne();

      // throw an error if email is already taken
      if (user) throw new HttpException('Email address already in use.', HttpStatus.FORBIDDEN);

      // return data from jwt
      return fromJwt;
    } catch (error) {
      // throw caught error
      throw new HttpException(error, HttpStatus.UNAUTHORIZED);
    }
  }

  async createUser(user: CreateUserDto): Promise<{ message: string; userId: string }> {
    // generate an argon2 hashed password
    const hashedPassword = await this.passwordService.hashPassword(user.password);

    // handle database transaction
    const result = await this.dataSource.transaction(async (manager) => {
      try {
        // insert as new user
        const newUser = await manager
          .createQueryBuilder()
          .insert()
          .into(User)
          .values({ ...user, password: hashedPassword })
          .execute();

        // insert to pending users
        await manager
          .createQueryBuilder()
          .insert()
          .into(PendingUser)
          .values({ userId: newUser.generatedMaps[0]._id, token: await this.pendingUserService.generatePending(user) })
          .execute();

        // return result
        return { message: 'User successfully created!', userId: newUser.generatedMaps[0]._id };
      } catch (error) {
        // throw exception in case of error
        throw new HttpException('Failed to register new user', HttpStatus.BAD_REQUEST);
      }
    });

    return result;
  }

  async verifyPassword(credentials: UserCredentials) {
    try {
      const user = await this.findUserByEmail(credentials.email);
      // verify if password is valid
      return await this.passwordService.verifyPassword(user.password, credentials.password);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getMobileNoByUserCreds(credentials: UserCredentials) {
    try {
      const user = await this.findUserByEmail(credentials.email);
      const employeeDetails: EmployeeDetailsFromHr = await this.employeeService.getEmployeeDetailsFromHr(user._id);

      const isMatched = await this.passwordService.verifyPasswordBoolean(user.password, credentials.password);
      if (isMatched) {
        return {
          mobileNumber: (await this.employeeService.findRecordByUserId(user._id)).mobileNumber,
          shouldOtpOnLogin: await this.shouldOtpOnLogin(employeeDetails),
        };
      }
    } catch (error) {
      throw new HttpException('Invalid Credentials', HttpStatus.FORBIDDEN);
    }
  }

  private async shouldOtpOnLogin(employeeDetails: EmployeeDetailsFromHr) {
    try {
      const {
        isPdcChairman,
        isPdcSecretariat,
        officerOfTheDay,
        isHRMPSB,
        overtimeImmediateSupervisorId,
        assignment: { positionTitle },
      } = employeeDetails;

      if (
        positionTitle === 'Division Manager A' ||
        positionTitle === 'Department Manager A' ||
        positionTitle === 'Assistant General Manager' ||
        positionTitle === 'General Manager A' ||
        positionTitle === 'OIC-Division Manager' ||
        positionTitle === 'OIC-Department Manager' ||
        positionTitle === 'OIC-Assistant General Manager' ||
        positionTitle === 'OIC-General Manager'
      ) {
        return true;
      } else {
        if (
          isPdcChairman ||
          isPdcSecretariat ||
          officerOfTheDay.length > 0 ||
          isHRMPSB ||
          overtimeImmediateSupervisorId !== null
        ) {
          return true;
        }
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  async isValidUser(credentials: UserCredentials) {
    try {
      const user = await this.findUserByEmail(credentials.email);
      return await this.passwordService.verifyPasswordBoolean(user.password, credentials.password);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async verifyUser(credentials: UserCredentials): Promise<AuthenticatedUser> {
    try {
      // find user via email
      const user = await this.findUserByEmail(credentials.email);
      // verify if password is valid
      await this.passwordService.verifyPassword(user.password, credentials.password);
      // return user without password
      return this.passwordService.removePassword(user);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findUserDetails(_id: string): Promise<AuthenticatedUser> {
    try {
      // get user details from database
      const userDetails = await this.userRepository.createQueryBuilder().select().where({ _id }).getOneOrFail();
      // return user without its password
      return this.passwordService.removePassword(userDetails);
    } catch (error) {
      // throw not found error
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      // try to find user by its email address
      return await this.userRepository.createQueryBuilder().select().where({ email }).getOneOrFail();
    } catch (error) {
      // throw invalid credentials error
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  async findPendingUserByUserId(userId: string): Promise<PendingUser> {
    try {
      return await this.dataSource.manager
        .createQueryBuilder()
        .select('token')
        .from(PendingUser, 'pending_user')
        .where('pending_user.user_id_fk = :userId', { userId })
        .getOneOrFail();
    } catch (error) {
      throw new HttpException('Pending user not found', HttpStatus.NOT_FOUND);
    }
  }

  public invalidateSession(request: Request, response: Response): void {
    // send a response to the client setting the header to remove the cookie in the browser
    response.setHeader('Set-Cookie', 'ssid_portal=deleted; Max-Age=0; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT');
    // destroy the session cookie from the redis store6
    request.session.destroy(() => null);
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { email, newPassword, oldPassword } = changePasswordDto;
    const validUser = await this.verifyPassword({ email, password: oldPassword });
    if (validUser) {
      const hashedPassword = await this.passwordService.hashPassword(newPassword);
      const updateResult = await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ password: hashedPassword })
        .where({ email })
        .execute();
      console.log(hashedPassword);
      if (updateResult.affected > 0) return changePasswordDto;
      throw new InternalServerErrorException();
    }

    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async populateUsers() {
    const employees = await this.employeeService.getEmployeesForPopulation();
    const result = await this.dataSource.transaction(async (manager) => {
      const userResults = await Promise.all(
        employees.map(async (employee) => {
          const hashedPassword = await this.passwordService.hashPassword(employee.password);
          const newUser = await manager
            .createQueryBuilder()
            .insert()
            .into(User)
            .values({ _id: employee.employeeId, email: employee.email, password: hashedPassword })
            .execute();

          const newEmployeeDetails = await manager
            .createQueryBuilder()
            .insert()
            .into(Employee)
            .values({
              companyId: employee.companyId,
              firstName: employee.firstName,
              middleName: employee.middleName,
              lastName: employee.lastName,
              nameExtension: employee.nameExt,
              email: employee.email,
              mobileNumber: '',
              sex: Sex.MALE,
              photoUrl: '',
              userId: employee.employeeId,
              birthDate: '2000-01-01',
            })
            .execute();
          return { ...employee, hashedPassword };
        }),
      );
      return userResults;
    });
    return result;
  }
}
