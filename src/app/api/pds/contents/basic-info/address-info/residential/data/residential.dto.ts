export class CreateResidentialAddressDto {
  employeeId: string;
  houseNumber: string;
  street: string;
  subdivision: string;
  barangay: string;
  city: string;
  province: string;
  zipCode: string;
}

export type UpdateResidentialAddressDto = Omit<CreateResidentialAddressDto, 'employeeId'>;
