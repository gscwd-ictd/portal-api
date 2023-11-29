import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../../../utils/helpers/pds-crud';
import { Repository } from 'typeorm';
import { Elementary } from '../data/elementary.entity';
import { AddEducationDTO, EducationDTO } from '../../../data/education.dto';

@Injectable()
export class ElementaryService extends PdsCrudHelper<Elementary> {
  constructor(
    @InjectRepository(Elementary)
    private readonly elementaryRepository: Repository<Elementary>,
  ) {
    super(elementaryRepository);
  }

  async addElementary(employeeId: string, elementaryDTO: EducationDTO) {
    try {
      // const elementary = await Promise.all(
      //   elementaryDTO.education.map(async (elementaryItem) => {
      //     const { _id, ...rest } = elementaryItem;
      //     if (_id === '') return { added: await this.createRecord(rest) };
      //     else {
      //       const deleteResult = await this.deleteRecord(_id);
      //       if (deleteResult.affected > 0) return elementaryItem;
      //     }
      //   }),
      // );
      // return elementary;
      return await this.createRecord({ employeeId, ...elementaryDTO });
    } catch (error) {}
  }
}
