export class ReferencesDTO {
  _id?: string;
  employeeId: string;
  name: string;
  address: string;
  telephoneNumber: string;
  isEdited?: boolean;
}

export type Reference = Omit<ReferencesDTO, 'employeeId'>;

export class AddReferencesDTO {
  add: Reference[];
  update: Reference[];
  delete: Reference[];
}
