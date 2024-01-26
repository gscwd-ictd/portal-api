import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../../utils/helpers/pds-crud';
import { DataSource, Repository } from 'typeorm';
import { PersonalInfo } from '../data/personal-info.entity';
import { UpdatePersonalInfoDto } from '../data/personal-info.dto';

@Injectable()
export class PersonalInfoService extends PdsCrudHelper<PersonalInfo> {
  constructor(
    @InjectRepository(PersonalInfo)
    private readonly personalInfoRepository: Repository<PersonalInfo>,
    private dataSource: DataSource,
  ) {
    super(personalInfoRepository);
  }

  async updatePersonalInfo(employeeId: string, personalInfoDto: UpdatePersonalInfoDto) {
    const { email, firstName, middleName, lastName, nameExtension, birthDate, sex, mobileNumber, ...rest } =
      personalInfoDto;

    const personalInfo = await this.updatePdsByEmployeeId(employeeId, rest);

    const employeeDetails = await this.personalInfoRepository.query(
      `UPDATE employees SET mobile_number = ?,birth_date=?, middle_name=?, name_ext=?,sex=? WHERE user_id_fk=?`,
      [mobileNumber, birthDate, middleName, nameExtension, sex, employeeId],
    );
    return { ...personalInfo, mobileNumber };
  }

  async getPersonalInfo(employeeId: string) {
    try {
      const mobileNumber = (
        await this.personalInfoRepository.query(`SELECT mobile_number mobileNumber FROM employees WHERE user_id_fk=?`, [
          employeeId,
        ])
      )[0].mobileNumber;
      const personalInfo = await this.findPdsByEmployeeId(employeeId);
      return { mobileNumber, ...personalInfo };
    } catch (error) {
      console.log(error);
    }
  }
}
