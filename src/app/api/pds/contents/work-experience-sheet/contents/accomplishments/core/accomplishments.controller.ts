import { Controller } from '@nestjs/common';
import { WorkExperienceService } from '../../../../work-experience/core/work-experience.service';
import { WorkExperienceSheetAccomplishmentsService } from './accomplishments.service';

@Controller('work-experience-sheet/accomplishments')
export class WorkExperienceSheetAccomplishmentsController {
  constructor(private readonly accomplishmentService: WorkExperienceSheetAccomplishmentsService) {}
}
