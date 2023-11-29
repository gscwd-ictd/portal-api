import { DatabaseEntity, IPdsEntity } from '../../../../../../../../utils/database/entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../../../../user/data/user.entity';

@Entity('pds_guilty_charged')
export class GuiltyCharged extends DatabaseEntity implements IPdsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'convicted_id' })
  _id: string;

  @OneToOne(() => User, (user) => user._id)
  @JoinColumn({ name: 'user_id_fk' })
  employeeId: string;

  @Column({ name: 'is_guilty', type: 'boolean' })
  isGuilty: boolean;

  @Column({ name: 'guilty_details' })
  guiltyDetails: string;

  @Column({ name: 'is_charged', type: 'boolean' })
  isCharged: boolean;

  @Column({ name: 'charged_date_filed', nullable: true })
  chargedDateFiled: Date;

  @Column({ name: 'charged_case_status' })
  chargedCaseStatus: string;
}
