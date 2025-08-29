import { Injectable, HttpException, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { WorkExperienceSheetAccomplishmentsService } from '../contents/accomplishments/core/accomplishments.service';
import { WorkExperienceSheetBasicService } from '../contents/basic/core/basic.service';
import { WorkExperienceSheetDutiesService } from '../contents/duties/core/duties.service';
import { WorkExperienceSheetAddDTO, WorkExperienceSheetDTO } from '../data/work-experience-sheet.dto';
import { ClientProxy } from '@nestjs/microservices';
import { MicroserviceType } from '../../../../../../utils/types/microservice-type';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WorkExperienceSheetService {
  constructor(
    private readonly dutiesService: WorkExperienceSheetDutiesService,
    private readonly accomplishmentsService: WorkExperienceSheetAccomplishmentsService,
    private readonly basicService: WorkExperienceSheetBasicService,
    private readonly dataSource: DataSource,
  ) {}

  async addWorkExperienceSheet(postingApplicantId: string, workExperienceSheetDTO: WorkExperienceSheetAddDTO) {
    try {
      console.log('WORK EXPERIENCE SHEET', postingApplicantId, workExperienceSheetDTO);
      const { workExperienceSheet } = workExperienceSheetDTO;

      const workExperienceSheets = await Promise.all(
        workExperienceSheet.map(async (workExperienceSheetItem) => {
          const { basic, duties, accomplishments } = workExperienceSheetItem;
          console.log('DTO !!!!', workExperienceSheetItem);
          const basicResult = await this.basicService.createRecord({ ...basic, postingApplicantId });

          console.log('WORK EXPERIENCE LOG BASIC:   ', basicResult);
          //console.log(basicResult[0]);
          const workExperienceSheetBasicId = basicResult._id;
          const accomplishmentsResult = await Promise.all(
            accomplishments.map(async (accomplishment) => {
              console.log('HERERERERERE MICROSERVICE !!!');

              return await this.accomplishmentsService.createRecord({
                accomplishment: accomplishment.accomplishment,
                workExperienceSheetBasicId,
              });
            }),
          );

          const dutiesResult = await Promise.all(
            duties.map(async (duty) => {
              return await this.dutiesService.createRecord({
                duty: duty.duty,
                workExperienceSheetBasicId,
              });
            }),
          );
          return { basicResult, accomplishmentsResult, dutiesResult };
        }),
      );
      /* const result = await this.dataSource.manager.transaction(async (transactionEntityManager) => {
        const { vppId, workExperienceSheet } = workExperienceSheetDTO;

        const workExperienceSheets = await Promise.all(
          workExperienceSheet.map(async (workExperienceSheetItem) => {

            const { basic, duties, accomplishments } = workExperienceSheetItem;
            //console.log('DTO !!!!', workExperienceSheetItem);
            const basicResult = await transactionEntityManager.getRepository(WorkExperienceSheetBasic).save({
              postingApplicantId,
              ...basic,
            });

            console.log('WORK EXPERIENCE LOG BASIC:   ', basicResult);
            //console.log(basicResult[0]);
            const workExperienceSheetBasicId = basicResult._id;
            const accomplishmentsResult = await Promise.all(
              accomplishments.map(async (accomplishment) => {
                console.log('HERERERERERE MICROSERVICE !!!');
                return await transactionEntityManager.getRepository(WorkExperienceSheetAccomplishments).save(
                  await this.accomplishmentsService.createObject({
                    accomplishment: accomplishment.accomplishment,
                    workExperienceSheetBasicId,
                  }),
                );
              }),
            );

            const dutiesResult = await Promise.all(
              duties.map(async (duty) => {
                return await transactionEntityManager.save(
                  await this.accomplishmentsService.createObject({
                    ...duty,
                    workExperienceSheetBasicId,
                  }),
                );
              }),
            );
            return { basicResult, accomplishmentsResult, dutiesResult };
          }),
        )

        return workExperienceSheets;
      }); */
      return workExperienceSheets;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async addWorkExpSheet(postingApplicantId: string, workExperienceSheetDTO: WorkExperienceSheetDTO) {
    try {
      const result = await this.dataSource.manager.transaction(async (transactionEntityManager) => {
        const basic = await transactionEntityManager.save(
          await this.basicService.createObject({
            postingApplicantId,
            ...workExperienceSheetDTO.basic,
          }),
        );
        console.log('HERERERERERE MICROSERVICE !!!');
        const accomplishments = await Promise.all(
          workExperienceSheetDTO.accomplishments.map(async (accomplishment) => {
            return await transactionEntityManager.save(
              await this.accomplishmentsService.createObject({
                postingApplicantId,
                ...accomplishment,
              }),
            );
          }),
        );
        console.log('HERERERERERE MICROSERVICE !!!');
        const duties = await Promise.all(
          workExperienceSheetDTO.duties.map(async (duty) => {
            return await transactionEntityManager.save(
              await this.dutiesService.createObject({
                postingApplicantId,
                ...duty,
              }),
            );
          }),
        );

        return {
          postingApplicantId,
          workExperienceSheet: { basic, accomplishments, duties },
        };
      });

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async getWorkExperienceSheet(postingApplicantId: string) {
    // const employeeId = await lastValueFrom(
    //   this.client.send('get_employee_id_by_posting_applicant_id', postingApplicantId),
    // );

    const basic = await this.basicService.getWorkExperienceSheetBasicByPostingApplicantId(postingApplicantId);

    const result = await Promise.all(
      basic.map(async (basicItem) => {
        const { workExperienceId, _id, ...rest } = basicItem;
        const workExperience = (
          await this.dataSource.query(
            `
           SELECT position_title positionTitle, company_name companyName, monthly_salary monthlySalary, appointment_status appointmentStatus, 
           is_government_service isGovernmentService, salary_grade salaryGrade, \`from\`, \`to\`, is_wd isWd FROM 
          pds_work_experience WHERE work_experience_id = ? ORDER BY \`from\` DESC
        `,
            [workExperienceId],
          )
        )[0];
        console.log(workExperience);
        const accomplishments = await this.accomplishmentsService.getAccomplishmentsByBasicId(basicItem._id);
        const duties = await this.dutiesService.getDutiesByBasicId(basicItem._id);
        return { ...rest, workExperienceId, ...workExperience, accomplishments, duties };
      }),
    );
     return result.sort((a, b) => new Date(b.from).getTime() - new Date(a.from).getTime());
    //console.log('asd ', basic[0].workExperienceId);
  }
}
