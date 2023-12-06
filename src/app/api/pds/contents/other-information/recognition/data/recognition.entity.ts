import { DatabaseEntity, IPdsEntity } from '../../../../../../../utils/database/entity';
import { Entity, JoinColumn, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../../../../user/data/user.entity';

@Entity('pds_recognition')
export class Recognition extends DatabaseEntity implements IPdsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'recognition_id' })
  _id: string;

  @ManyToOne(() => User, (user) => user._id)
  @JoinColumn({ name: 'user_id_fk' })
  employeeId: string;

  @Column()
  recognition: string;
}
