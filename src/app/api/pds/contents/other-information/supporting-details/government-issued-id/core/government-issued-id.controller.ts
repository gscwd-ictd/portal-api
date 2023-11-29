import { GovernmentIssuedIdType } from './../data/government-issued-id.dto';
import { GovernmentIssuedIdService } from './government-issued-id.service';
import { Body, Controller, Param, Put } from '@nestjs/common';

@Controller('pds/government-issued-id/')
export class GovernmentIssuedIdController {
  constructor(private readonly governmentIssuedIdService: GovernmentIssuedIdService) {}

  @Put(':employee_id')
  async updateGovernmentIssuedId(
    @Param('employee_id') employeeId: string,
    @Body() governmentIssuedIdDTO: GovernmentIssuedIdType,
  ) {
    return await this.governmentIssuedIdService.updateGovernmentIssuedId(employeeId, governmentIssuedIdDTO);
  }
}
