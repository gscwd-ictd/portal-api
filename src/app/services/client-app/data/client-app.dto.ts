export class CreateClientAppDto {
  name: string;

  description: string;

  callbackUrl: string;
}

export class UpdateClientAppDto extends CreateClientAppDto {}
