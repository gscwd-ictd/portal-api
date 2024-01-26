import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudHelper } from '../../../../../../../../utils/helpers/crud';

import { Repository } from 'typeorm';
import { WorkExperienceSheetAccomplishments } from '../data/accomplishments.entity';

@Injectable()
export class WorkExperienceSheetAccomplishmentsService extends CrudHelper<WorkExperienceSheetAccomplishments> {
  constructor(
    @InjectRepository(WorkExperienceSheetAccomplishments)
    private readonly accomplishmentsRepository: Repository<WorkExperienceSheetAccomplishments>,
  ) {
    super(accomplishmentsRepository);
  }
}
