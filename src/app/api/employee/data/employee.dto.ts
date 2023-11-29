import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Sex } from './employee.entity';

export class CreateEmployeeDto {
  userId: string;

  companyId: string;

  firstName: string;

  middleName: string;

  lastName: string;

  nameExt: string;

  sex: Sex;

  birthDate: Date;

  mobileNumber: string;

  email: string;

  photoUrl: string;
}

//! omit userId field for updating employee
export class UpdateEmployeeDto extends CreateEmployeeDto {}

export class TestDTO {
  @IsNotEmpty()
  name: string;
}

export class TestNested {
  @IsNotEmpty()
  name1: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestDTO)
  test: TestDTO[];
}
