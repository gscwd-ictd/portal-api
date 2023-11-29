import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../../../utils/helpers/pds-crud';

import { Repository } from 'typeorm';
import { Immigrant } from '../data/immigrant.entity';

@Injectable()
export class ImmigrantService extends PdsCrudHelper<Immigrant> {
  constructor(@InjectRepository(Immigrant) immigrantRepository: Repository<Immigrant>) {
    super(immigrantRepository);
  }
}
