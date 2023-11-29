import {
  DeleteLearningDevelopmentDTO,
  LearningDevelopmentDTO,
  AddLearningDevelopmentDTO,
} from './../data/learning-development.dto';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../utils/helpers/pds-crud';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { LearningDevelopment } from '../data/learning-development.entity';
import { UpdateLearningDevelopmentDTO } from '../data/learning-development.dto';

@Injectable()
export class LearningDevelopmentService extends PdsCrudHelper<LearningDevelopment> {
  constructor(
    @InjectRepository(LearningDevelopment)
    private readonly learningDevelopmentRepository: Repository<LearningDevelopment>,
  ) {
    super(learningDevelopmentRepository);
  }

  async updateLearningAndDevelopment(updateLearningAndDevelopmentDTO: UpdateLearningDevelopmentDTO) {
    try {
      const learningAndDevelopment = await Promise.all(
        updateLearningAndDevelopmentDTO.learningAndDevelopment.map(async (learningAndDevelopmentItem) => {
          const { _id, ...rest } = learningAndDevelopmentItem;
          const updateResult = await this.learningDevelopmentRepository
            .createQueryBuilder()
            .update()
            .set(rest)
            .where({ _id })
            .execute();
          if (updateResult.affected > 0) return learningAndDevelopmentItem;
        }),
      );
      return learningAndDevelopment;
    } catch (error) {}
  }

  async deleteLearningAndDevelopment(deleteLearningAndDevelopmentDTO: DeleteLearningDevelopmentDTO) {
    try {
      const learningDevelopment = await this.learningDevelopmentRepository.query(
        `SELECT * FROM pds_learning_development WHERE _id IN (?);`,
        [deleteLearningAndDevelopmentDTO.learningAndDevelopmentIds],
      );
      const deleteResult = await this.learningDevelopmentRepository.query(
        `DELETE FROM pds_learning_development WHERE _id IN (?);`,
        [deleteLearningAndDevelopmentDTO.learningAndDevelopmentIds],
      );
      if (deleteResult.affectedRows > 0) return learningDevelopment;
    } catch (error) {}
  }

  async deleteLearningAndDevelopment2(_id: string) {
    try {
      const deleteResult = await this.learningDevelopmentRepository.delete(_id);
      if (deleteResult.affected > 0) return { deletedLearningAndDevelopmentId: _id };
    } catch (error) {}
  }

  async getAllWDLearningAndDevelopment(employeeId: string) {
    try {
      return await this.learningDevelopmentRepository.query(
        `SELECT 
          learning_development_id _id,
          title,
          conducted_by conductedBy,
          \`type\`,
          DATE_FORMAT(\`from\`,'%Y-%m-%d') \`from\`,
          DATE_FORMAT(\`to\` ,'%Y-%m-%d') \`to\`,
          number_of_hours numberOfHours 
          FROM pds_learning_development WHERE user_id_fk=? AND is_wd=true ORDER BY \`from\` DESC
      `,
        [employeeId],
      );
    } catch (error) {}
  }
  async getAllLearningAndDevelopment(employeeId: string) {
    try {
      return await this.learningDevelopmentRepository.query(
        `SELECT 
          learning_development_id _id,
          title,
          conducted_by conductedBy,
          \`type\`,
          DATE_FORMAT(\`from\`,'%Y-%m-%d') \`from\`,
          DATE_FORMAT(\`to\` ,'%Y-%m-%d') \`to\`,
          number_of_hours numberOfHours 
          FROM pds_learning_development WHERE user_id_fk=? ORDER BY \`from\` DESC
      `,
        [employeeId],
      );
    } catch (error) {}
  }

  async addLearningAndDevelopment(employeeId: string, learningDevelopmentDTO: AddLearningDevelopmentDTO) {
    try {
      console.log(learningDevelopmentDTO);
      const addLearningAndDevelopment = await Promise.all(
        learningDevelopmentDTO.add.map(async (learningAndDevelopment) => {
          const { _id, isEdited, ...rest } = learningAndDevelopment;
          return await this.createRecord({ employeeId, ...rest });
        }),
      );

      const updateLearningAndDevelopment = await Promise.all(
        learningDevelopmentDTO.update.map(async (learningAndDevelopment) => {
          const { _id, isEdited, ...rest } = learningAndDevelopment;
          const updateResult = await this.updateRecord(_id, rest);
          if (updateResult.affected > 0) return learningAndDevelopment;
        }),
      );

      const deleteLearningAndDevelopment = await Promise.all(
        learningDevelopmentDTO.delete.map(async (learningAndDevelopment) => {
          const { _id, ...rest } = learningAndDevelopment;
          const deleteResult = await this.deleteRecord(_id);
          if (deleteResult.affected > 0) return learningAndDevelopment;
        }),
      );
      return await this.learningDevelopmentRepository.query(
        `SELECT 
          learning_development_id _id,
          title,
          conducted_by conductedBy,
          \`type\`,
          DATE_FORMAT(\`from\`,'%Y-%m-%d') \`from\`,
          DATE_FORMAT(\`to\` ,'%Y-%m-%d') \`to\`, 
          number_of_hours numberOfHours 
          FROM pds_learning_development WHERE user_id_fk=? ORDER BY \`from\` DESC
      `,
        [employeeId],
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
