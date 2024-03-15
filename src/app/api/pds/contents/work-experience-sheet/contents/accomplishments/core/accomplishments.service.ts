import { HttpException, Injectable } from '@nestjs/common';
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

  async getAccomplishmentsByBasicId(basicId: string) {
    try {
      return await this.accomplishmentsRepository.find({ where: { workExperienceSheetBasicId: { _id: basicId } } });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
