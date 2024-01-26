import { DatabaseEntity, IPdsEntity } from '../../../../../../../utils/database/entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../../../user/data/user.entity';

@Entity('pds_family_spouse')
export class Spouse extends DatabaseEntity implements IPdsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'spouse_id' })
  _id: string;

  @OneToOne(() => User, (user) => user._id)
  @JoinColumn({ name: 'user_id_fk' })
  employeeId: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'middle_name' })
  middleName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'name_extension', nullable: true })
  nameExtension: string;

  @Column({ nullable: true })
  occupation: string;

  @Column({ nullable: true })
  employer: string;

  @Column({ name: 'business_address', nullable: true })
  businessAddress: string;

  @Column({ name: 'telephone_number', nullable: true })
  telephoneNumber: string;
}
