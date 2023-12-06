import { HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../../../utils/helpers/pds-crud';

import { Repository, DeleteResult } from 'typeorm';
import { References } from '../data/references.entity';
import { AddReferencesDTO } from '../data/references.dto';

export class ReferencesService extends PdsCrudHelper<References> {
  constructor(@InjectRepository(References) referencesRepository: Repository<References>) {
    super(referencesRepository);
  }

  async addReferences(employeeId: string, referencesDTO: AddReferencesDTO) {
    try {
      const addReferences = await Promise.all(
        referencesDTO.add.map(async (reference) => {
          const { _id, isEdited, ...rest } = reference;
          return await this.createRecord({ employeeId, ...rest });
        }),
      );

      const updateReferences = await Promise.all(
        referencesDTO.update.map(async (reference) => {
          const { _id, isEdited, ...rest } = reference;
          const updateResult = await this.updateRecord(_id, rest);
          if (updateResult.affected > 0) return reference;
        }),
      );

      const deleteReferences = await Promise.all(
        referencesDTO.delete.map(async (reference) => {
          const { _id, ...rest } = reference;
          const deleteResult = await this.deleteRecord(_id);
          if (deleteResult.affected > 0) return reference;
        }),
      );

      return await this.findAllPdsEmployeeId(employeeId);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
