import { Roles } from 'src/utils/types/auth-type';

export class CreateUserDto {
  _id: string;

  email: string;

  password: string;

  companyId: string | null;

  firstName: string;

  middleName: string;

  lastName: string;

  nameExt: string;
}

//! omit _id in update dto
export class UpdateUserDto extends CreateUserDto {}
