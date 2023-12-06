import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../../../utils/helpers/pds-crud';

import { Repository } from 'typeorm';
import { Convicted } from '../data/convicted.entity';

@Injectable()
export class ConvictedService extends PdsCrudHelper<Convicted> {
  constructor(@InjectRepository(Convicted) convictedRepository: Repository<Convicted>) {
    super(convictedRepository);
  }
}
