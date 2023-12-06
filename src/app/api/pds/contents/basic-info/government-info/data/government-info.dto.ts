export class CreateGovernmentInfoDto {
  employeeId: string;
  gsisNumber: string;
  pagibigNumber: string;
  philhealthNumber: string;
  sssNumber: string;
  tinNumber: string;
  agencyNumber: string;
}

export type UpdateGovernmentInfoDto = Omit<CreateGovernmentInfoDto, 'employeeId'>;
