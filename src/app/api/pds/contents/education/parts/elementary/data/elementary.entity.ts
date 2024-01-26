import { IPdsEntity } from '../../../../../../../../utils/database/entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Education } from '../../../data/education.entity';
import { User } from '../../../../../..//user/data/user.entity';

@Entity('pds_education_elementary')
export class Elementary extends Education implements IPdsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'elementary_id' })
  _id: string;

  @OneToOne(() => User, (user) => user._id)
  @JoinColumn({ name: 'user_id_fk' })
  employeeId: string;

  @Column({ default: null })
  units: string;

  @Column()
  degree: string;
}
