import { DatabaseEntity, IPdsEntity } from '../../../../../../../../utils/database/entity';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User } from '../../../../../../user/data/user.entity';

@Entity('pds_separated_service')
export class SeparatedService extends DatabaseEntity implements IPdsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'separated_service_id' })
  _id: string;

  @OneToOne(() => User, (user) => user._id)
  @JoinColumn({ name: 'user_id_fk' })
  employeeId: string;

  @Column({ name: 'is_separated', type: 'boolean' })
  isSeparated: boolean;

  @Column()
  details: string;
}
