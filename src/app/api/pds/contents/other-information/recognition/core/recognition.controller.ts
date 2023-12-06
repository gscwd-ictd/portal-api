import { Body, Controller, Param, Post } from '@nestjs/common';
import { AddRecognitionDTO } from '../data/recognition.dto';
import { RecognitionService } from './recognition.service';

@Controller('pds/recognition')
export class RecognitionController {
  constructor(private readonly recognitionService: RecognitionService) {}

  @Post(':employee_id')
  async addRecognition(@Param('employee_id') employeeId: string, @Body() recognitionDTO: AddRecognitionDTO) {
    return await this.recognitionService.addRecognition(employeeId, recognitionDTO);
  }
}
