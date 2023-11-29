import { CreatePermanentAddressDto } from '../contents/basic-info/address-info/permanent/data/permanent.dto';
import { CreateResidentialAddressDto } from '../contents/basic-info/address-info/residential/data/residential.dto';
import { CreateGovernmentInfoDto } from '../contents/basic-info/government-info/data/government-info.dto';
import { CreatePersonalInfoDto } from '../contents/basic-info/personal-info/data/personal-info.dto';
import { EducationDTO } from '../contents/education/data/education.dto';
import { ElementaryDTO } from '../contents/education/parts/elementary/data/elementary.dto';
import { EligibilityDTO } from '../contents/eligibility/data/eligibility.dto';
import { CreateChildDto } from '../contents/family/children/data/children.dto';
import { CreateParentsDto } from '../contents/family/parents/data/parents.dto';
import { CreateSpouseDto } from '../contents/family/spouse/data/spouse.dto';
import { LearningDevelopmentDTO } from '../contents/learning-development/data/learning-development.dto';
import { OrganizationDTO } from '../contents/other-information/organization/data/organization.dto';
import { RecognitionDTO } from '../contents/other-information/recognition/data/recognition.dto';
import { SkillsDTO } from '../contents/other-information/skills/data/skills.dto';
import { CandidateResignedDTO } from '../contents/other-information/supporting-details/candidate-resigned/data/candidate-resigned.dto';
import { ConvictedDTO } from '../contents/other-information/supporting-details/convicted/data/convicted.dto';
import { GovernmentIssuedIdDTO } from '../contents/other-information/supporting-details/government-issued-id/data/government-issued-id.dto';
import { GuiltyChargedDTO } from '../contents/other-information/supporting-details/guilty-charged/data/guilty-charged.dto';
import { ImmigrantDTO } from '../contents/other-information/supporting-details/immigrant/data/immigrant.dto';
import { IndigenousPWDSoloParentDTO } from '../contents/other-information/supporting-details/indigenous-pwd-soloparent/data/indigenous-pwd-soloparent.dto';
import { OfficeRelationDTO } from '../contents/other-information/supporting-details/office-relation/data/office-relation.dto';
import { ReferencesDTO } from '../contents/other-information/supporting-details/references/data/references.dto';
import { SeparatedServiceDTO } from '../contents/other-information/supporting-details/separated-service/data/separated-service.dto';
import { VoluntaryWorkDTO } from '../contents/voluntary-work/data/voluntary-work.dto';
import { WorkExperienceDTO } from '../contents/work-experience/data/work-experience.dto';

export class PdsDTO {
  personalInfo?: CreatePersonalInfoDto;
  permanentAddress: CreatePermanentAddressDto;
  residentialAddress?: CreateResidentialAddressDto;
  governmentIssuedIds?: CreateGovernmentInfoDto;
  spouse?: CreateSpouseDto;
  children?: CreateChildDto[];
  parents: CreateParentsDto;
  elementary: ElementaryDTO;
  secondary: EducationDTO;
  vocational?: EducationDTO[];
  college?: EducationDTO[];
  graduate?: EducationDTO[];
  eligibility?: EligibilityDTO[];
  workExperience?: WorkExperienceDTO[];
  voluntaryWork?: VoluntaryWorkDTO[];
  learningDevelopment?: LearningDevelopmentDTO[];
  skills?: SkillsDTO[];
  recognitions?: RecognitionDTO[];
  organizations?: OrganizationDTO[];
  officeRelation: OfficeRelationDTO;
  guiltyCharged: GuiltyChargedDTO;
  convicted: ConvictedDTO;
  separatedService: SeparatedServiceDTO;
  candidateResigned: CandidateResignedDTO;
  immigrant: ImmigrantDTO;
  indigenousPwdSoloParent: IndigenousPWDSoloParentDTO;
  references: ReferencesDTO[];
  governmentIssuedId: GovernmentIssuedIdDTO;
}

// export class PdsDTO {
//   personalInfo?: CreatePersonalInfoDto;
//   governmentIssuedIds?: CreateGovernmentInfoDto;
//   address: {
//     permanentAddress: CreatePermanentAddressDto;
//     residentialAddress?: CreateResidentialAddressDto;
//   };
//   familyBackground?: {
//     children?: CreateChildDto[];
//     spouse?: CreateParentsDto;
//     parents: CreateParentsDto;
//   };
//   education?: {
//     elementary: ElementaryDTO;
//     secondary: EducationDTO;
//     vocational?: EducationDTO[];
//     college?: EducationDTO[];
//     graduate?: EducationDTO[];
//   };
//   eligibility?: EligibilityDTO[];
//   workExperience?: WorkExperienceDTO[];
//   voluntaryWork?: VoluntaryWorkDTO[];
//   learningDevelopment?: LearningDevelopmentDTO;
//   otherInformation?: {
//     skills?: SkillsDTO[];
//     recognitions?: RecognitionDTO[];
//     organizations?: OrganizationDTO[];
//     supportingDetails: {
//       officeRelation: OfficeRelationDTO;
//       guiltyCharged: GuiltyChargedDTO;
//       convicted: ConvictedDTO;
//       separatedService: SeparatedServiceDTO;
//       candidateResigned: CandidateResignedDTO;
//       immigrant: ImmigrantDTO;
//       indigenousPwdSoloParent: IndigenousPWDSoloParentDTO;
//       references: ReferencesDTO[];
//       governmentIssuedId: GovernmentIssuedIdDTO;
//     };
//   };
// }
