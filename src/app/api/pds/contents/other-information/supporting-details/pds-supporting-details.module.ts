import { Module } from '@nestjs/common';
import { CandidateResignedModule } from './candidate-resigned/core/candidate-resigned.module';
import { ConvictedModule } from './convicted/core/convicted.module';
import { GovernmentIssuedIdModule } from './government-issued-id/core/government-issued-id.module';
import { GuiltyChargedModule } from './guilty-charged/core/guilty-charged.module';
import { GuiltyCharged } from './guilty-charged/data/guilty-charged.entity';
import { ImmigrantModule } from './immigrant/core/immigrant.module';
import { IndigenousPWDSoloParentModule } from './indigenous-pwd-soloparent/core/indigenous-pwd-soloparent.module';
import { OfficeRelationModule } from './office-relation/core/office-relation.module';
import { PdsSupportingDetailsController } from './pds-supporting-details.controller';
import { PdsSupportingDetailsService } from './pds-supporting-details.service';
import { SeparatedServiceModule } from './separated-service/core/separated-service.module';

@Module({
  imports: [
    CandidateResignedModule,
    ConvictedModule,
    GovernmentIssuedIdModule,
    GuiltyChargedModule,
    ImmigrantModule,
    IndigenousPWDSoloParentModule,
    OfficeRelationModule,
    SeparatedServiceModule,
  ],
  controllers: [PdsSupportingDetailsController],
  providers: [PdsSupportingDetailsService],
})
export class PdsSupportingDetailsModule {}
