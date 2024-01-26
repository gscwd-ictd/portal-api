import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../../../utils/helpers/pds-crud';

import { Repository } from 'typeorm';
import { GuiltyCharged } from '../data/guilty-charged.entity';

@Injectable()
export class GuiltyChargedService extends PdsCrudHelper<GuiltyCharged> {
  constructor(
    @InjectRepository(GuiltyCharged)
    private readonly guiltyChargedRepository: Repository<GuiltyCharged>,
  ) {
    super(guiltyChargedRepository);
  }
}
