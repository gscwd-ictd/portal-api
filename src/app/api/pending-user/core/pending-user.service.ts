import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudHelper } from '../../../../utils/helpers/crud';
import { CreateUserDto } from '../../user/data/user.dto';
import { PendingUser } from '../data/pending-user.entity';
import { PendingUserTokenService } from '../misc/pending-user-token.service';

@Injectable()
export class PendingUserService extends CrudHelper<PendingUser> {
  constructor(
    @InjectRepository(PendingUser)
    private readonly pendingUserRepository: Repository<PendingUser>,

    // inject pending user token service
    private readonly pendingUserTokenService: PendingUserTokenService,
  ) {
    super(pendingUserRepository);
  }

  async findPendingUserByUserId(userId: string) {
    try {
      return await this.pendingUserRepository
        .createQueryBuilder()
        .select()
        .where('user_id_fk = :userId', { userId })
        .getOneOrFail();
      //return await this.pendingUserRepository.findOneOrFail({ where: { userId }, loadRelationIds: true });
    } catch (error) {
      throw new HttpException('Cannot find pending user', HttpStatus.NOT_FOUND);
    }
  }

  async verifyPendingUserToken(userId: string) {
    // find pending user by user id
    const pendingUser = await this.findPendingUserByUserId(userId);

    // verify if token is valid, then return result
    const result = await this.pendingUserTokenService.verifyPendingUser(pendingUser.token);

    // return the result with userId
    return { ...result, userId };
  }

  async generatePending(user: CreateUserDto) {
    // deconstruct user to extract details
    const { companyId, firstName, middleName, lastName, nameExt } = user;

    // generate pending user details token
    return await this.pendingUserTokenService.generatePendingUser({
      companyId,
      firstName,
      middleName,
      lastName,
      nameExt,
    });
  }
}
