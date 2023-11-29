export class CreateSpouseDto {
  employeeId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  nameExtension: string;
  occupation: string;
  employer: string;
  businessAddress: string;
  telephoneNumber: string;
}

export type UpdateSpouseDto = Omit<CreateSpouseDto, 'employeeId'>;
