import { IsNotEmpty, IsUUID } from 'class-validator';
import { WorkExperienceSheetBasic } from '../../basic/data/basic.entity';

export class WorkExperienceSheetDutiesDTO {
  _id?: string;

  @IsUUID()
  workExperienceSheetBasicId: WorkExperienceSheetBasic;

  @IsNotEmpty()
  duty: string;
}
