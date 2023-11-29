import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MicroserviceType } from '../../../../utils/types/microservice-type';
import { DataSource } from 'typeorm';
import { EmployeeService } from '../../employee/core/employee.service';
import { Employee } from '../../employee/data/employee.entity';
import { PermanentAddressService } from '../contents/basic-info/address-info/permanent/core/permanent.service';
import { ResidentialAddressService } from '../contents/basic-info/address-info/residential/core/residential.service';
import { GovernmentInfoService } from '../contents/basic-info/government-info/core/government-info.service';
import { PersonalInfoService } from '../contents/basic-info/personal-info/core/personal-info.service';
import { CollegeService } from '../contents/education/parts/college/core/college.service';
import { ElementaryService } from '../contents/education/parts/elementary/core/elementary.service';
import { GraduateService } from '../contents/education/parts/graduate/core/graduate.service';
import { SecondaryService } from '../contents/education/parts/secondary/core/secondary.service';
import { VocationalService } from '../contents/education/parts/vocational/core/vocational.service';
import { EligibilityService } from '../contents/eligibility/core/eligibility.service';
import { ChildrenService } from '../contents/family/children/core/children.service';
import { ParentsService } from '../contents/family/parents/core/parents.service';
import { SpouseService } from '../contents/family/spouse/core/spouse.service';
import { LearningDevelopmentService } from '../contents/learning-development/core/learning-development.service';
import { OrganizationService } from '../contents/other-information/organization/core/organization.service';
import { RecognitionService } from '../contents/other-information/recognition/core/recognition.service';
import { SkillsService } from '../contents/other-information/skills/core/skills.service';
import { CandidateResignedService } from '../contents/other-information/supporting-details/candidate-resigned/core/candidate-resigned.service';
import { ConvictedService } from '../contents/other-information/supporting-details/convicted/core/convicted.service';
import { GovernmentIssuedIdService } from '../contents/other-information/supporting-details/government-issued-id/core/government-issued-id.service';
import { GuiltyChargedService } from '../contents/other-information/supporting-details/guilty-charged/core/guilty-charged.service';
import { ImmigrantService } from '../contents/other-information/supporting-details/immigrant/core/immigrant.service';
import { IndigenousPWDSoloParentService } from '../contents/other-information/supporting-details/indigenous-pwd-soloparent/core/indigenous-pwd-soloparent.service';
import { OfficeRelationService } from '../contents/other-information/supporting-details/office-relation/core/office-relation.service';
import { ReferencesService } from '../contents/other-information/supporting-details/references/core/references.service';
import { SeparatedServiceService } from '../contents/other-information/supporting-details/separated-service/core/separated-service.service';
import { VoluntaryWorkService } from '../contents/voluntary-work/core/voluntary-work.service';
import { WorkExperienceService } from '../contents/work-experience/core/work-experience.service';
import { PdsDTO } from '../data/pds.dto';
import { lastValueFrom } from 'rxjs';
import { WorkExperienceSheetService } from '../contents/work-experience-sheet/core/work-experience-sheet.service';

