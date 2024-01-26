export abstract class EducationDTO {
  schoolName: string;
  from: number;
  to: number;
  yearGraduated: number;
  awards: string;
  _id?: string;
  employeeId: string;
  degree: string;
  units?: string;
  isOngoing?: boolean;
  isEdited?: boolean;
  isGraduated?: boolean;
}

export type EducationType = Omit<EducationDTO, 'employeeId'>;

export class AddEducationDTO {
  //education: EducationType[];
  add: EducationType[];
  update: EducationType[];
  delete: EducationType[];
}
