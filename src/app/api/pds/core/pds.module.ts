import { Module } from '@nestjs/common';
import { PdsService } from './pds.service';
import { PdsController } from './pds.controller';
import { PersonalInfoModule } from '../contents/basic-info/personal-info/core/personal-info.module';
import { GovernmentInfoModule } from '../contents/basic-info/government-info/core/government-info.module';
import { PermanentAddressModule } from '../contents/basic-info/address-info/permanent/core/permanent.module';
import { ResidentialAddressModule } from '../contents/basic-info/address-info/residential/core/residential.module';
import { SpouseModule } from '../contents/family/spouse/core/spouse.module';
import { ParentsModule } from '../contents/family/parents/core/parents.module';
import { VoluntaryWorkModule } from '../contents/voluntary-work/core/voluntary-work.module';
import { LearningDevelopmentModule } from '../contents/learning-development/core/learning-development.module';
import { OrganizationModule } from '../contents/other-information/organization/core/organization.module';
import { SkillsModule } from '../contents/other-information/skills/core/skills.module';
import { CandidateResignedModule } from '../contents/other-information/supporting-details/candidate-resigned/core/candidate-resigned.module';
import { ConvictedModule } from '../contents/other-information/supporting-details/convicted/core/convicted.module';
import { GuiltyChargedModule } from '../contents/other-information/supporting-details/guilty-charged/core/guilty-charged.module';
import { ImmigrantModule } from '../contents/other-information/supporting-details/immigrant/core/immigrant.module';
import { IndigenousPWDSoloParentModule } from '../contents/other-information/supporting-details/indigenous-pwd-soloparent/core/indigenous-pwd-soloparent.module';
import { OfficeRelationModule } from '../contents/other-information/supporting-details/office-relation/core/office-relation.module';
import { ReferencesModule } from '../contents/other-information/supporting-details/references/core/references.module';
import { SeparatedServiceModule } from '../contents/other-information/supporting-details/separated-service/core/separated-service.module';
import { GovernmentIssuedIdModule } from '../contents/other-information/supporting-details/government-issued-id/core/government-issued-id.module';
import { ChildrenModule } from '../contents/family/children/core/children.module';
import { RecognitionModule } from '../contents/other-information/recognition/core/recognition.module';
import { WorkExperienceModule } from '../contents/work-experience/core/work-experience.module';
import { EmployeeModule } from '../../employee/core/employee.module';
import { EligibilityModule } from '../contents/eligibility/core/eligibility.module';
import { EducationModule } from '../contents/education/core/education.module';
import { WorkExperienceSheetModule } from '../contents/work-experience-sheet/core/work-experience-sheet.module';

@Module({
  imports: [
    EmployeeModule,
    PersonalInfoModule,
    GovernmentInfoModule,
    PermanentAddressModule,
    ResidentialAddressModule,
    SpouseModule,
    ParentsModule,
    ChildrenModule,
    EducationModule,
    EligibilityModule,
    LearningDevelopmentModule,
    VoluntaryWorkModule,
    OrganizationModule,
    SkillsModule,
    CandidateResignedModule,
    ConvictedModule,
    GuiltyChargedModule,
    ImmigrantModule,
    IndigenousPWDSoloParentModule,
    OfficeRelationModule,
    ReferencesModule,
    RecognitionModule,
    SeparatedServiceModule,
    GovernmentIssuedIdModule,
    WorkExperienceModule,
    WorkExperienceSheetModule,
  ],
  providers: [PdsService],
  controllers: [PdsController],
  exports: [
    EmployeeModule,
    PersonalInfoModule,
    GovernmentInfoModule,
    PermanentAddressModule,
    ResidentialAddressModule,
    SpouseModule,
    ParentsModule,
    ChildrenModule,
    EducationModule,
    EligibilityModule,
    LearningDevelopmentModule,
    VoluntaryWorkModule,
    OrganizationModule,
    SkillsModule,
    CandidateResignedModule,
    ConvictedModule,
    GuiltyChargedModule,
    ImmigrantModule,
    IndigenousPWDSoloParentModule,
    OfficeRelationModule,
    ReferencesModule,
    RecognitionModule,
    SeparatedServiceModule,
    GovernmentIssuedIdModule,
    WorkExperienceModule,
    WorkExperienceSheetModule,
    PdsService,
  ],
})
export class PdsModule {}
