import { Controller } from '@nestjs/common';
import { OfficeRelationService } from './office-relation.service';

@Controller('pds/office-relation')
export class OfficeRelationController {
  constructor(private readonly officeRelationService: OfficeRelationService) {}
}
