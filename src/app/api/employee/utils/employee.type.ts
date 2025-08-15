export type EmployeeDetailsFromHr = {
  isPdcChairman: boolean;
  isPdcSecretariat: boolean;
  officerOfTheDay: string[];
  isHRMPSB: boolean;
  userRole: string;
  overtimeImmediateSupervisorId: string;
  assignment: { positionTitle: string };
};

export type EmployeeBasicDetails = {
  employeeId: string;
  companyId: string;
  employeeFullName: string;
  salary: number;
};

export enum NatureOfAppointment {
  CASUAL = 'casual',
  PERMANENT = 'permanent',
}
