import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../../utils/helpers/pds-crud';
import { Repository } from 'typeorm';
import { Spouse } from '../data/spouse.entity';

@Injectable()
export class SpouseService extends PdsCrudHelper<Spouse> {
  constructor(
    @InjectRepository(Spouse)
    private readonly spouseRepository: Repository<Spouse>,
  ) {
    super(spouseRepository);
  }
}
