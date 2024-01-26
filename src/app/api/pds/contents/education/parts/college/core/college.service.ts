import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../../../utils/helpers/pds-crud';
import { Repository } from 'typeorm';
import { College } from '../data/college.entity';
import { AddEducationDTO } from '../../../data/education.dto';

@Injectable()
export class CollegeService extends PdsCrudHelper<College> {
  constructor(@InjectRepository(College) private readonly collegeRepository: Repository<College>) {
    super(collegeRepository);
  }

  async getCollege(employeeId: string) {
    return await this.collegeRepository.query(
      `SELECT college_id _id,school_name schoolName, \`from\`, \`to\`,year_graduated yearGraduated, awards, degree, units FROM pds_education_college WHERE user_id_fk =?  ORDER BY \`from\` DESC`,
      [employeeId],
    );
  }

  async addCollege(employeeId: string, collegeDTO: AddEducationDTO) {
    try {
      const addCollege = await Promise.all(
        collegeDTO.add.map(async (collegeItem) => {
          const { _id, isOngoing, isEdited, isGraduated, ...rest } = collegeItem;
          return await this.createRecord({ employeeId, ...rest });
          // else {
          //   const deleteResult = await this.deleteRecord(_id);
          //   if (deleteResult.affected > 0) return { deleted: collegeItem };
          // }
        }),
      );

      const updateCollege = await Promise.all(
        collegeDTO.update.map(async (collegeItem) => {
          const { _id, isOngoing, isEdited, isGraduated, ...rest } = collegeItem;
          const updateResult = await this.updateRecord(_id, rest);
          if (updateResult.affected > 0) return collegeItem;
        }),
      );

      const deleteCollege = await Promise.all(
        collegeDTO.delete.map(async (collegeItem) => {
          const { _id, ...rest } = collegeItem;
          const deleteResult = await this.deleteRecord(_id);
          if (deleteResult.affected > 0) return collegeItem;
        }),
      );
      const res = await this.collegeRepository.query(
        `SELECT college_id _id,school_name schoolName, \`from\`, \`to\`,year_graduated yearGraduated, awards, degree, units FROM pds_education_college WHERE user_id_fk =?  ORDER BY \`from\` DESC`,
        [employeeId],
      );
      console.log(res);
      return res;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
