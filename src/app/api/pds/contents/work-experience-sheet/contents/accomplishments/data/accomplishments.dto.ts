import { IsNotEmpty, IsUUID } from 'class-validator';
import { WorkExperienceSheetBasic } from '../../basic/data/basic.entity';

export class WorkExperienceSheetAccomplishmentsDTO {
  _id?: string;

  @IsUUID()
  workExperienceSheetBasicId: WorkExperienceSheetBasic;

  //@IsNotEmpty()
  accomplishment: string;
}
