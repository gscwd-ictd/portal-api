import { VoluntaryWork } from './../data/voluntary-work.entity';
import {
  UpdateVoluntaryWorkDTO,
  DeleteVoluntaryWorkDTO,
  VoluntaryWorkDTO,
  AddVoluntaryWorkDTO,
} from './../data/voluntary-work.dto';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../utils/helpers/pds-crud';
import { FindOptionsUtils, Repository, DeleteResult } from 'typeorm';
import { Console } from 'console';

@Injectable()
export class VoluntaryWorkService extends PdsCrudHelper<VoluntaryWork> {
  constructor(
    @InjectRepository(VoluntaryWork)
    private readonly voluntaryWorkRepository: Repository<VoluntaryWork>,
  ) {
    super(voluntaryWorkRepository);
  }
  async updateVoluntaryWork(updateVoluntaryWorkDTO: UpdateVoluntaryWorkDTO) {
    try {
      const voluntaryWork = await Promise.all(
        updateVoluntaryWorkDTO.voluntaryWorks.map(async (voluntaryWorkitem) => {
          const { _id, ...rest } = voluntaryWorkitem;
          const updateResult = await this.voluntaryWorkRepository
            .createQueryBuilder()
            .update()
            .set(rest)
            .where({ _id })
            .execute();
          if (updateResult.affected > 0) return voluntaryWorkitem;
        }),
      );
      return voluntaryWork;
    } catch (error) {}
  }

  async deleteVoluntaryWork(deleteVoluntaryWorkDTO: DeleteVoluntaryWorkDTO) {
    try {
      const voluntaryWork = await this.voluntaryWorkRepository.query(
        `SELECT * FROM pds_voluntary_work WHERE _id IN (?)`,
        [deleteVoluntaryWorkDTO.voluntaryWorkIds],
      );
      const deleteResult = await this.voluntaryWorkRepository.query(`DELETE FROM pds_voluntary_work WHERE _id IN (?)`, [
        deleteVoluntaryWorkDTO.voluntaryWorkIds,
      ]);
      if (deleteResult.affectedRows > 0) {
        return voluntaryWork;
      }
    } catch (error) {}
  }

  async deleteVoluntaryWork2(_id: string) {
    try {
      const deleteResult = await this.voluntaryWorkRepository.createQueryBuilder().delete().where({ _id }).execute();
      if (deleteResult.affected > 0) return { deletedVoluntaryWorkId: _id };
    } catch (error) {}
  }

  async addVoluntaryWork(employeeId: string, voluntaryWorkDTO: AddVoluntaryWorkDTO) {
    try {
      const addVoluntaryWork = await Promise.all(
        voluntaryWorkDTO.add.map(async (voluntaryWork) => {
          const { _id, isEdited, isCurrentlyVol, ...rest } = voluntaryWork;
          return await this.createRecord({ employeeId, ...rest });
        }),
      );

      const updateVoluntaryWork = await Promise.all(
        voluntaryWorkDTO.update.map(async (voluntaryWork) => {
          const { _id, isEdited, isCurrentlyVol, ...rest } = voluntaryWork;
          const updateResult = await this.updateRecord(_id, rest);
          if (updateResult.affected > 0) return voluntaryWork;
        }),
      );

      const deleteVoluntaryWork = await Promise.all(
        voluntaryWorkDTO.delete.map(async (voluntaryWork) => {
          const { _id, isEdited, isCurrentlyVol, ...rest } = voluntaryWork;
          const deleteResult = await this.deleteRecord(_id);
          if (deleteResult.affected > 0) return voluntaryWork;
        }),
      );

      return await this.voluntaryWorkRepository.query(
        `
      SELECT voluntary_work_id _id, organization_name organizationName, position, DATE_FORMAT(\`to\`,'%Y-%m-%d') \'to\', DATE_FORMAT(\`from\`,'%Y-%m-%d') \'from\', number_of_hours numberOfHours 
       FROM pds_voluntary_work 
       WHERE user_id_fk = ?  ORDER BY \`from\` DESC`,
        [employeeId],
      );
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async getVoluntaryWork(employeeId: string) {
    try {
      return await this.voluntaryWorkRepository.query(
        `
        SELECT voluntary_work_id _id, organization_name organizationName, position, DATE_FORMAT(\`to\`,'%Y-%m-%d') \'to\', DATE_FORMAT(\`from\`,'%Y-%m-%d') \'from\', number_of_hours numberOfHours 
         FROM pds_voluntary_work 
         WHERE user_id_fk = ?  ORDER BY \`from\` DESC`,
        [employeeId],
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
