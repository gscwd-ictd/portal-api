import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermanentAddress } from '../data/permanent.entity';
import { PermanentAddressController } from './permanent.controller';
import { PermanentAddressService } from './permanent.service';

@Module({
  imports: [TypeOrmModule.forFeature([PermanentAddress])],
  providers: [PermanentAddressService],
  controllers: [PermanentAddressController],
  exports: [PermanentAddressService],
})
export class PermanentAddressModule {}
