import { Controller } from '@nestjs/common';
import { WorkExperienceSheetBasicService } from './basic.service';

@Controller('pds/work-experience-sheet/basic')
export class WorkExperienceSheetBasicController {
  constructor(private readonly workExperienceSheetBasicService: WorkExperienceSheetBasicService) {}
}
