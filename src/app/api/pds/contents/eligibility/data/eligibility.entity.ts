import { DatabaseEntity, IPdsEntity } from '../../../../../../utils/database/entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User } from '../../../../user/data/user.entity';

@Entity('pds_eligibility')
export class Eligibility extends DatabaseEntity implements IPdsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'eligibility_id' })
  _id: string;

  @ManyToOne(() => User, (user) => user._id)
  @JoinColumn({ name: 'user_id_fk' })
  employeeId: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  rating: number;

  @Column({ name: 'exam_date' })
  examDate: string;

  @Column({ name: 'exam_place' })
  examPlace: string;

  @Column({ name: 'license_number', default: null, nullable: true })
  licenseNumber: string;

  @Column({ name: 'validity', default: null, nullable: true })
  validity: Date;
}
