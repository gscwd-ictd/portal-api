import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../../../utils/helpers/pds-crud';
import { Repository } from 'typeorm';
import { GovernmentIssuedId } from '../data/government-issued-id.entity';
import { GovernmentIssuedIdType } from '../data/government-issued-id.dto';

@Injectable()
export class GovernmentIssuedIdService extends PdsCrudHelper<GovernmentIssuedId> {
  constructor(
    @InjectRepository(GovernmentIssuedId)
    governmentIssuedIdRepository: Repository<GovernmentIssuedId>,
  ) {
    super(governmentIssuedIdRepository);
  }

  async updateGovernmentIssuedId(employeeId: string, governmentIssuedIdDTO: GovernmentIssuedIdType) {
    const { issueDate, ...rest } = governmentIssuedIdDTO;
    let _issueDate = issueDate;
    if (issueDate.toString() === '') _issueDate = null;
    return await this.updatePdsByEmployeeId(employeeId, { ...rest, issueDate: _issueDate });
  }
}
