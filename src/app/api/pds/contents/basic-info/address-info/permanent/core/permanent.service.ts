import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../../../../src/utils/helpers/pds-crud';
import { Repository } from 'typeorm';
import { PermanentAddress } from '../data/permanent.entity';
import { UpdatePermanentAddressDto } from '../data/permanent.dto';

@Injectable()
export class PermanentAddressService extends PdsCrudHelper<PermanentAddress> {
  constructor(
    @InjectRepository(PermanentAddress)
    private readonly permanentAddressRepository: Repository<PermanentAddress>,
  ) {
    super(permanentAddressRepository);
  }

  async updatePermanentAddress(employeeId: string, permanentAddressDto: UpdatePermanentAddressDto) {
    const result = await this.updatePdsByEmployeeId(employeeId, permanentAddressDto);
    if (result.affected > 0) return await this.findPdsByEmployeeId(employeeId);
  }
}
