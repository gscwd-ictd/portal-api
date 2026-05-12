import { WorkExperienceSheetAddDTO } from './../data/work-experience-sheet.dto';
import { Body, Controller, Get, Param, Post, UseFilters } from '@nestjs/common';
import { WorkExperienceSheetDTO } from '../data/work-experience-sheet.dto';
import { WorkExperienceSheetService } from './work-experience-sheet.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { MsExceptionFilter } from '../../../../../../utils/filters/rpc-exception.filter';

@Controller('pds/work-experience-sheet/')
export class WorkExperienceSheetController {
  constructor(private readonly workExperienceSheetService: WorkExperienceSheetService) {}
  @Post(':posting_applicant_id')
  async addWorkExperienceSheet(
    @Param('posting_applicant_id') postingApplicantId: string,
    @Body() workExperienceSheetDTO: WorkExperienceSheetAddDTO,
  ) {
    return await this.workExperienceSheetService.addWorkExperienceSheet(postingApplicantId, workExperienceSheetDTO);
  }

  @UseFilters(new MsExceptionFilter())
  @MessagePattern({ msg: 'add_employee_work_experience_sheet' })
  async addWorkExperienceSheetMS(
    @Payload() payload: { postingApplicantId: string; workExperienceSheetAddDTO: WorkExperienceSheetAddDTO },
  ) {
    try {
      return await this.workExperienceSheetService.addWorkExperienceSheet(
        payload.postingApplicantId,
        payload.workExperienceSheetAddDTO,
      );
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @Get('/applicants/:posting_applicant_id')
  async getWorkExperienceSheet(@Param('posting_applicant_id') postingApplicantId: string) {
    return await this.workExperienceSheetService.getWorkExperienceSheet(postingApplicantId);
  }
}