@Injectable()
export class PdsService {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly personalInfoService: PersonalInfoService,
    private readonly governmentInfoService: GovernmentInfoService,
    private readonly residentialAddressService: ResidentialAddressService,
    private readonly permanentAddressService: PermanentAddressService,
    private readonly childrenService: ChildrenService,
    private readonly spouseService: SpouseService,
    private readonly parentsService: ParentsService,
    private readonly elementaryService: ElementaryService,
    private readonly secondaryService: SecondaryService,
    private readonly vocationalService: VocationalService,
    private readonly collegeService: CollegeService,
    private readonly graduateService: GraduateService,
    private readonly eligibilityService: EligibilityService,
    private readonly workExperienceService: WorkExperienceService,
    private readonly voluntaryWorkService: VoluntaryWorkService,
    private readonly learningDevelopmentService: LearningDevelopmentService,
    private readonly skillsService: SkillsService,
    private readonly recognitionService: RecognitionService,
    private readonly organizationService: OrganizationService,
    private readonly officeRelationService: OfficeRelationService,
    private readonly guiltyChargedService: GuiltyChargedService,
    private readonly convictedService: ConvictedService,
    private readonly separatedServiceService: SeparatedServiceService,
    private readonly candidateResignedService: CandidateResignedService,
    private readonly immigrantService: ImmigrantService,
    private readonly indigenousPwdSoloParentService: IndigenousPWDSoloParentService,
    private readonly referencesService: ReferencesService,
    private readonly governmentIssuedIdService: GovernmentIssuedIdService,
    @Inject(MicroserviceType.EMPLOYEE_DETAILS)
    private readonly client: ClientProxy,
    private readonly workExperienceSheetService: WorkExperienceSheetService,
    private readonly dataSource: DataSource,
  ) {}

  async savePds(pdsDto: PdsDTO, employeeId: string) {
    try {
      const result = await this.dataSource.manager.transaction(async (transactionalEntityManager) => {
        const personalInfo = await transactionalEntityManager.save(
          await this.personalInfoService.createObject({
            ...pdsDto.personalInfo,
            employeeId,
          }),
        );

        const updateEmployeeDetails = await transactionalEntityManager
          .getRepository(Employee)
          .createQueryBuilder()
          .update()
          .set({
            mobileNumber: pdsDto.personalInfo.mobileNumber,
            birthDate: pdsDto.personalInfo.birthDate,
            sex: pdsDto.personalInfo.sex,
            middleName: pdsDto.personalInfo.middleName,
          })
          .where({ userId: employeeId })
          .execute();

        const governmentIssuedIds = await transactionalEntityManager.save(
          await this.governmentInfoService.createObject({
            ...pdsDto.governmentIssuedIds,
            employeeId,
          }),
        );

        const permanentAddress = await transactionalEntityManager.save(
          await this.permanentAddressService.createObject({
            ...pdsDto.permanentAddress,
            employeeId,
          }),
        );

        const residentialAddress = await transactionalEntityManager.save(
          await this.residentialAddressService.createObject({
            ...pdsDto.residentialAddress,
            employeeId,
          }),
        );

        let spouse = {};
        spouse = await transactionalEntityManager.save(
          await this.spouseService.createObject({
            ...pdsDto.spouse,
            employeeId,
          }),
        );

        let children = [];
        if (pdsDto.children.length > 0) {
          await Promise.all(
            pdsDto.children.map(async (child) => {
              const { _id, isEdited, ...rest } = child;
              children.push(
                await transactionalEntityManager.save(
                  await this.childrenService.createObject({
                    ...rest,
                    employeeId,
                  }),
                ),
              );
            }),
          );
        }

        let parents = {};
        parents = await transactionalEntityManager.save(
          await this.parentsService.createObject({
            ...pdsDto.parents,
            employeeId,
          }),
        );

        let elementary = {};
        elementary = await transactionalEntityManager.save(
          await this.elementaryService.createObject({
            ...pdsDto.elementary,
            employeeId,
          }),
        );

        let secondary = {};
        if (pdsDto.secondary && pdsDto.secondary !== null && pdsDto.secondary.from !== null) {
          secondary = await transactionalEntityManager.save(
            await this.secondaryService.createObject({
              ...pdsDto.secondary,
              employeeId,
            }),
          );
        }

        let vocational = [];
        if (pdsDto.vocational.length > 0) {
          await Promise.all(
            pdsDto.vocational.map(async (vocationalItem) => {
              const { _id, isEdited, isGraduated, isOngoing, ...rest } = vocationalItem;
              vocational.push(
                await transactionalEntityManager.save(
                  await this.vocationalService.createObject({
                    ...rest,
                    employeeId,
                  }),
                ),
              );
            }),
          );
        }

        let college = [];
        if (pdsDto.college.length > 0) {
          await Promise.all(
            pdsDto.college.map(async (collegeItem) => {
              const { _id, isEdited, isGraduated, isOngoing, ...rest } = collegeItem;
              college.push(
                await transactionalEntityManager.save(
                  await this.collegeService.createObject({
                    ...rest,
                    employeeId,
                  }),
                ),
              );
            }),
          );
        }

        let graduate = [];
        if (pdsDto.graduate.length > 0) {
          await Promise.all(
            pdsDto.graduate.map(async (graduateItem) => {
              const { _id, isEdited, isGraduated, isOngoing, ...rest } = graduateItem;
              graduate.push(
                await transactionalEntityManager.save(
                  await this.graduateService.createObject({
                    ...rest,
                    employeeId,
                  }),
                ),
              );
            }),
          );
        }

        let eligibility = [];
        if (pdsDto.eligibility.length > 0) {
          await Promise.all(
            pdsDto.eligibility.map(async (eligibilityItem) => {
              const { _id, examDate, examDateFrom, isEdited, isOneDayOfExam, examDateTo, ...rest } = eligibilityItem;
              const { from, to } = examDate;
              let _examDate = '';
              if (examDateTo === null) _examDate = from;
              else _examDate = from + ' to ' + to;

              eligibility.push(
                await transactionalEntityManager.save(
                  await this.eligibilityService.createObject({
                    ...rest,
                    examDate: _examDate,
                    employeeId,
                  }),
                ),
              );
            }),
          );
        }

        let workExperience = [];
        if (pdsDto.workExperience.length > 0) {
          await Promise.all(
            pdsDto.workExperience.map(async (workExperienceItem) => {
              const { _id, isEdited, isOngoing, ...rest } = workExperienceItem;
              workExperience.push(
                await transactionalEntityManager.save(
                  await this.workExperienceService.createObject({
                    ...rest,
                    employeeId,
                  }),
                ),
              );
            }),
          );
        }

        let voluntaryWork = [];
        if (pdsDto.voluntaryWork.length > 0) {
          await Promise.all(
            pdsDto.voluntaryWork.map(async (voluntaryWorkItem) => {
              const { _id, isCurrentlyVol, isEdited, ...rest } = voluntaryWorkItem;
              voluntaryWork.push(
                await transactionalEntityManager.save(
                  await this.voluntaryWorkService.createObject({
                    ...rest,
                    employeeId,
                  }),
                ),
              );
            }),
          );
        }

        let learningDevelopment = [];
        if (pdsDto.learningDevelopment.length > 0) {
          await Promise.all(
            pdsDto.learningDevelopment.map(async (learningDevelopmentItem) => {
              const { _id, isEdited, ...rest } = learningDevelopmentItem;
              learningDevelopment.push(
                await transactionalEntityManager.save(
                  await this.learningDevelopmentService.createObject({
                    ...rest,
                    employeeId,
                  }),
                ),
              );
            }),
          );
        }

        let skills = [];
        if (pdsDto.skills.length > 0) {
          await Promise.all(
            pdsDto.skills.map(async (skill) => {
              const { _id, isEdited, ...rest } = skill;
              skills.push(
                await transactionalEntityManager.save(
                  await this.skillsService.createObject({
                    ...rest,
                    employeeId,
                  }),
                ),
              );
            }),
          );
        }

        let organizations = [];
        if (pdsDto.organizations.length > 0) {
          await Promise.all(
            pdsDto.organizations.map(async (organization) => {
              const { _id, isEdited, ...rest } = organization;
              organizations.push(
                await transactionalEntityManager.save(
                  await this.organizationService.createObject({
                    ...rest,
                    employeeId,
                  }),
                ),
              );
            }),
          );
        }

        let recognitions = [];
        if (pdsDto.recognitions.length > 0) {
          await Promise.all(
            pdsDto.recognitions.map(async (recognition) => {
              const { _id, isEdited, ...rest } = recognition;
              recognitions.push(
                await transactionalEntityManager.save(
                  await this.recognitionService.createObject({
                    ...rest,
                    employeeId,
                  }),
                ),
              );
            }),
          );
        }

        const officeRelation = await transactionalEntityManager.save(
          await this.officeRelationService.createObject({
            ...pdsDto.officeRelation,
            employeeId,
          }),
        );

        const guiltyCharged = await transactionalEntityManager.save(
          await this.guiltyChargedService.createObject({
            ...pdsDto.guiltyCharged,
            employeeId,
          }),
        );

        const convicted = await transactionalEntityManager.save(
          await this.convictedService.createObject({
            ...pdsDto.convicted,
            employeeId,
          }),
        );

        const separatedService = await transactionalEntityManager.save(
          await this.separatedServiceService.createObject({
            ...pdsDto.separatedService,
            employeeId,
          }),
        );

        const candidateResigned = await transactionalEntityManager.save(
          await this.candidateResignedService.createObject({
            ...pdsDto.candidateResigned,
            employeeId,
          }),
        );

        const immigrant = await transactionalEntityManager.save(
          await this.immigrantService.createObject({
            ...pdsDto.immigrant,
            employeeId,
          }),
        );

        const indigenousPwdSoloParent = await transactionalEntityManager.save(
          await this.indigenousPwdSoloParentService.createObject({
            ...pdsDto.indigenousPwdSoloParent,
            employeeId,
          }),
        );

        let references = [];
        if (pdsDto.references.length > 0) {
          await Promise.all(
            pdsDto.references.map(async (reference) => {
              const { _id, isEdited, ...rest } = reference;
              references.push(
                await transactionalEntityManager.save(
                  await this.referencesService.createObject({
                    ...rest,
                    employeeId,
                  }),
                ),
              );
            }),
          );
        }

        const { issueDate, ...restGovernmentIssuedId } = pdsDto.governmentIssuedId;
        let _issueDate = issueDate;
        //console.log('issue date ', issueDate);
        if (_issueDate.toString() === '') _issueDate = null;
        console.log('Issue Date ', _issueDate);
        const governmentIssuedId = await transactionalEntityManager.save(
          await this.governmentIssuedIdService.createObject({
            ...restGovernmentIssuedId,
            employeeId,
            issueDate: _issueDate,
          }),
        );

        /**
         * 
         * const { issueDate, ...rest } = governmentIssuedIdDTO;
    let _issueDate = issueDate;
    if (issueDate.toString() === '') _issueDate = null;
    return await this.updatePdsByEmployeeId(employeeId, { ...rest, issueDate: _issueDate });
         * 
         */

        return {
          personalInfo,
          governmentIssuedIds,
          address: {
            permanent: permanentAddress,
            residential: residentialAddress,
          },
          family: {
            parents,
            spouse,
            children,
          },
          education: {
            elementary,
            secondary,
            vocational,
            college,
            graduate,
          },
          eligibility,
          workExperience,
          voluntaryWork,
          learningDevelopment,
          skills,
          organizations,
          recognitions,
          officeRelation,
          guiltyCharged,
          convicted,
          separatedService,
          candidateResigned,
          immigrant,
          indigenousPwdSoloParent,
          references,
          governmentIssuedId,
        };
      });
      return result;
    } catch (error) {
      //console.log('shit');
      throw new HttpException(error.message, 500);
    }
  }

  async getPds(employeeId: string) {
    try {
      const applicantInfo = await this.employeeService.findRecordByUserId(employeeId);
      const personalInfo = await this.personalInfoService.findPdsByEmployeeId(employeeId);
      const permanentAddress = await this.permanentAddressService.findPdsByEmployeeId(employeeId);
      const residentialAddress = await this.residentialAddressService.findPdsByEmployeeId(employeeId);
      const children = await this.childrenService.findAllPdsEmployeeId(employeeId);
      const spouse = await this.spouseService.findPdsByEmployeeId(employeeId);
      const parents = await this.parentsService.findPdsByEmployeeId(employeeId);
      const {
        fatherFirstName,
        fatherMiddleName,
        fatherLastName,
        motherFirstName,
        motherMaidenName,
        motherMiddleName,
        motherLastName,
        fatherNameExtension,
      } = parents;
      const elementary = await this.elementaryService.findPdsByEmployeeId(employeeId);
      const secondary = await this.secondaryService.findPdsByEmployeeId(employeeId);
      const vocational = await this.vocationalService.findAllPdsEmployeeId(employeeId);
      const college = await this.collegeService.findAllPdsEmployeeId(employeeId);

      const graduate = await this.graduateService.findAllPdsEmployeeId(employeeId);

      const eligibility = await this.eligibilityService.findAllPdsEmployeeId(employeeId);

      const workExperience = await this.workExperienceService.findAllPdsEmployeeId(employeeId);
      const voluntaryWork = await this.voluntaryWorkService.findAllPdsEmployeeId(employeeId);

      const learningDevelopment = await this.learningDevelopmentService.findAllPdsEmployeeId(employeeId);

      const _skills = await this.skillsService.findAllPdsEmployeeId(employeeId);
      const skills = await Promise.all(
        _skills.map(async (skill) => {
          return skill.skill;
        }),
      );

      const _recognitions = await this.recognitionService.findAllPdsEmployeeId(employeeId);
      const recognitions = await Promise.all(
        _recognitions.map(async (recognition) => {
          return recognition.recognition;
        }),
      );
      const _organization = await this.organizationService.findAllPdsEmployeeId(employeeId);
      const organizations = await Promise.all(
        _organization.map(async (org) => {
          return org.organization;
        }),
      );
      const officeRelation = await this.officeRelationService.findPdsByEmployeeId(employeeId);
      const guiltyCharged = await this.guiltyChargedService.findPdsByEmployeeId(employeeId);
      const convicted = await this.convictedService.findPdsByEmployeeId(employeeId);
      const separatedService = await this.separatedServiceService.findPdsByEmployeeId(employeeId);
      const candidateResigned = await this.candidateResignedService.findPdsByEmployeeId(employeeId);
      const immigrant = await this.immigrantService.findPdsByEmployeeId(employeeId);
      const indigenousPwdSoloParent = await this.indigenousPwdSoloParentService.findPdsByEmployeeId(employeeId);
      const references = await this.referencesService.findAllPdsEmployeeId(employeeId);
      const governmentIssuedId = await this.governmentIssuedIdService.findPdsByEmployeeId(employeeId);
      return {
        basicInfo: {
          personalInfo: { ...applicantInfo, ...personalInfo },
          governmentIssuedId,
          address: {
            permanentAddress,
            residentialAddress,
          },
        },
        family: {
          children,
          spouse,
          parents: {
            father: {
              fatherFirstName,
              fatherMiddleName,
              fatherLastName,
              fatherNameExtension,
            },
            mother: {
              motherFirstName,
              motherMiddleName,
              motherLastName,
              motherMaidenName,
            },
          },
        },
        education: {
          elementary,
          secondary,
          vocational,
          college,
          graduate,
        },
        eligibility,
        workExperience,
        voluntaryWork,
        learningDevelopment,
        otherInfo: {
          skills,
          recognitions,
          organizations,
          references,
          governmentIssuedId,
          supportingDetails: {
            officeRelation,
            guiltyCharged,
            convicted,
            separatedService,
            candidateResigned,
            immigrant,
            indigenousPwdSoloParent,
          },
        },
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, 404);
    }
  }

  async getWDPds(employeeId: string) {
    try {
      const applicantInfo = await this.employeeService.findRecordByUserId(employeeId);
      const personalInfo = await this.personalInfoService.findPdsByEmployeeId(employeeId);
      const governmentIssuedIds = await this.governmentInfoService.findPdsByEmployeeId(employeeId);
      const permanentAddress = await this.permanentAddressService.findPdsByEmployeeId(employeeId);
      const residentialAddress = await this.residentialAddressService.findPdsByEmployeeId(employeeId);
      const children = await this.childrenService.findAllPdsEmployeeId(employeeId);
      const spouse = await this.spouseService.findPdsByEmployeeId(employeeId);
      const parents = await this.parentsService.findPdsByEmployeeId(employeeId);

      const {
        fatherFirstName,
        fatherMiddleName,
        fatherLastName,
        motherFirstName,
        motherMiddleName,
        motherLastName,
        fatherNameExtension,
      } = parents;

      const elementary = await this.elementaryService.findPdsByEmployeeId(employeeId);

      const secondary = await this.secondaryService.findPdsByEmployeeId(employeeId);

      const vocational = await this.vocationalService.getVocational(employeeId);

      const college = await this.collegeService.getCollege(employeeId);

      const graduate = await this.graduateService.getGraduate(employeeId);

      const eligibility = await this.eligibilityService.getEligibility(employeeId);

      const workExperience = await this.workExperienceService.getWDWorkExperience(employeeId);

      const voluntaryWork = await this.voluntaryWorkService.getVoluntaryWork(employeeId);

      const learningDevelopment = await this.learningDevelopmentService.getAllWDLearningAndDevelopment(employeeId);

      const skills = await this.skillsService.findAllPdsEmployeeId(employeeId);

      const recognitions = await this.recognitionService.findAllPdsEmployeeId(employeeId);

      const organizations = await this.organizationService.findAllPdsEmployeeId(employeeId);

      const officeRelation = await this.officeRelationService.findPdsByEmployeeId(employeeId);

      const guiltyCharged = await this.guiltyChargedService.findPdsByEmployeeId(employeeId);

      const convicted = await this.convictedService.findPdsByEmployeeId(employeeId);

      const separatedService = await this.separatedServiceService.findPdsByEmployeeId(employeeId);

      const candidateResigned = await this.candidateResignedService.findPdsByEmployeeId(employeeId);

      const immigrant = await this.immigrantService.findPdsByEmployeeId(employeeId);

      const indigenousPwdSoloParent = await this.indigenousPwdSoloParentService.findPdsByEmployeeId(employeeId);

      const references = await this.referencesService.findAllPdsEmployeeId(employeeId);

      const governmentIssuedId = await this.governmentIssuedIdService.findPdsByEmployeeId(employeeId);

      return {
        personalInfo: { ...applicantInfo, ...personalInfo },
        governmentIssuedIds,
        permanentAddress,
        residentialAddress,
        children,
        spouse,
        parents: {
          fatherFirstName,
          fatherMiddleName,
          fatherLastName,
          fatherNameExtension,
          motherFirstName,
          motherMiddleName,
          motherLastName,
        },
        elementary,
        secondary,
        vocational,
        college,
        graduate,
        eligibility,
        workExperience,
        voluntaryWork,
        learningDevelopment,
        skills,
        recognitions,
        organizations,
        references,
        governmentIssuedId,
        officeRelation,
        guiltyCharged,
        convicted,
        separatedService,
        candidateResigned,
        immigrant,
        indigenousPwdSoloParent,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, 404);
    }
  }

  async getPdsV2(employeeId: string) {
    console.log('V2', employeeId);

    try {
      const applicantInfo = await this.employeeService.findRecordByUserId(employeeId);
      const personalInfo = await this.personalInfoService.getPersonalInfo(employeeId);
      const governmentIssuedIds = await this.governmentInfoService.findPdsByEmployeeId(employeeId);
      const permanentAddress = await this.permanentAddressService.findPdsByEmployeeId(employeeId);
      const residentialAddress = await this.residentialAddressService.findPdsByEmployeeId(employeeId);
      const children = await this.childrenService.findAllPdsEmployeeId(employeeId);
      const spouse = await this.spouseService.findPdsByEmployeeId(employeeId);
      const parents = await this.parentsService.findPdsByEmployeeId(employeeId);

      const {
        fatherFirstName,
        fatherMiddleName,
        fatherLastName,
        motherFirstName,
        motherMiddleName,
        motherLastName,
        fatherNameExtension,
      } = parents;

      const elementary = await this.elementaryService.findPdsByEmployeeId(employeeId);

      const secondary = await this.secondaryService.getSecondary(employeeId);

      const vocational = await this.vocationalService.getVocational(employeeId);

      const college = await this.collegeService.getCollege(employeeId);

      const graduate = await this.graduateService.getGraduate(employeeId);

      const eligibility = await this.eligibilityService.getEligibility(employeeId);

      const workExperience = await this.workExperienceService.getWorkExperience(employeeId);

      const voluntaryWork = await this.voluntaryWorkService.getVoluntaryWork(employeeId);

      const learningDevelopment = await this.learningDevelopmentService.getAllLearningAndDevelopment(employeeId);

      const skills = await this.skillsService.findAllPdsEmployeeId(employeeId);

      const recognitions = await this.recognitionService.findAllPdsEmployeeId(employeeId);

      const organizations = await this.organizationService.findAllPdsEmployeeId(employeeId);

      const officeRelation = await this.officeRelationService.findPdsByEmployeeId(employeeId);

      const guiltyCharged = await this.guiltyChargedService.findPdsByEmployeeId(employeeId);

      const convicted = await this.convictedService.findPdsByEmployeeId(employeeId);

      const separatedService = await this.separatedServiceService.findPdsByEmployeeId(employeeId);

      const candidateResigned = await this.candidateResignedService.findPdsByEmployeeId(employeeId);

      const immigrant = await this.immigrantService.findPdsByEmployeeId(employeeId);

      const indigenousPwdSoloParent = await this.indigenousPwdSoloParentService.findPdsByEmployeeId(employeeId);

      const references = await this.referencesService.findAllPdsEmployeeId(employeeId);

      const governmentIssuedId = await this.governmentIssuedIdService.findPdsByEmployeeId(employeeId);
      console.log(secondary);
      return {
        personalInfo: { ...applicantInfo, ...personalInfo },
        governmentIssuedIds,
        permanentAddress,
        residentialAddress,
        children,
        spouse,
        parents: {
          fatherFirstName,
          fatherMiddleName,
          fatherLastName,
          fatherNameExtension,
          motherFirstName,
          motherMiddleName,
          motherLastName,
        },
        elementary,
        secondary,
        vocational,
        college,
        graduate,
        eligibility,
        workExperience,
        voluntaryWork,
        learningDevelopment,
        skills,
        recognitions,
        organizations,
        references,
        governmentIssuedId,
        officeRelation,
        guiltyCharged,
        convicted,
        separatedService,
        candidateResigned,
        immigrant,
        indigenousPwdSoloParent,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, 404);
    }
  }

  async getApplicantPdsWithWorkExperience(postingApplicantId: string) {
    const employeeId = await lastValueFrom(
      this.client.send('get_employee_id_by_posting_applicant_id', postingApplicantId),
    );
    const pds = await this.getPdsV2(employeeId);
    const workExperienceSheet = await this.workExperienceSheetService.getWorkExperienceSheet(postingApplicantId);
    return { ...pds, workExperienceSheet };
  }

  async getLspPdsDetails(employeeId: string) {
    try {
      console.log(employeeId);
      const fullName = await this.employeeService.getEmployeeFullName(employeeId);
      const lspEmployeeInfo = await this.employeeService.findRecordByUserId(employeeId);
      const { email, photoUrl, sex } = lspEmployeeInfo;
      const personalInfo = await this.personalInfoService.getPersonalInfo(employeeId);
      const { mobileNumber } = personalInfo;
      const residentialAddress = await this.residentialAddressService.findPdsByEmployeeId(employeeId);
      const { barangay, city, houseNumber, province, street, zipCode, subdivision } = residentialAddress;
      const governmentIssuedIds = await this.governmentInfoService.findPdsByEmployeeId(employeeId);
      const { tinNumber } = governmentIssuedIds;
      const awards = await this.recognitionService.getAwards(employeeId);
      const certifications = await this.eligibilityService.getEligibilityNamesByEmployeeId(employeeId);
      const graduate = await this.graduateService.getGraduateInstitutionDegree(employeeId);
      const college = await this.collegeService.getCollegeInstitutionDegree(employeeId);
      const postalAddress =
        (houseNumber ? houseNumber : '') +
        (street ? ', ' + street : '') +
        (subdivision ? ', ' + subdivision : '') +
        (barangay ? ', ' + barangay : '') +
        (city ? ', ' + city : '') +
        (province ? ', ' + province : '') +
        (zipCode ? ', ' + zipCode : '');
      const lspBasicDetails = {
        employeeId,
        sex,
        fullName,
        email,
        photoUrl,
        contactNumber: mobileNumber,
        postalAddress,
        tin: tinNumber,
        awards,
        certifications,
        education: [...graduate, ...college],
      };
      return lspBasicDetails;
    } catch (error) {
      console.log(error);
    }
  }
}
