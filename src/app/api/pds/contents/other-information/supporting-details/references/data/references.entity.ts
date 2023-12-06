import { DatabaseEntity, IPdsEntity } from '../../../../../../../../utils/database/entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../../../../../user/data/user.entity';

@Entity('pds_references')
export class References extends DatabaseEntity implements IPdsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'reference_id' })
  _id: string;

  @ManyToOne(() => User, (user) => user._id)
  @JoinColumn({ name: 'user_id_fk' })
  employeeId: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ name: 'telephone_number' })
  telephoneNumber: string;
}
