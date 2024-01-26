import { Controller } from '@nestjs/common';
import { ImmigrantService } from './immigrant.service';

@Controller('pds/immigrant')
export class ImmigrantController {
  constructor(private readonly immigrantService: ImmigrantService) {}
}
