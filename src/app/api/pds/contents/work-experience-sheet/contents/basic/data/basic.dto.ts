import { IsNotEmpty, IsUUID } from 'class-validator';
import { WorkExperience } from '../../../../work-experience/data/work-experience.entity';

export class WorkExperienceSheetBasicDTO {
  _id?: string;

  @IsUUID()
  workExperienceId: WorkExperience;

  @IsUUID()
  postingApplicantId: string;

  @IsNotEmpty()
  office: string;

  @IsNotEmpty()
  supervisor: string;
}
