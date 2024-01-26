import { Controller } from '@nestjs/common';
import { GuiltyChargedService } from './guilty-charged.service';

@Controller('pds/guilty-charged')
export class GuiltyChargedController {
  constructor(private readonly guiltyChargedService: GuiltyChargedService) {}
}
