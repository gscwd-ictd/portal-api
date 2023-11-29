import { DatabaseEntity, IPdsEntity } from '../../../../../../../utils/database/entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../../../user/data/user.entity';

@Entity('pds_organization')
export class Organization extends DatabaseEntity implements IPdsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'organization_id' })
  _id: string;

  @ManyToOne(() => User, (user) => user._id)
  @JoinColumn({ name: 'user_id_fk' })
  employeeId: string;

  @Column({ name: 'organization' })
  organization: string;
}
