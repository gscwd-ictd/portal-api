export type Credentials = {
  email: string;
  password: string;
  clientId: string;
  secret: string;
};

export type UserCredentials = {
  email: string;
  password: string;
};

export type UserSignupDetails = {
  companyId: string | null;
  firstName: string;
  middleName: string;
  lastName: string;
  nameExt: string;
};

export type AppCredentials = {
  clientId: string;
  secret: string;
};

export type AuthenticatedUser = {
  _id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type VerifiedApp = {
  _id: string;
  callbackUrl: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export enum Roles {
  BOARD_MEMBER = 'board_member',
  GENERAL_MANAGER = 'general_manager',
  ASSISTANT_GENERAL_MANAGER = 'assistant_general_manager',
  DEPARTMENT_MANAGER = 'department_manager',
  DIVISION_MANAGER = 'division_manager',
  RANK_AND_FILE = 'rank_and_file',
}
