export class SkillsDTO {
  _id?: string;
  employeeId: string;
  skill: string;
  isEdited?: boolean;
}

export type SkillsType = Omit<SkillsDTO, 'employeeId'>;

export class AddSkillsDTO {
  add: SkillsType[];
  delete: SkillsType[];
  update: SkillsType[];
}
