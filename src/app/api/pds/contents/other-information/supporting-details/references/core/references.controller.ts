import { AddReferencesDTO } from './../data/references.dto';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { ReferencesService } from './references.service';

@Controller('pds/references')
export class ReferenceController {
  constructor(private readonly referenceService: ReferencesService) {}

  @Post(':employee_id')
  async addReferences(@Param('employee_id') employeeId: string, @Body() referencesDTO: AddReferencesDTO) {
    console.log(referencesDTO);
    return await this.referenceService.addReferences(employeeId, referencesDTO);
  }
}
