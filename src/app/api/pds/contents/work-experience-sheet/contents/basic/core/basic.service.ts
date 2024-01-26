import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudHelper } from '../../../../../../../../utils/helpers/crud';
import { Repository } from 'typeorm';
import { WorkExperienceSheetBasic } from '../data/basic.entity';

@Injectable()
export class WorkExperienceSheetBasicService extends CrudHelper<WorkExperienceSheetBasic> {
  constructor(
    @InjectRepository(WorkExperienceSheetBasic)
    private readonly workExperienceSheetBasicRepository: Repository<WorkExperienceSheetBasic>,
  ) {
    super(workExperienceSheetBasicRepository);
  }
}
