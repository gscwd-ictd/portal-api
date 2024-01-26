import { Controller } from '@nestjs/common';
import { IndigenousPWDSoloParentService } from './indigenous-pwd-soloparent.service';

@Controller('pds/indigenous-pwd-soloparent')
export class IndigenousPWDSoloParentController {
  constructor(private readonly indigenousPWDSoloParentService: IndigenousPWDSoloParentService) {}
}
