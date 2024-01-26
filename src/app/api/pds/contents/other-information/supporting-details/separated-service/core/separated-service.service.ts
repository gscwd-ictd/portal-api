import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../../../utils/helpers/pds-crud';

import { Repository } from 'typeorm';
import { SeparatedService } from '../data/separated-service.entity';

@Injectable()
export class SeparatedServiceService extends PdsCrudHelper<SeparatedService> {
  constructor(
    @InjectRepository(SeparatedService)
    separatedServiceRepository: Repository<SeparatedService>,
  ) {
    super(separatedServiceRepository);
  }
}
