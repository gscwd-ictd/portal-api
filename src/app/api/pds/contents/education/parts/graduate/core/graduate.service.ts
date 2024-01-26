import { map } from 'rxjs';
import { AddEducationDTO } from './../../../data/education.dto';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../../../utils/helpers/pds-crud';
import { Repository } from 'typeorm';
import { Graduate } from '../data/graduate.entity';

@Injectable()
export class GraduateService extends PdsCrudHelper<Graduate> {
  constructor(@InjectRepository(Graduate) private readonly graduateRepository: Repository<Graduate>) {
    super(graduateRepository);
  }

  async addGraduate(employeeId: string, graduateDTO: AddEducationDTO) {
    try {
      console.log(graduateDTO);
      const addGraduate = await Promise.all(
        graduateDTO.add.map(async (graduateItem) => {
          const { _id, isOngoing, isEdited, isGraduated, ...rest } = graduateItem;
          await this.createRecord({ employeeId, ...rest });
          // else {
          //   const deleteResult = await this.deleteRecord(_id);
          //   if (deleteResult.affected > 0) return { deleted: graduateItem };
          // }
        }),
      );

      const updateGraduate = await Promise.all(
        graduateDTO.update.map(async (graduateItem) => {
          const { _id, isOngoing, isEdited, isGraduated, ...rest } = graduateItem;
          const updateResult = await this.updateRecord(_id, rest);
          if (updateResult.affected > 0) return graduateItem;
        }),
      );

      const deleteGraduate = await Promise.all(
        graduateDTO.delete.map(async (graduateItem) => {
          const { _id, ...rest } = graduateItem;
          const updateResult = await this.deleteRecord(_id);
        }),
      );

      return await this.graduateRepository.query(
        `SELECT graduate_id _id,school_name schoolName, \`from\`, \`to\`, year_graduated yearGraduated, awards, degree, units FROM pds_education_graduate WHERE user_id_fk =?  ORDER BY \`from\`\ DESC`,
        [employeeId],
      );
    } catch (error) {
      console.log();
    }
  }

  async getGraduate(employeeId: string) {
    try {
      return await this.graduateRepository.query(
        `SELECT graduate_id _id,school_name schoolName, \`from\`, \`to\`, year_graduated yearGraduated, awards, degree, units FROM pds_education_graduate WHERE user_id_fk =?  ORDER BY \`from\`\ DESC`,
        [employeeId],
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
