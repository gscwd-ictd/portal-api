export class CreateParentsDto {
  employeeId: string;
  fatherFirstName: string;
  fatherMiddleName: string;
  fatherLastName: string;
  fatherNameExtension: string;
  motherFirstName: string;
  motherMiddleName: string;
  motherLastName: string;
  motherMaidenName: string;
}

export type UpdateParentsDto = Omit<CreateParentsDto, 'employeeId'>;

export type ParentMama = Omit<
  UpdateParentsDto,
  'fatherFirstName' | 'fatherLastName' | 'fatherMiddleName' | 'fatherNameExtension'
>;
export type ParentPapa = Omit<
  UpdateParentsDto,
  'motherFirstName' | 'motherLastName' | 'motherMiddleName' | 'motherMaidenName'
>;
