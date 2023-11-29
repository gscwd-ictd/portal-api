import { DatabaseEntity, IEntity } from '../../../../utils/database/entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/data/user.entity';

export enum Sex {
  MALE = 'Male',
  FEMALE = 'Female',
}

@Entity('employees')
export class Employee extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'employee_id' })
  _id: string;

  @OneToOne(() => User, (user) => user._id, { nullable: false })
  @JoinColumn({ name: 'user_id_fk' })
  userId: string;

  //! set this field to unique, remove nullable: true as soon as companyId is available
  @Column({ name: 'company_id', nullable: true })
  companyId: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'middle_name' })
  middleName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'name_ext', nullable: true })
  nameExtension: string;

  @Column({ type: 'enum', enum: Sex, default: Sex.MALE })
  sex: Sex;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate: Date;

  @Column({ name: 'mobile_number', nullable: true })
  mobileNumber: string;

  @Column({ name: 'email_address', nullable: true })
  email: string;

  @Column({ name: 'photo_url', nullable: true })
  photoUrl: string;
}
