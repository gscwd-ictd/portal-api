export type EmployeeDetailsFromHr = {
  isPdcChairman: boolean;
  isPdcSecretariat: boolean;
  officerOfTheDay: string[];
  isHRMPSB: boolean;
  userRole: string;
  overtimeImmediateSupervisorId: string;
  assignment: { positionTitle: string };
};
