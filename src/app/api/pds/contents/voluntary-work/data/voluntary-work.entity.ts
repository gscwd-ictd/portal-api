import { DatabaseEntity, IPdsEntity } from '../../../../../../utils/database/entity';
import { Entity, JoinColumn, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../../../user/data/user.entity';

@Entity('pds_voluntary_work')
export class VoluntaryWork extends DatabaseEntity implements IPdsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'voluntary_work_id' })
  _id: string;

  @ManyToOne(() => User, (user) => user._id)
  @JoinColumn({ name: 'user_id_fk' })
  employeeId: string;

  @Column({ name: 'organization_name' })
  organizationName: string;

  @Column({ name: 'position' })
  position: string;

  @Column({ type: 'date', nullable: true })
  from: Date;

  @Column({ type: 'date', nullable: true })
  to: Date;

  @Column({ name: 'number_of_hours', nullable: true })
  numberOfHours: number;
}
