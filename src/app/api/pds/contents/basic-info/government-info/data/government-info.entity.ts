import { User } from '../../../../../user/data/user.entity';
import { DatabaseEntity, IPdsEntity } from '../../../../../../../utils/database/entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pds_basic_government_info')
export class GovernmentInfo extends DatabaseEntity implements IPdsEntity {
  @PrimaryGeneratedColumn({ name: 'government_info_id' })
  _id: string;

  @OneToOne(() => User, (user) => user._id)
  @JoinColumn({ name: 'user_id_fk' })
  employeeId: string;

  @Column({ name: 'gsis_number', nullable: true })
  gsisNumber: string;

  @Column({ name: 'pagibig_number', nullable: true })
  pagibigNumber: string;

  @Column({ name: 'philhealth_number', nullable: true })
  philhealthNumber: string;

  @Column({ name: 'sss_number', nullable: true })
  sssNumber: string;

  @Column({ name: 'tin_number', nullable: true })
  tinNumber: string;

  @Column({ name: 'agency_number', nullable: true })
  agencyNumber: string;
}
