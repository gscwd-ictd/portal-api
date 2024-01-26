import { AddEducationDTO } from './../../../data/education.dto';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../../../utils/helpers/pds-crud';
import { Repository } from 'typeorm';
import { Vocational } from '../data/vocational.entity';

@Injectable()
export class VocationalService extends PdsCrudHelper<Vocational> {
  constructor(@InjectRepository(Vocational) private readonly vocationalRepository: Repository<Vocational>) {
    super(vocationalRepository);
  }

  async addVocational(employeeId: string, vocationalDTO: AddEducationDTO) {
    try {
      const addVocational = await Promise.all(
        vocationalDTO.add.map(async (vocationalItem) => {
          const { _id, isOngoing, isEdited, isGraduated, ...rest } = vocationalItem;
          await this.createRecord({ employeeId, ...rest });
          // else {
          //   const deleteResult = await this.deleteRecord(_id);
          //   if (deleteResult.affected > 0) return vocationalItem;
          // }
        }),
      );

      const updateVocational = await Promise.all(
        vocationalDTO.update.map(async (vocationalItem) => {
          const { _id, isOngoing, isEdited, isGraduated, ...rest } = vocationalItem;
          const updateResult = await this.updateRecord(_id, rest);
          if (updateResult.affected > 0) return vocationalItem;
        }),
      );

      const deleteVocational = await Promise.all(
        vocationalDTO.delete.map(async (vocationalItem) => {
          const { _id, ...rest } = vocationalItem;
          const deleteResult = await this.deleteRecord(_id);
          if (deleteResult.affected > 0) return vocationalItem;
        }),
      );
      return await this.vocationalRepository.query(
        `SELECT vocational_id _id,school_name schoolName, \`from\`, \`to\`,year_graduated yearGraduated, awards, degree, units FROM pds_education_vocational WHERE user_id_fk =? ORDER BY \`from\` DESC`,
        [employeeId],
      );
    } catch (error) {}
  }

  async getVocational(employeeId: string) {
    try {
      return await this.vocationalRepository.query(
        `SELECT vocational_id _id,school_name schoolName, \`from\`, \`to\`,year_graduated yearGraduated, awards, degree, units FROM pds_education_vocational WHERE user_id_fk =? ORDER BY \`from\` DESC`,
        [employeeId],
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
