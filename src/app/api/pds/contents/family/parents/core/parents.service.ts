import { ParentMama, ParentPapa } from './../data/parents.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../../utils/helpers/pds-crud';
import { Repository } from 'typeorm';
import { Parents } from '../data/parents.entity';

@Injectable()
export class ParentsService extends PdsCrudHelper<Parents> {
  constructor(
    @InjectRepository(Parents)
    private readonly parentsRepository: Repository<Parents>,
  ) {
    super(parentsRepository);
  }

  async updateMother(employeeId: string, parentMamaDTO: ParentMama) {
    try {
      const updateResult = await this.parentsRepository
        .createQueryBuilder()
        .update()
        .set(parentMamaDTO)
        .where({ employeeId })
        .execute();
      if (updateResult.affected > 0) return parentMamaDTO;
    } catch (error) {}
  }

  async updateFather(employeeId: string, parentPapaDTO: ParentPapa) {
    try {
      const updateResult = await this.parentsRepository
        .createQueryBuilder()
        .update()
        .set(parentPapaDTO)
        .where({ employeeId })
        .execute();
      if (updateResult.affected > 0) return parentPapaDTO;
    } catch (error) {}
  }
}
