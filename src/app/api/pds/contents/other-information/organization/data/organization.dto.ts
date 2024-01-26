export class OrganizationDTO {
  _id?: string;
  employeeId: string;
  organization: string;
  isEdited?: boolean;
}

export type OrganizationType = Omit<OrganizationDTO, 'employeeId'>;

export class AddOrganizationDTO {
  add: OrganizationType[];
  update: OrganizationType[];
  delete: OrganizationType[];
}
