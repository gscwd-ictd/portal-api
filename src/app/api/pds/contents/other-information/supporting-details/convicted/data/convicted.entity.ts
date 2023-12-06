import { DatabaseEntity, IPdsEntity } from '../../../../../../../../utils/database/entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../../../../user/data/user.entity';

@Entity('pds_convicted')
export class Convicted extends DatabaseEntity implements IPdsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'convicted_id' })
  _id: string;

  @OneToOne(() => User, (user) => user._id)
  @JoinColumn({ name: 'user_id_fk' })
  employeeId: string;

  @Column({ name: 'is_convicted', type: 'boolean' })
  isConvicted: boolean;

  @Column()
  details: string;
}
