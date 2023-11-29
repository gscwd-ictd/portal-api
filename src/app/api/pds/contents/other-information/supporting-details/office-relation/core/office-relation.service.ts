import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../../../utils/helpers/pds-crud';
import { Repository } from 'typeorm';
import { OfficeRelation } from '../data/office-relation.entity';

@Injectable()
export class OfficeRelationService extends PdsCrudHelper<OfficeRelation> {
  constructor(
    @InjectRepository(OfficeRelation)
    officeRelationRepository: Repository<OfficeRelation>,
  ) {
    super(officeRelationRepository);
  }
}
