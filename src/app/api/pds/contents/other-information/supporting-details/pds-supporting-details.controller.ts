import { Body, Controller, Param, Put } from '@nestjs/common';
import { PdsSupportingDetailsDto } from './data/pds-supporting-details.dto';
import { PdsSupportingDetailsService } from './pds-supporting-details.service';

@Controller('pds/supporting-details')
export class PdsSupportingDetailsController {
  constructor(private readonly pdsSupportingService: PdsSupportingDetailsService) {}

  @Put()
  async updateSupportingDetails(@Body() pdsSupportingDetailsDto: PdsSupportingDetailsDto) {
    return await this.pdsSupportingService.updatePdsSupportingDetailsService(pdsSupportingDetailsDto);
  }
}
