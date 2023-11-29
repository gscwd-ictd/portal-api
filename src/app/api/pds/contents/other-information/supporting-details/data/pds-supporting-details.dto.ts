import { CandidateResignedDTO } from '../candidate-resigned/data/candidate-resigned.dto';
import { ConvictedDTO } from '../convicted/data/convicted.dto';
import { GovernmentIssuedIdDTO } from '../government-issued-id/data/government-issued-id.dto';
import { GuiltyChargedDTO } from '../guilty-charged/data/guilty-charged.dto';
import { ImmigrantDTO } from '../immigrant/data/immigrant.dto';
import { IndigenousPWDSoloParentDTO } from '../indigenous-pwd-soloparent/data/indigenous-pwd-soloparent.dto';
import { OfficeRelationDTO } from '../office-relation/data/office-relation.dto';
import { SeparatedServiceDTO } from '../separated-service/data/separated-service.dto';

export class PdsSupportingDetailsDto {
  candidateResigned: CandidateResignedDTO;
  governmentIssuedId: GovernmentIssuedIdDTO;
  convicted: ConvictedDTO;
  guiltyCharged: GuiltyChargedDTO;
  immigrant: ImmigrantDTO;
  indigenousPwdSoloParent: IndigenousPWDSoloParentDTO;
  officeRelation: OfficeRelationDTO;
  separatedService: SeparatedServiceDTO;
}
