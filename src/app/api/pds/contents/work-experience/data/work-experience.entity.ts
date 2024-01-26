import { DatabaseEntity, IPdsEntity } from '../../../../../../utils/database/entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AppointmentStatus } from '../../../misc/pds.enum';
import { User } from '../../../../user/data/user.entity';

@Entity('pds_work_experience')
export class WorkExperience extends DatabaseEntity implements IPdsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'work_experience_id' })
  _id: string;

  @ManyToOne(() => User, (user) => user._id)
  @JoinColumn({ name: 'user_id_fk' })
  employeeId: string;

  @Column({ name: 'position_title' })
  positionTitle: string;

  @Column({ name: 'company_name' })
  companyName: string;

  @Column({ name: 'monthly_salary' })
  monthlySalary: number;

  @Column({ name: 'appointment_status', type: 'enum', enum: AppointmentStatus })
  appointmentStatus: AppointmentStatus;

  @Column({ name: 'is_government_service', type: 'boolean' })
  isGovernmentService: boolean;

  @Column({ name: 'salary_grade', nullable: true })
  salaryGrade: string;

  @Column({ type: 'date', nullable: true })
  from: Date;

  @Column({ type: 'date', nullable: true })
  to: Date;

  @Column({ name: 'is_wd', type: 'boolean', default: false })
  isWd: boolean;
}
