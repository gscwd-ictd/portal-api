import { DatabaseEntity, IPdsEntity } from '../../../../../../../../utils/database/entity';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User } from '../../../../../../user/data/user.entity';

@Entity('pds_office_relation')
export class OfficeRelation extends DatabaseEntity implements IPdsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'office_relation_id' })
  _id: string;

  @OneToOne(() => User, (user) => user._id)
  @JoinColumn({ name: 'user_id_fk' })
  employeeId: string;

  @Column({ name: 'within_third_degree', type: 'boolean' })
  withinThirdDegree: boolean;

  @Column({ name: 'within_fourth_degree', type: 'boolean' })
  withinFourthDegree: boolean;

  @Column()
  details: string;
}
