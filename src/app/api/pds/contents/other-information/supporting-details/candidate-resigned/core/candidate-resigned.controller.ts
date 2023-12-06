import { Controller } from '@nestjs/common';
import { CandidateResignedService } from './candidate-resigned.service';

@Controller('pds/candidate-resigned/')
export class CandidateResignedController {
  constructor(private readonly candidateResignedService: CandidateResignedService) {}
}
