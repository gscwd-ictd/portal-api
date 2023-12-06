import { Controller } from '@nestjs/common';
import { WorkExperienceSheetDutiesService } from './duties.service';

@Controller('work-experience-sheet/duties')
export class WorkExperienceSheetDutiesController {
  constructor(private readonly dutiesService: WorkExperienceSheetDutiesService) {}
}
