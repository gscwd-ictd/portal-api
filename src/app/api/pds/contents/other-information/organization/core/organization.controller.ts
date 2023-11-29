import { AddOrganizationDTO } from './../data/organization.dto';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { OrganizationService } from './organization.service';

@Controller('pds/organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post(':employee_id')
  async addOrganization(@Param('employee_id') employeeId: string, @Body() organizationDTO: AddOrganizationDTO) {
    return await this.organizationService.addOrganization(employeeId, organizationDTO);
  }
}
