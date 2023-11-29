import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../../../utils/helpers/pds-crud';
import { Repository } from 'typeorm';
import { IndigenousPWDSoloParent } from '../data/indigenous-pwd-soloparent.entity';

@Injectable()
export class IndigenousPWDSoloParentService extends PdsCrudHelper<IndigenousPWDSoloParent> {
  constructor(
    @InjectRepository(IndigenousPWDSoloParent)
    indigenousPWDSoloParentRepository: Repository<IndigenousPWDSoloParent>,
  ) {
    super(indigenousPWDSoloParentRepository);
  }
}
