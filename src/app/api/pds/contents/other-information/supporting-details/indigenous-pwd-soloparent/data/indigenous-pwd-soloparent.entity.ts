import { DatabaseEntity, IPdsEntity } from '../../../../../../../../utils/database/entity';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User } from '../../../../../../user/data/user.entity';

@Entity('pds_indigenous_pwd_soloparent')
export class IndigenousPWDSoloParent extends DatabaseEntity implements IPdsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'indigenous_pwd_soloparent_id' })
  _id: string;

  @OneToOne(() => User, (user) => user._id)
  @JoinColumn({ name: 'user_id_fk' })
  employeeId: string;

  @Column({ name: 'is_indigenous_member', type: 'boolean' })
  isIndigenousMember: boolean;

  @Column({ name: 'indigenous_member_details' })
  indigenousMemberDetails: string;

  @Column({ name: 'is_pwd', type: 'boolean' })
  isPwd: boolean;

  @Column({ name: 'pwd_id_number' })
  pwdIdNumber: string;

  @Column({ name: 'is_soloparent', type: 'boolean' })
  isSoloParent: boolean;

  @Column({ name: 'soloparent_id_number' })
  soloParentIdNumber: string;
}
