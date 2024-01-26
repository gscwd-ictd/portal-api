import { PdsService } from './../pds/core/pds.service';
import { LearningDevelopmentService } from './../pds/contents/learning-development/core/learning-development.service';
import { WorkExperienceService } from './../pds/contents/work-experience/core/work-experience.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Employee201Service {
  constructor(
    private readonly workExperienceService: WorkExperienceService,
    private readonly learningDevelopmentService: LearningDevelopmentService,
    private readonly pdsService: PdsService,
  ) {}

  async getWDWorkExperience(employeeId: string) {
    return await this.workExperienceService.getWDWorkExperience(employeeId);
  }

  async getAllWDLearningDevelopment(employeeId: string) {
    return await this.learningDevelopmentService.getAllWDLearningAndDevelopment(employeeId);
  }

  async getWDPDS(employeeId: string) {
    return await this.pdsService.getWDPds(employeeId);
  }
}
