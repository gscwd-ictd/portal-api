import { IsUUID } from 'class-validator';

export class DeleteOvertimeEmployeeDto {
    @IsUUID()
    overtimeApplicationId: string;

    @IsUUID()
    employeeId: string;
}
