import { Employee } from 'src/app/api/employee/data/employee.entity';
import { PrimaryGeneratedColumn, OneToOne, JoinColumn, Column } from 'typeorm';

export class GovernmentIssuedIdDTO {
  _id?: string;
  employeeId: string;
  issuedId: string;
  idNumber: string;
  issueDate: Date | null;
  issuePlace: string;
}

export type GovernmentIssuedIdType = Omit<GovernmentIssuedIdDTO, 'employeeId'>;
