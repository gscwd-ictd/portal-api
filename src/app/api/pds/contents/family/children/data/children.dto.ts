export class CreateChildDto {
  _id?: string;
  employeeId: string;
  childName: string;
  birthDate: Date;
  isEdited?: boolean;
}

export type Child = {
  _id?: string;
} & Omit<CreateChildDto, 'employeeId'>;

export class UpdateChildrenDTO {
  children: Child[];
}

export class DeleteChildrenDTO {
  children: string[];
}

export class ChildrenDTO {
  //children: Child[];
  add: Child[];
  delete: Child[];
  update: Child[];
}
