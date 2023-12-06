import { IsOptional } from 'class-validator';
import { WorkExperienceSheetAccomplishmentsDTO } from '../contents/accomplishments/data/accomplishments.dto';
import { WorkExperienceSheetBasicDTO } from '../contents/basic/data/basic.dto';
import { WorkExperienceSheetDutiesDTO } from '../contents/duties/data/duties.dto';

export class WorkExperienceSheetDTO {
  basic: WorkExperienceSheetBasicDTO;
  duties: WorkExperienceSheetDutiesDTO[];
  accomplishments: WorkExperienceSheetAccomplishmentsDTO[];
}

export class WorkExperienceSheetAddDTO {
  vppId: string;

  @IsOptional()
  workExperienceSheet: WorkExperienceSheetDTO[];
}
