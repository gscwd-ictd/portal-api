import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../../utils/helpers/pds-crud';
import { Repository } from 'typeorm';
import { GovernmentInfo } from '../data/government-info.entity';

@Injectable()
export class GovernmentInfoService extends PdsCrudHelper<GovernmentInfo> {
  constructor(
    @InjectRepository(GovernmentInfo)
    private readonly governmentInfoRepository: Repository<GovernmentInfo>,
  ) {
    super(governmentInfoRepository);
  }
}
