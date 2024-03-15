import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { AuthenticatedUser } from 'src/utils/types/auth-type';
import { User } from '../data/user.entity';

@Injectable()
export class PasswordService {
  async hashPassword(inputPw: string) {
    try {
      return await argon.hash(inputPw);
    } catch (error) {
      throw new HttpException('failed to create hash', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyPassword(hashedPw: string, inputPw: string) {
    // verify if the hashed password from database and password inputted by the user match
    console.log(inputPw);
    const isMatched = await argon.verify(hashedPw, inputPw);
    console.log(isMatched);
    // throw error if passwords don't match
    if (!isMatched) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    return isMatched;
  }

  public removePassword(user: User): AuthenticatedUser {
    // remove password from user
    delete user.password;

    // return the user
    return user;
  }
}
