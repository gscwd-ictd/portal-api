import { DatabaseEntity, IPdsEntity } from '../../../../../../../../utils/database/entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../../../../user/data/user.entity';

@Entity('pds_government_issued_id')
export class GovernmentIssuedId extends DatabaseEntity implements IPdsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'government_issued_id' })
  _id: string;

  @OneToOne(() => User, (user) => user._id)
  @JoinColumn({ name: 'user_id_fk' })
  employeeId: string;

  @Column({ name: 'issued_id' })
  issuedId: string;

  @Column({ name: 'id_number' })
  idNumber: string;

  @Column({ type: 'date', name: 'issue_date', nullable: true })
  issueDate: Date;

  @Column({ name: 'issue_place' })
  issuePlace: string;
}
