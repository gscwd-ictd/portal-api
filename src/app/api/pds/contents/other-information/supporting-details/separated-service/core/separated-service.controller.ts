import { Controller } from '@nestjs/common';
import { SeparatedServiceService } from './separated-service.service';

@Controller('pds_separated_service')
export class SeparatedServiceController {
  constructor(private readonly separatedServiceService: SeparatedServiceService) {}
}
