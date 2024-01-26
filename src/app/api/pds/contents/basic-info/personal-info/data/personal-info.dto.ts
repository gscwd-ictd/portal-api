import { Sex } from './../../../../../employee/data/employee.entity';
import { CivilStatus, Citizenship, CitizenshipType, BloodType } from '../../../../misc/pds.enum';

export class CreatePersonalInfoDto {
  employeeId: string;
  email?: string;
  civilStatus: CivilStatus;
  birthPlace: string;
  country: string;
  citizenship: Citizenship;
  citizenshipType: CitizenshipType;
  height: number;
  weight: number;
  bloodType: BloodType;
  telephoneNumber: string;
  mobileNumber?: string;
  birthDate?: Date;
  middleName?: string;
  sex?: Sex;
}

export type UpdatePersonalInfoDto = Omit<CreatePersonalInfoDto, 'employeeId'> & {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  nameExtension?: string;
  birthDate?: Date;
  sex?: Sex;
  mobileNumber?: string;
};
