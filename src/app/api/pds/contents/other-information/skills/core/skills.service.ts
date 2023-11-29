import { AddSkillsDTO } from './../data/skills.dto';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../../utils/helpers/pds-crud';
import { Repository } from 'typeorm';
import { Skills } from '../data/skills.entity';

@Injectable()
export class SkillsService extends PdsCrudHelper<Skills> {
  constructor(
    @InjectRepository(Skills)
    private readonly skillsRepository: Repository<Skills>,
  ) {
    super(skillsRepository);
  }

  async addSkills(employeeId: string, skillsDTO: AddSkillsDTO) {
    try {
      console.log(skillsDTO);
      const addSkills = await Promise.all(
        skillsDTO.add.map(async (skill) => {
          const { _id, isEdited, ...rest } = skill;
          return await this.createRecord(rest);
        }),
      );

      const updateSkills = await Promise.all(
        skillsDTO.update.map(async (skill) => {
          const { _id, isEdited, ...rest } = skill;
          return await this.updateRecord(_id, rest);
        }),
      );

      const deleteSkills = await Promise.all(
        skillsDTO.delete.map(async (skill) => {
          const { _id, ...rest } = skill;
          return await this.deleteRecord(_id);
        }),
      );

      return await this.findAllPdsEmployeeId(employeeId);
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }
}
