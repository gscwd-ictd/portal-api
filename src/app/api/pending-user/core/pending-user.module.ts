import { Module } from '@nestjs/common';
import { PendingUserService } from './pending-user.service';
import { PendingUserController } from './pending-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PendingUser } from '../data/pending-user.entity';
import { PendingUserTokenService } from '../misc/pending-user-token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([PendingUser]),
    // register jwt for pending user jwt
    JwtModule.register({ secret: process.env.PENDING_USER_SECRET }),
  ],
  providers: [PendingUserService, PendingUserTokenService],
  controllers: [PendingUserController],
  exports: [PendingUserService],
})
export class PendingUserModule {}
