import { PermanentAddressService } from './../../permanent/core/permanent.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../../../utils/helpers/pds-crud';
import { Repository } from 'typeorm';
import { ResidentialAddress } from '../data/residential.entity';
import { UpdateResidentialAddressDto } from '../data/residential.dto';

@Injectable()
export class ResidentialAddressService extends PdsCrudHelper<ResidentialAddress> {
  constructor(
    @InjectRepository(ResidentialAddress)
    private readonly residentialAddressRepository: Repository<ResidentialAddress>,
    private readonly permanentAddressService: PermanentAddressService,
  ) {
    super(residentialAddressRepository);
  }

  async updateBothAddresses(employeeId: string, residentialAddressDto: UpdateResidentialAddressDto) {
    try {
      console.log(residentialAddressDto);
      const residential = await this.updatePdsByEmployeeId(employeeId, residentialAddressDto);
      const permanent = await this.permanentAddressService.updatePdsByEmployeeId(employeeId, residentialAddressDto);
      return { address: residential, permanent };
    } catch (error) {
      console.log(error);
    }
  }
}
