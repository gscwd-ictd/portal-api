export class GuiltyChargedDTO {
  _id?: string;
  employeeId: string;
  isGuilty: boolean;
  guiltyDetails: string;
  isCharged: boolean;
  chargedDateFiled: Date;
  chargedCaseStatus: string;
}
