import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudHelper } from '../../../../../../../../utils/helpers/crud';
import { Repository } from 'typeorm';
import { WorkExperienceSheetDuties } from '../data/duties.entity';

@Injectable()
export class WorkExperienceSheetDutiesService extends CrudHelper<WorkExperienceSheetDuties> {
  constructor(
    @InjectRepository(WorkExperienceSheetDuties)
    private readonly dutiesRepository: Repository<WorkExperienceSheetDuties>,
  ) {
    super(dutiesRepository);
  }
}
