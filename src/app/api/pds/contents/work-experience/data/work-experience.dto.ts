import { AppointmentStatus } from '../../../misc/pds.enum';

export class WorkExperienceDTO {
  _id?: string;
  employeeId: string;
  positionTitle: string;
  companyName: string;
  monthlySalary: number;
  appointmentStatus: AppointmentStatus;
  isGovernmentService: boolean;
  salaryGrade: string;
  from: Date;
  to: Date;
  isEdited?: boolean;
  isOngoing?: boolean;
  isWd?: boolean;
  isPresentWork?: boolean;
}

export type WorkExperienceType = Omit<WorkExperienceDTO, 'employeeId'>;

export class AddWorkExperienceDTO {
  add: WorkExperienceType[];
  update: WorkExperienceType[];
  delete: WorkExperienceType[];
}
