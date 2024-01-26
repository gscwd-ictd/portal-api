import { IPdsEntity } from '../../../../../../../../utils/database/entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Education } from '../../../data/education.entity';
import { User } from '../../../../../../user/data/user.entity';

@Entity('pds_education_secondary')
export class Secondary extends Education implements IPdsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'secondary_id' })
  _id: string;

  @OneToOne(() => User, (user) => user._id)
  @JoinColumn({ name: 'user_id_fk' })
  employeeId: string;

  @Column()
  degree: string;

  @Column({ default: null })
  units: string;
}
