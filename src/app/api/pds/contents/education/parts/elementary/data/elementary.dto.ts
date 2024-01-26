import { EducationDTO } from '../../../data/education.dto';

export class ElementaryDTO extends EducationDTO {
  schoolName: string;
  from: number;
  to: number;
  yearGraduated: number;
  awards: string;
  _id?: string;
  employeeId: string;
}
