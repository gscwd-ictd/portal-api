import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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
import { ClientProxy } from '@nestjs/microservices';
import { MicroserviceType } from 'src/utils/types/microservice-type';
import { hash } from 'argon2';

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
    const user = await this.findUserByEmail(credentials.email);
    console.log(user);
    // verify if password is valid
    return await this.passwordService.verifyPassword(user.password, credentials.password);
  }

  async verifyUser(credentials: UserCredentials): Promise<AuthenticatedUser> {
    // find user via email
    const user = await this.findUserByEmail(credentials.email);

    // verify if password is valid
    await this.passwordService.verifyPassword(user.password, credentials.password);

    // return user without password
    return this.passwordService.removePassword(user);
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
    return employees;
    // const passwords = [
    //   'zVk3xrkh',
    //   'NQuBHDVq',
    //   'n1FwGwCk',
    //   'Nzhbbk4s',
    //   '4DFJakZn',
    //   'DsEbnjv5',
    //   'Cpf2umWA',
    //   'R98uPvMu',
    //   'uh3rtuxE',
    //   'CKtdxy11',
    //   '03mSTqhX',
    //   'GufCQlY7',
    //   'fRlgF2v7',
    // ];
    /*const squirts = await this.passwordService.hashPassword('@mikhailanthony2021021');
    const alexis = await this.passwordService.hashPassword('@alexis2021020');
    const twinkle = await this.passwordService.hashPassword('@eleaglen2022036');
    const cara = await this.passwordService.hashPassword('@carajade2021019');
    const rv = await this.passwordService.hashPassword('@ricardovicente2021022');
    return {
      squirts,
      alexis,
      twinkle,
      cara,
      rv,
    };*/
    // const result = await this.dataSource.transaction(async (manager) => {
    //   const userResults = await Promise.all(
    //     employees.map(async (employee) => {
    //       //return employee.companyId;
    //       //const password = passwords[idx];
    //       const hashedPassword = await this.passwordService.hashPassword(employee.password);
    //       // return hashedPassword;
    //       await this.userRepository.query(
    //         `UPDATE \`users\` SET \`password\` = ?, email= ? WHERE \`users\`.\`user_id\` = ? ;`,
    //         [hashedPassword, employee.email, employee.employeeId],
    //       );
    //       const newUser = await manager
    //         .createQueryBuilder()
    //         .insert()
    //         .into(User)
    //         .values({ _id: employee.employeeId, email: employee.email, password: hashedPassword })
    //         .execute();

    //       const newEmployeeDetails = await manager
    //         .createQueryBuilder()
    //         .insert()
    //         .into(Employee)
    //         .values({
    //           companyId: employee.companyId,
    //           firstName: employee.firstName,
    //           middleName: employee.middleName,
    //           lastName: employee.lastName,
    //           nameExtension: employee.nameExt,
    //           email: employee.email,
    //           mobileNumber: '',
    //           sex: Sex.MALE,
    //           photoUrl: '',
    //           userId: employee.employeeId,
    //           birthDate: '2000-01-01',
    //         })
    //         .execute();
    //       return { ...employee, hashedPassword };
    //     }),
    //   );
    //   return userResults;
    // });
    // return result;
  }
}
