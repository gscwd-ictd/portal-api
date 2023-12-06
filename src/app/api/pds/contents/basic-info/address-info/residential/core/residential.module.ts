import { Module } from '@nestjs/common';
import { ResidentialAddressService } from './residential.service';
import { ResidentialAddressController } from './residential.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResidentialAddress } from '../data/residential.entity';
import { PermanentAddressModule } from '../../permanent/core/permanent.module';

@Module({
  imports: [TypeOrmModule.forFeature([ResidentialAddress]), PermanentAddressModule],
  providers: [ResidentialAddressService],
  controllers: [ResidentialAddressController],
  exports: [ResidentialAddressService],
})
export class ResidentialAddressModule {}
