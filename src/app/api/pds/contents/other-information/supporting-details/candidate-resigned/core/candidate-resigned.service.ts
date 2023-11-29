import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../../../utils/helpers/pds-crud';
import { Repository } from 'typeorm';
import { CandidateResigned } from '../data/candidate-resigned.entity';

@Injectable()
export class CandidateResignedService extends PdsCrudHelper<CandidateResigned> {
  constructor(
    @InjectRepository(CandidateResigned)
    private readonly candidateResignedRepository: Repository<CandidateResigned>,
  ) {
    super(candidateResignedRepository);
  }
}
