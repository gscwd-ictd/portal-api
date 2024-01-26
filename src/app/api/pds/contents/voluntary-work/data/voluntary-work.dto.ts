export class VoluntaryWorkDTO {
  _id: string;
  employeeId: string;
  organizationName: string;
  position: string;
  from: Date;
  to: Date | null;
  numberOfHours: number;
  isEdited?: boolean;
  isCurrentlyVol?: boolean;
}

export type VoluntaryWorkType = Omit<VoluntaryWorkDTO, 'employeeId'>;

export class UpdateVoluntaryWorkDTO {
  voluntaryWorks: VoluntaryWorkType[];
}

export class DeleteVoluntaryWorkDTO {
  voluntaryWorkIds: string[];
}

export class AddVoluntaryWorkDTO {
  add: VoluntaryWorkType[];
  update: VoluntaryWorkType[];
  delete: VoluntaryWorkType[];
}
