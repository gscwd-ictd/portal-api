export class CreatePermanentAddressDto {
  employeeId?: string;
  houseNumber: string;
  street: string;
  subdivision: string;
  barangay: string;
  city: string;
  province: string;
  zipCode: string;
}

export type UpdatePermanentAddressDto = Omit<CreatePermanentAddressDto, 'employeeId'>;
