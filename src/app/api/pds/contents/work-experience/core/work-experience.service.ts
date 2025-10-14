import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdsCrudHelper } from '../../../../../../utils/helpers/pds-crud';
import { Repository } from 'typeorm';
import { WorkExperience } from '../data/work-experience.entity';
import { AddWorkExperienceDTO } from '../data/work-experience.dto';

@Injectable()
export class WorkExperienceService extends PdsCrudHelper<WorkExperience> {
  constructor(
    @InjectRepository(WorkExperience)
    private readonly workExperienceRepository: Repository<WorkExperience>,
  ) {
    super(workExperienceRepository);
  }
  async addWorkExperience(employeeId: string, workExperienceDTO: AddWorkExperienceDTO) {
    try {
      console.log(workExperienceDTO);
      const addWorkExperience = await Promise.all(
        workExperienceDTO.add.map(async (workExperience) => {
          const { _id, isEdited, isOngoing, isPresentWork, ...rest } = workExperience;
          return await this.createRecord(rest);
        }),
      );

      const updateWorkExperience = await Promise.all(
        workExperienceDTO.update.map(async (workExperience) => {
          const { _id, isEdited, isOngoing, isPresentWork, ...rest } = workExperience;
          const updateResult = await this.updateRecord(_id, rest);
          if (updateResult.affected > 0) return workExperience;
        }),
      );

      const deleteWorkExperience = await Promise.all(
        workExperienceDTO.delete.map(async (workExperience) => {
          const { _id, ...rest } = workExperience;
          const deleteResult = await this.softDeleteRecord(_id);
          if (deleteResult.affected > 0) return workExperience;
        }),
      );

      return await this.workExperienceRepository.query(
        `
        SELECT 
          work_experience_id _id,
          position_title positionTitle,
          company_name companyName,
          monthly_salary monthlySalary,
          appointment_status appointmentStatus,
          is_government_service isGovernmentService,
          salary_grade salaryGrade,
          DATE_FORMAT(\`from\`,'%Y-%m-%d') \'from\',
          DATE_FORMAT(\`to\`,'%Y-%m-%d') \'to\'
        FROM pds_work_experience 
        WHERE user_id_fk=? AND deleted_at IS NULL
        ORDER BY \`from\` DESC
      `,
        [employeeId],
      );
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async getWDWorkExperience(employeeId: string) {
    try {
      return await this.workExperienceRepository.query(
        `
        SELECT 
          work_experience_id _id,
          position_title positionTitle,
          company_name companyName,
          monthly_salary monthlySalary,
          appointment_status appointmentStatus,
          is_government_service isGovernmentService,
          salary_grade salaryGrade,
          DATE_FORMAT(\`from\`,'%Y-%m-%d') \'from\',
          DATE_FORMAT(\`to\`,'%Y-%m-%d') \'to\'
        FROM pds_work_experience 
        WHERE user_id_fk=? AND is_wd = true AND deleted_at IS NULL
        ORDER BY \`from\` DESC
      `,
        [employeeId],
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getWorkExperience(employeeId: string) {
    try {
      return await this.workExperienceRepository.query(
        `
        SELECT 
          work_experience_id _id,
          position_title positionTitle,
          company_name companyName,
          monthly_salary monthlySalary,
          appointment_status appointmentStatus,
          is_government_service isGovernmentService,
          salary_grade salaryGrade,
          DATE_FORMAT(\`from\`,'%Y-%m-%d') \'from\',
          DATE_FORMAT(\`to\`,'%Y-%m-%d') \'to\'
        FROM pds_work_experience 
        WHERE user_id_fk=? AND deleted_at IS NULL
        ORDER BY \`from\` DESC 
      `,
        [employeeId],
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
