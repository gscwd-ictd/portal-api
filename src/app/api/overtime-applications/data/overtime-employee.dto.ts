import { IsArray, IsDate, IsNumber, IsUUID } from 'class-validator';

export class DeleteOvertimeEmployeeDto {
  @IsUUID()
  overtimeApplicationId: string;

  @IsUUID()
  employeeId: string;
}

export class UpdateOvertimeApplicationDto {
  @IsUUID()
  id: string;
  @IsUUID()
  employeeId: string;
  @IsNumber()
  estimatedHours: number;
  @IsDate()
  plannedDate: Date;
  @IsArray()
  @IsUUID('all', { each: true })
  employees: string[];
}
