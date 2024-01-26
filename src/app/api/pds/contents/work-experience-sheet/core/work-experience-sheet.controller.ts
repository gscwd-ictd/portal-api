import { WorkExperienceSheetAddDTO } from './../data/work-experience-sheet.dto';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { WorkExperienceSheetDTO } from '../data/work-experience-sheet.dto';
import { WorkExperienceSheetService } from './work-experience-sheet.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('pds/work-experience-sheet')
export class WorkExperienceSheetController {
  constructor(private readonly workExperienceSheetService: WorkExperienceSheetService) {}
  @Post(':posting_applicant_id')
  async addWorkExperienceSheet(
    @Param('posting_applicant_id') postingApplicantId: string,
    @Body() workExperienceSheetDTO: WorkExperienceSheetAddDTO,
  ) {
    return await this.workExperienceSheetService.addWorkExperienceSheet(postingApplicantId, workExperienceSheetDTO);
  }

  @MessagePattern({ msg: 'add_employee_work_experience_sheet' })
  async addWorkExperienceSheetMS(
    @Payload() payload: { postingApplicantId: string; workExperienceSheetAddDTO: WorkExperienceSheetAddDTO },
  ) {
    console.log('Emp Portal MS: ');
    return await this.workExperienceSheetService.addWorkExperienceSheet(
      payload.postingApplicantId,
      payload.workExperienceSheetAddDTO,
    );
  }
}
