import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../../../utils/helpers/pds-crud';
import { Repository } from 'typeorm';
import { Secondary } from '../data/secondary.entity';
import { EducationDTO } from '../../../data/education.dto';

@Injectable()
export class SecondaryService extends PdsCrudHelper<Secondary> {
  constructor(
    @InjectRepository(Secondary)
    private readonly secondaryRepository: Repository<Secondary>,
  ) {
    super(secondaryRepository);
  }

  async addSecondary(employeeId: string, secondaryDTO: EducationDTO) {
    try {
      return await this.createRecord(secondaryDTO);
    } catch (error) {}
  }

  async getSecondary(employeeId: string) {
    try {
      const secondary = await this.secondaryRepository.query(
        `SELECT secondary_id _id,school_name schoolName, \`from\`, \`to\`, year_graduated yearGraduated, awards, degree, units FROM pds_education_secondary WHERE user_id_fk =?  ORDER BY \`from\`\ DESC`,
        [employeeId],
      );
      if (secondary.length > 0) return secondary[0];
      else return {};
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async updateSecondary(employeeId: string, secondaryDTO: EducationDTO) {
    const secondary = await this.secondaryRepository.query(
      `SELECT secondary_id _id,school_name schoolName, \`from\`, \`to\`, year_graduated yearGraduated, awards, degree, units FROM pds_education_secondary WHERE user_id_fk =?  ORDER BY \`from\`\ DESC`,
      [employeeId],
    );
    if (secondary.length > 0) {
      if (secondaryDTO.schoolName === '' || secondaryDTO.schoolName === null) {
        return await this.deleteRecord(secondary[0]._id);
      }
      return await this.updatePdsByEmployeeId(employeeId, secondaryDTO);
    } else return await this.createRecord({ employeeId, ...secondaryDTO });
  }
}
