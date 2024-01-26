import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PasswordService } from '../misc/password.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../data/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PendingUserModule } from '../../pending-user/core/pending-user.module';
import { EmployeeModule } from '../../employee/core/employee.module';

@Module({
  imports: [
    // register user entity
    TypeOrmModule.forFeature([User]),

    // register jwt module for email jwt
    JwtModule.register({ secret: process.env.EMAIL_SECRET }),

    // register pending user module to user pending user service
    PendingUserModule,

    EmployeeModule,
  ],
  providers: [UserService, PasswordService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
