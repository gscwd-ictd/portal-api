import { WorkExperienceSheetAccomplishments } from './../contents/accomplishments/data/accomplishments.entity';
import { WorkExperienceSheetBasic } from './../contents/basic/data/basic.entity';
import { Injectable, HttpException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { WorkExperienceSheetAccomplishmentsService } from '../contents/accomplishments/core/accomplishments.service';
import { WorkExperienceSheetBasicService } from '../contents/basic/core/basic.service';
import { WorkExperienceSheetDutiesService } from '../contents/duties/core/duties.service';
import { WorkExperienceSheetAddDTO, WorkExperienceSheetDTO } from '../data/work-experience-sheet.dto';

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
      const { vppId, workExperienceSheet } = workExperienceSheetDTO;

      const workExperienceSheets = await Promise.all(
        workExperienceSheet.map(async (workExperienceSheetItem) => {
          const { basic, duties, accomplishments } = workExperienceSheetItem;
          //console.log('DTO !!!!', workExperienceSheetItem);
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
      //throw new HttpException(error.message, error.status);
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
}
