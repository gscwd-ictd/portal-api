import { Body, Controller, Get, Param, Post, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { PdsDTO } from '../data/pds.dto';
import { PdsService } from './pds.service';
import { MsExceptionFilter } from '../../../../utils/filters/rpc-exception.filter';

@Controller('pds')
export class PdsController {
  constructor(private readonly pdsService: PdsService) {}

  @Get(':employee_id')
  async getPds(@Param('employee_id') employeeId: string) {
    return await this.pdsService.getPdsV2(employeeId);
  }

  @Get(':employee_id/v2')
  async getPdsV2(@Param('employee_id') employeeId: string) {
    return await this.pdsService.getPdsV2(employeeId);
  }

  @Get('/v2/:employee_id')
  async getPdsV2Emp(@Param('employee_id') employeeId: string) {
    return await this.pdsService.getPdsV2(employeeId);
  }

  @Get('/psb/:posting_applicant_id')
  async getApplicantPdsWithWorkExperience(@Param('posting_applicant_id') postingApplicantId: string) {
    return await this.pdsService.getApplicantPdsWithWorkExperience(postingApplicantId);
  }

  @Post(':employee_id')
  async savePds(@Body() pdsDto: PdsDTO, @Param('employee_id') employeeId: string) {
    return await this.pdsService.savePds(pdsDto, employeeId);
  }

  @UseFilters(new MsExceptionFilter())
  @MessagePattern('get_lsp_pds_details')
  async getLspPdsDetails(@Payload() employeeId: string) {
    try {
      const result = await this.pdsService.getLspPdsDetails(employeeId);
      //console.log(result);
      return result;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
